import fetch from 'node-fetch';
import * as Constants from '../Constants';
import { SubjectFixture } from '../fixture/subjects';
import { Link } from './hateoas';
import { assertApiResourceCreation } from './utilities';

interface HypermediaWrapper {
  _embedded: Subjects;
}

interface Subjects {
  subjects: Subject[];
}

export interface Subject {
  _links: SubjectLinks;
  id: string;
  name: string;
}

export interface SubjectLinks {
  self: Link;
}

export async function insertSubject(subject: SubjectFixture, token: string) {
  const response = await fetch(Constants.API_URL + '/v1/subjects', {
    method: 'POST',
    body: JSON.stringify(subject),
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  await assertApiResourceCreation(response, 'Subject creation');
}

export async function getSubjects(): Promise<Subject[] | undefined> {
  const response = await fetch(Constants.API_URL + '/v1/subjects', {
    method: 'GET',
  });
  const payload: HypermediaWrapper = await response.json();

  if (payload && payload._embedded && payload._embedded.subjects) {
    return payload._embedded.subjects;
  } else {
    return undefined;
  }
}

export async function getSubjectByName(subjectName: string): Promise<Subject> {
  const subjects = await getSubjects();
  if (subjects === undefined) {
    throw new Error('No subjects found');
  }

  const subject = subjects.find(s => s.name === subjectName);
  if (subject === undefined) {
    throw new Error(`Subject not found for name ${subjectName}`);
  }

  return subject;
}
