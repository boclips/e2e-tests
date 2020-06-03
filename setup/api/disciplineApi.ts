import fetch from 'node-fetch';
import { API_URL } from '../Constants';
import { DisciplineFixture } from '../fixture/disciplines';
import { Link } from './hateoas';
import { getSubjectByName } from './subjectApi';
import { assertApiResourceCreation } from './utilities';

interface HypermediaWrapper {
  _links: DisciplineLinks;
  _embedded: Disciplines;
}

interface Disciplines {
  disciplines: Discipline[];
}

interface DisciplineLinks {
  subjects: Link;
}

export interface Discipline {}

export async function insertDiscipline(
  discipline: DisciplineFixture,
  token: string,
) {
  const subject = await getSubjectByName(discipline.associatedSubject);

  delete discipline.associatedSubject;

  const disciplineResponse = await fetch(`${API_URL}/v1/disciplines`, {
    method: 'POST',
    body: JSON.stringify(discipline),
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  await assertApiResourceCreation(disciplineResponse, 'Discipline creation');
  const disciplineResource: HypermediaWrapper = await disciplineResponse.json();
  const disciplineSubjectMappingResponse = await fetch(
    disciplineResource._links.subjects.href,
    {
      method: 'PUT',
      body: subject._links.self.href,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'text/uri-list',
      },
    },
  );
  await assertApiResourceCreation(
    disciplineSubjectMappingResponse,
    'Subject/discipline assotiation',
  );
}

export async function getDisciplines(
  token: string,
): Promise<Discipline[] | undefined> {
  const response = await fetch(`${API_URL}/v1/disciplines`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  const payload: HypermediaWrapper = await response.json();
  if (payload && payload._embedded && payload._embedded.disciplines) {
    return payload._embedded.disciplines;
  } else {
    return undefined;
  }
}
