import { GraphQLClient } from 'graphql-request';

if (!process.env.MONDAY_API_TOKEN) {
  throw new Error('MONDAY_API_TOKEN is not defined');
}

export const mondayClient = new GraphQLClient(
  'https://api.monday.com/v2',
  {
    headers: {
      Authorization: `Bearer ${process.env.MONDAY_API_TOKEN}`,
      'API-Version': '2024-01',
    },
  }
);
