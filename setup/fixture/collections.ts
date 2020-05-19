import { Subject } from '../api/subjectApi';

export interface CollectionFixture {
  title: string;
  discoverable: boolean;
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
  { title: 'Minute Physics', discoverable: true, promoted: true },
  { title: 'Private collection', discoverable: false },
];

export const ltiCollectionFixture: CollectionFixture = {
  title: 'LTI Collection',
  discoverable: false,
};
