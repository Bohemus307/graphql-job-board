const endpointUrl = 'http://localhost:9000/graphql'


export const loadJobs = async () => {
  const response = await fetch(endpointUrl, {
    method: 'Post',
    headers: {'content-type': 'application/json'},
    body: JSON.stringify({
      query: `{
        jobs {
          title
          id
          company {
            id
            name
          }
        }
      }`
    })
  });
  const reponseBody = await response.json();
  return reponseBody.data.jobs;

}
export const loadJob = async (id) => {
  const response = await fetch(endpointUrl, {
    method: 'Post',
    headers: {'content-type': 'application/json'},
    body: JSON.stringify({
      query: `query JobQuery($id: ID!) {
        job(id: $id ) {
          id
          title
          company {
            id 
            name
          }
          description
        }
      }`,
      variables: {id}
    })
  });
  const reponseBody = await response.json();
  return reponseBody.data.job;

}
