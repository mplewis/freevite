export const schema = gql`
  type Event {
    id: Int!
    createdAt: DateTime!
    updatedAt: DateTime!
    editToken: String!
    previewToken: String!
    ownerEmail: String!
    confirmed: Boolean!
    visible: Boolean!
    slug: String!
    title: String!
    description: String!
    start: DateTime!
    end: DateTime!
    timezone: String
    responseConfig: ResponseConfig!
    responses: [Response!]!
  }

  type PublicEvent {
    id: Int!
    slug: String!
    title: String!
    description: String!
    start: DateTime!
    end: DateTime!
    timezone: String

    responseConfig: ResponseConfig!
    # Each of these are optional; app shows what the event creator makes available
    responses: [PublicResponse!]
    responseSummary: ResponseSummary
  }

  enum ResponseConfig {
    SHOW_ALL
    SHOW_COUNTS_ONLY
    SHOW_NONE
    DISABLED
  }

  type Query {
    eventBySlug(slug: String!): PublicEvent @skipAuth
    eventByEditToken(editToken: String!): Event @skipAuth
    eventByPreviewToken(previewToken: String!): Event @skipAuth
  }

  input CreateEventInput {
    ownerEmail: String!
    title: String!
  }

  input UpdateEventInput {
    visible: Boolean
    slug: String
    title: String
    description: String
    start: DateTime
    end: DateTime
    timezone: String
  }

  type Mutation {
    createEvent(input: CreateEventInput!): Event! @skipAuth
    updateEvent(editToken: String!, input: UpdateEventInput!): Event! @skipAuth
    deleteEvent(editToken: String!): Event! @skipAuth
  }
`
