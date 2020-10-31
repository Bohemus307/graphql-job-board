import {getAccessToken, isLoggedIn} from './auth';

const endpointUrl = 'http://localhost:9000/graphql'

const graphQlRequest = async (query, variables = {}) => {
  const request = {
    method: 'POST',
    headers: {'content-type': 'application/json'},
    body: JSON.stringify({query, variables})
  };
  if (isLoggedIn()) {
    request.headers['authorization'] = 'Bearer ' + getAccessToken();
  }
  const response = await fetch(endpointUrl, request);
  const reponseBody = await response.json();
  if (reponseBody.errors) {
    const message = reponseBody.errors.map((error) => error.message).join('\n');
    throw new Error(message)
  }
  return reponseBody.data;
}

export const loadJobs = async () => {
  const query = `{
    jobs {
      title
      id
      company {
        id
        name
      }
    }
  }`;

  const {jobs} =  await graphQlRequest(query)
  return jobs;
}

export const loadJob = async (id) => {
  const query = `query JobQuery($id: ID!) {
    job(id: $id ) {
      id
      title
      company {
        id 
        name
      }
      description
    }
  }`
  const {job} = await graphQlRequest(query, {id})
  return job;
}

export const loadCompany = async (id) => {
  const query = `query CompanyQuery($id: ID!) {
    company(id: $id) {
      id
      name
      description
      jobs {
        id
        title
      }
    }
  }`
  const {company} = await graphQlRequest(query, {id});
  return company;

}

export const createJob = async(input) => {
  const mutation = `mutation CreateJob($input: CreateJobInput) {
    job: createJob(input: $input) {
      id
      title
      company {
        id 
        name
      }
    }
  }`;
  const {job} = await graphQlRequest(mutation, {input});
  return job;
}


