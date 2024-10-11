export const schema = gql`
  type Response {
    id: Int!
    event: Event!
    eventId: Int!
    createdAt: DateTime!
    updatedAt: DateTime!
    name: String!
    editToken: String!
    email: String!
    headCount: Int!
    comment: String!
    reminders: [Reminder!]!
  }

  type PublicResponse {
    name: String!
    headCount: Int!
    comment: String!
  }

  type ResponseSummary {
    headCountTotal: Int!
    responseCountTotal: Int!
  }

  type Query {
    responses: [Response!]! @requireAuth
    response(id: Int!): Response @requireAuth
  }

  input CreateResponseInput {
    email: String!
    name: String!
    headCount: Int!
    comment: String!
    remindPriorSec: Int
  }

  input UpdateResponseInput {
    name: String
    headCount: Int
    comment: String
    remindPriorSec: Int
  }

  type Mutation {
    createResponse(eventId: Int!, input: CreateResponseInput!): Response!
      @skipAuth
    updateResponse(editToken: String!, input: UpdateResponseInput!): Response!
      @skipAuth
    deleteResponse(editToken: String!): Response! @skipAuth
  }
`
