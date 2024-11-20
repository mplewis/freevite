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
    confirmed: Boolean!
    headCount: Int!
    comment: String!
    reminders: [Reminder!]!
  }

  type PublicResponse {
    name: String!
    headCount: Int!
    comment: String!
  }

  type UpdatableResponse {
    id: Int!
    event: Event!
    eventId: Int!
    createdAt: DateTime!
    updatedAt: DateTime!
    name: String!
    editToken: String!
    email: String!
    confirmed: Boolean!
    headCount: Int!
    comment: String!
    remindPriorSec: Int
  }

  type ResponseSummary {
    headCountTotal: Int!
    responseCountTotal: Int!
  }

  type Query {
    responses: [Response!]! @requireAuth
    response(id: Int!): Response @requireAuth
    responseByEditToken(editToken: String!): UpdatableResponse @skipAuth
  }

  input CreateResponseInput {
    email: String!
    name: String!
    headCount: Int!
    comment: String!
    remindPriorSec: Int
    captchaResponse: String!
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
