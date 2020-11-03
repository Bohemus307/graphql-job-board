import {getAccessToken, isLoggedIn} from './auth';
import gql from 'graphql-tag';
import { ApolloClient, HttpLink, InMemoryCache } from 'apollo-boost';

const endpointUrl = 'http://localhost:9000/graphql'

const client = new ApolloClient({
  link: new HttpLink({uri: endpointUrl}),
  cache: new InMemoryCache(),
})

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

export const loadJobs = async () => {
  const query = gql`{
      jobs {
        title
        id
        company {
          id
          name
        }
      }
    }`;
  const {data: {jobs}} = await client.query({query})
  return jobs;
}

export const loadJob = async (id) => {
  const query = gql`query JobQuery($id: ID!) {
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
  const {data: {job}} = await client.query({query, variables: {id}})
  return job;
}

export const loadCompany = async (id) => {
  const query = gql`query CompanyQuery($id: ID!) {
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
  const {data: {company}} = await client.query({query, variables: {id}});
  return company;

}

export const createJob = async(input) => {
  const mutation = gql`mutation CreateJob($input: CreateJobInput) {
      job: createJob(input: $input) {
        id
        title
        company {
          id 
          name
        }
      }
    }`;
  const {data: {job}} = await client.mutate({mutation, variables: {input} })
  return job;
}


