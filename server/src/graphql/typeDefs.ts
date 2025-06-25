import { gql } from "apollo-server-express";

const typeDefs = gql`
  type Transaction {
    id: ID!
    type: String!
    amount: Float!
    date: String!
    category: String
  }

  type User {
    id: ID!
    email: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    transactions: [Transaction!]!
  }

  type Mutation {
    register(email: String!, password: String!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
    addTransaction(
      type: String!
      amount: Float!
      date: String!
      category: String
    ): Transaction!
    deleteTransaction(id: ID!): Boolean!
  }
`;

export default typeDefs;
