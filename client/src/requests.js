import {getAccessToken, isLoggedIn} from './auth';
import gql from 'graphql-tag';
import { ApolloClient, ApolloLink, HttpLink, InMemoryCache } from 'apollo-boost';

const endpointUrl = 'http://localhost:9000/graphql';

const authLink = new ApolloLink((operation, forward) => {
  if (isLoggedIn()) {
        operation.setContext({
          headers: {
            'authorization': 'Bearer ' + getAccessToken(),
          }
        })
      }
  return forward(operation);
});

const client = new ApolloClient({
  link: ApolloLink.from([
    authLink,
    new HttpLink({uri: endpointUrl}),
  ]), 
  cache: new InMemoryCache(),
});

const jobDetailFragment = gql`
  fragment JobDetail on Job {
    id
    title
    company {
      id
      name
    }
    description
  }
`;

const jobQuery = gql`
  query JobQuery($id: ID!) {
    job(id: $id ) {
      ...JobDetail
    }
  }
  ${jobDetailFragment}
`;

const jobsQuery = gql`{
  jobs {
    title
    id
    company {
      id
      name
    }
  }
}
`;

const companyQuery = gql`query CompanyQuery($id: ID!) {
  company(id: $id) {
    id
    name
    description
    jobs {
      id
      title
    }
  }
}
`;

const createJobsMutation = gql`mutation CreateJob($input: CreateJobInput) {
  job: createJob(input: $input) {
    ...JobDetail
  }
  ${jobDetailFragment}
}
`;

export const loadJobs = async () => {
  const {data: {jobs}} = await client.query({query: jobsQuery, cache: 'no-cache'});
  return jobs;
};

export const loadJob = async (id) => {
  const {data: {job}} = await client.query({query: jobQuery, variables: {id}});
  return job;
};

export const loadCompany = async (id) => {
  const {data: {company}} = await client.query({query: companyQuery, variables: {id}});
  return company;
  
};

export const createJob = async(input) => {
  const {data: {job}} = await client.mutate({
    mutation: createJobsMutation,
    variables: {input},
    update: (cache, {data}) => {
      cache.writeQuery({
        query: jobQuery,
        variables: {id: data.job.id},
        data
      })
    }})
    return job;
  };
  
  // const graphQlRequest = async (query, variables = {}) => {
  //   const request = {
  //     method: 'POST',
  //     headers: {'content-type': 'application/json'},
  //     body: JSON.stringify({query, variables})
  //   };
  //   if (isLoggedIn()) {
  //     request.headers['authorization'] = 'Bearer ' + getAccessToken();
  //   }
  //   const response = await fetch(endpointUrl, request);
  //   const reponseBody = await response.json();
  //   if (reponseBody.errors) {
  //     const message = reponseBody.errors.map((error) => error.message).join('\n');
  //     throw new Error(message)
  //   }
  //   return reponseBody.data;
  // }
