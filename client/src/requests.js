const endpointUrl = 'http://localhost:9000/graphql'

const graphQlRequest = async (query, variables = {}) => {
  const response = await fetch(endpointUrl, {
    method: 'Post',
    headers: {'content-type': 'application/json'},
    body: JSON.stringify({query, variables})
  });
  const reponseBody = await response.json();
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
  const {job} = await graphQlRequest(query, id)
  return job;

}
