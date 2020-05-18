import { Subject } from '../api/subjectApi';

export interface CollectionFixture {
  title: string;
  public: boolean;
  promoted?: boolean;
  subjects?: string[];
}

export const collectionWithSubjects = (subjects: Subject[] | undefined) => {
  const biologySubjectId = subjects?.filter(
    subject => subject.name === 'Biology',
  )[0]?.id;

  if (biologySubjectId == null) {
    throw Error('Could not find Biology subject id, aborting!');
  }

  return [
    {
      title: 'Biology collection',
      public: true,
      promoted: true,
      subjects: [biologySubjectId],
    },
  ];
};

export const collectionWithoutSubjects: CollectionFixture[] = [
  { title: 'Minute Physics', public: true, promoted: true },
  { title: 'Private collection', public: false },
];

export const ltiCollectionFixture: CollectionFixture = {
  title: 'LTI Collection',
  public: false,
};
