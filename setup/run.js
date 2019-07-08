const Constants = require('./Constants');

const generateToken = require('./generateToken');
const subjectsApi = require('./subjectApi');
const disciplinesApi = require('./disciplineApi');
const collectionsApi = require('./collectionApi');
const { insertVideo, findVideos } = require('./videoApi');

const { insertCollection, findOneCollectionId, addVideoToCollection } = require('./collectionApi');

const subjectFixtures = require('./fixture/subjects');
const disciplineFixtures = require('./fixture/disciplines');
const collectionFixtures = require('./fixture/collections');
const ltiCollectionFixture = require('./fixture/lti_collection');
const instructionalVideos = require('./fixture/instructional_videos');
const stockVideos = require('./fixture/stock_videos');
const newsVideos = require('./fixture/news_videos');

if (
  !Constants.TOKEN_URL ||
  !Constants.OPERATOR_USERNAME ||
  !Constants.OPERATOR_PASSWORD
) {
  throw 'Environment variables not set properly.';
}

async function insertVideos(token) {
  const videoPromises = await allVideos();

  return Promise.all(videoPromises.map(async (video) => {
    await insertVideo(video, token)
  }));
}

async function insertSubjects(token) {
  return Promise.all(subjectFixtures.map(subject => subjectsApi.insertSubject(subject, token)));
}

async function insertDisciplines(token) {
  return Promise.all(disciplineFixtures.map(discipline => disciplinesApi.insertDiscipline(discipline, token)));
}

async function insertCollections(token) {
  await Promise.all(collectionFixtures.map(collection => insertCollection(collection, token)));
  await insertLtiCollection(token)
}

async function insertLtiCollection(token) {
  await insertCollection(ltiCollectionFixture, token);
  const ltiCollectionId = await findOneCollectionId(ltiCollectionFixture.title, token);
  return findVideos('Minute Physics', token)
    .then(videos => {
      return Promise.all(videos.map(video => addVideoToCollection(ltiCollectionId, video.id, token)))
    })
}

async function allVideos() {
  const allInterpolatedVideos = await instructionalVideos();

  return [...allInterpolatedVideos, ...stockVideos, ...newsVideos];
}

async function setUp() {
  const token = await generateToken();

  const subjects = await subjectsApi.getSubjects();
  if (!subjects) {
    await insertSubjects(token);
  } else {
    console.log('Subjects already exist, did not update subjects');
  }

  const disciplines = await disciplinesApi.getDisciplines(token);
  if (!disciplines) {
    await insertDisciplines(token);
  } else {
    console.log('Disciplines already exist, did not update disciplines');
  }

  const collections = await collectionsApi.getCollections(token);
  if(!collections) {
    await insertCollections(token)
  } else {
    console.log('Collections already exist, did not update collections');
  }

  console.log('insert all videos');
  await insertVideos(token);

  await insertCollections(token);

  console.log('Setup finished');
  process.exit();
}

setUp();
