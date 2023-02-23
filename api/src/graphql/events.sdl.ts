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
  }

  type PublicEvent {
    title: String!
    description: String!
    start: DateTime!
    end: DateTime!
    slug: String!
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
  }

  type Mutation {
    createEvent(input: CreateEventInput!): Event! @skipAuth
    updateEvent(editToken: String!, input: UpdateEventInput!): Event! @skipAuth
    deleteEvent(editToken: String!): Event! @skipAuth
  }
`
