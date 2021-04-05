import { getChannels } from '../api/channelApi';
import { getSubjects } from '../api/subjectApi';

export interface VideoFixture {
  providerId: string;
  providerVideoId: string;
  title: string;
  description: string;
  releasedOn: string;
  legalRestrictions: string;
  keywords: string[];
  videoTypes: string[];
  playbackId: string;
  playbackProvider: string;
  subjects?: string[];
  duration?: string;
  ageRangeMin?: number;
  ageRangeMax?: number;
}

function video(params: Partial<VideoFixture>): VideoFixture {
  return {
    providerId: params.providerId!,
    providerVideoId: params.providerVideoId || 'ted-123',
    title: params.title || 'Richard St. John: 8 secrets of success',
    description: params.description || 'Video description',
    releasedOn: params.releasedOn || '2018-12-04T00:00:00',
    legalRestrictions: 'none',
    keywords: ['k1', 'k2'],
    videoTypes: params.videoTypes || ['INSTRUCTIONAL_CLIPS'],
    playbackId: params.playbackId || '0_pqr3lk4n',
    playbackProvider: params.playbackProvider || 'KALTURA',
    subjects: params.subjects || undefined,
    ageRangeMin: params.ageRangeMin || undefined,
    ageRangeMax: params.ageRangeMax || undefined,
  };
}

export async function getParametrisedVideoFixtures(
  token: string,
): Promise<VideoFixture[]> {
  const channels = await getChannels(token);
  const subjects = await getSubjects();

  function convertChannelNameToId(channelName: string) {
    if (channels === undefined) {
      throw new Error('There are no channels');
    }

    if (channelName === undefined) {
      throw new Error('Channel name is undefined');
    }

    const matchingChannels = channels.filter(
      (channel) => channel.name === channelName,
    );

    if (matchingChannels.length === 0) {
      throw Error(`Matched no channels for ${channelName}, check fixtures.`);
    }
    if (matchingChannels.length > 1) {
      throw Error(
        `Matched more than one channel for ${channelName}, check fixtures.`,
      );
    }

    return matchingChannels[0].id;
  }

  function convertSubjectNameToId(subjectName: string) {
    if (subjects === undefined) {
      throw new Error('Subjects are undefined');
    }

    const matchingSubjects = subjects.filter((s) => s.name === subjectName);

    if (matchingSubjects.length === 0) {
      throw Error('Matched no subject, check fixtures.');
    }

    if (matchingSubjects.length > 1) {
      throw Error('Matched more than one subject, check fixtures.');
    }

    return matchingSubjects[0].id;
  }

  const instructionalVideos = getInstructionalVideos(
    convertChannelNameToId,
    convertSubjectNameToId,
  );

  const newsVideos = [
    video({
      providerId: convertChannelNameToId('Reuters'),
      providerVideoId: 'reuters-13',
      title: 'Gdansk Mayor Stabbed at a charity event',
      description: 'Terrible news from Poland',
      releasedOn: '2018-12-03T00:00:00',
      videoTypes: ['NEWS'],
    }),
    video({
      providerId: convertChannelNameToId('Reuters'),
      providerVideoId: 'reuters-14',
      title: "'Richard St. John: 8 secrets of success' goes viral on boclips",
      description:
        'Incredible news as the greatest video has exploded on the internet',
      releasedOn: '2018-12-04T00:00:00',
      videoTypes: ['NEWS'],
    }),
    video({
      providerId: convertChannelNameToId('Reuters'),
      providerVideoId: 'reuters-15',
      title: 'Breaking news',
      description: 'Latest piece of news about Richard',
      releasedOn: '2018-12-05T00:00:00',
      videoTypes: ['NEWS'],
    }),
  ];

  const stockVideos = [
    video({
      providerId: convertChannelNameToId('Getty'),
      providerVideoId: 'getty-12',
      videoTypes: ['STOCK'],
      title: 'Celebrities on the red carpet',
      description: 'Not valuable for education',
    }),
  ];

  const disabled = [
    video({
      providerId: convertChannelNameToId('Disabled From Streaming CP'),
      providerVideoId: 'disabled-123',
      title: 'Disabled',
      description: 'Not legally allowed to show',
    }),
  ];

  return [...instructionalVideos, ...newsVideos, ...stockVideos, ...disabled];
}

export function getInstructionalVideos(
  convertChannelNameToId: (channelName: string) => string | undefined = () =>
    'dummy-id',
  convertSubjectNameToId: (channelName: string) => string | undefined = () =>
    'dummy-id',
) {
  return [
    video({
      providerId: convertChannelNameToId('Minute Physics'),
      providerVideoId: 'minute-physics-1',
      title: 'Richard St. John: 8 secrets of success',
      description:
        "Why do people succeed? Is it because they\\'re smart? Or are they just lucky? Neither. Analyst Richard St. John condenses years of interviews into an unmissable 3-minute slideshow on the real secrets of success.",
      subjects: [
        convertSubjectNameToId('Mathematics')!,
        convertSubjectNameToId('Physics')!,
      ],
      ageRangeMin: 3,
      ageRangeMax: 5,
    }),
    video({
      providerId: convertChannelNameToId('Youtube CP'),
      providerVideoId: 's3Gl6T0CC2I',
      playbackProvider: 'YOUTUBE',
      title:
        'The Terrifying art of Free Solo Slacklining UNTETHERED - Full Documentary',
      description: 'This is now about dogs.',
      playbackId: 's3Gl6T0CC2I',
      subjects: [
        convertSubjectNameToId('Biology')!,
        convertSubjectNameToId('Physics')!,
      ],
      duration: 'PT1M30S',
      ageRangeMin: 4,
      ageRangeMax: 8,
    }),
    video({
      providerId: convertChannelNameToId('Minute Physics'),
      providerVideoId: 'minute-physics-2',
      title: 'Rives: If I controlled the Internet',
      description:
        "How many poets could cram eBay, Friendster and Monster.com into 3-minute poem worthy of a standing ovation? Enjoy Rives' unique talent.",
      subjects: [
        convertSubjectNameToId('Biology')!,
        convertSubjectNameToId('Physics')!,
      ],
      playbackId: '0_in8dv3xq',
      duration: 'PT1M30S',
      ageRangeMin: 3,
      ageRangeMax: 5,
    }),
    video({
      providerId: convertChannelNameToId('Minute Physics'),
      providerVideoId: 'minute-physics-3',
      title: 'Steven Johnson: How the "ghost map" helped end a killer disease',
      description:
        'Author Steven Johnson takes us on a 10-minute tour of The Ghost Map, his book about a cholera outbreak in 1854 London and the impact it had on science, cities and modern society.',
      subjects: [
        convertSubjectNameToId('Biology')!,
        convertSubjectNameToId('Physics')!,
      ],
      duration: 'PT5M30S',
      playbackId: '0_in8dv3xq',
      ageRangeMin: 4,
      ageRangeMax: 10,
    }),
    video({
      providerId: convertChannelNameToId('Minute Physics'),
      providerVideoId: 'minute-physics-4',
      title: 'Jeff Han: The radical promise of the multi-touch interface',
      description:
        'Jeff Han shows off a cheap, scalable multi-touch and pressure-sensitive computer screen interface that may spell the end of point-and-click.',
      subjects: [
        convertSubjectNameToId('Mathematics')!,
        convertSubjectNameToId('Physics')!,
      ],
      playbackId: '0_in8dv3xq',
      duration: 'PT1M30S',
      ageRangeMin: 4,
      ageRangeMax: 10,
    }),
    video({
      providerId: convertChannelNameToId('Minute Physics'),
      providerVideoId: 'minute-physics-5',
      title: 'Eva Vertes: Meet the future of cancer research',
      description:
        'Eva Vertes -- only 19 when she gave this talk -- discusses her journey toward studying medicine and her drive to understand the roots of cancer and Alzheimer’s.',
    }),
    video({
      providerId: convertChannelNameToId('Minute Physics'),
      providerVideoId: 'minute-physics-6',
      title: 'Mena Trott: Meet the founder of the blog revolution',
      description:
        "The founding mother of the blog revolution, Movable Type's Mena Trott, talks about the early days of blogging, when she realized that giving regular people the power to share our lives online is the key to building a friendlier, more connecminute-physics world.",
    }),
    video({
      providerId: convertChannelNameToId('Minute Physics'),
      providerVideoId: 'minute-physics-7',
      title: 'Michael Shermer: Why people believe weird things',
      description:
        'Why do people see the Virgin Mary on a cheese sandwich or hear demonic lyrics in "Stairway to Heaven"? Using video and music, skeptic Michael Shermer shows how we convince ourselves to believe -- and overlook the facts.',
    }),
    video({
      providerId: convertChannelNameToId('Minute Physics'),
      providerVideoId: 'minute-physics-8',
      title: 'Peter Gabriel: Fight injustice with raw video',
      description:
        'Musician and activist Peter Gabriel shares his very personal motivation for standing up for human rights with the watchdog group WITNESS -- and tells stories of citizen journalists in action.',
    }),
    video({
      providerId: convertChannelNameToId('Minute Physics'),
      providerVideoId: 'minute-physics-9',
      title: 'Seth Godin: How to get your ideas to spread',
      description:
        'In a world of too many options and too little time, our obvious choice is to just ignore the ordinary stuff. Marketing guru Seth Godin spells out why, when it comes to getting our attention, bad or bizarre ideas are more successful than boring ones.',
    }),
    video({
      providerId: convertChannelNameToId('Minute Physics'),
      providerVideoId: 'minute-physics-10',
      title: 'Vik Muniz: Art with wire, sugar, chocolate and string',
      description:
        'Vik Muniz makes art from pretty much anything, be it shredded paper, wire, clouds or diamonds. Here he describes the thinking behind his work and takes us on a tour of his incredible images.',
    }),
    video({
      providerId: convertChannelNameToId('Minute Physics'),
      providerVideoId: 'minute-physics-11',
      title: 'Robert Neuwirth: The hidden world of shadow cities',
      description:
        'Robert Neuwirth, author of "Shadow Cities," finds the worlds squatter sites -- where a billion people now make their homes -- to be thriving centers of ingenuity and innovation. He takes us on a tour.',
      subjects: [convertSubjectNameToId('Biology')!],
    }),
  ];
}
