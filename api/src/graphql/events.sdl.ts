export const schema = gql`
  type Event {
    id: Int!
    createdAt: DateTime!
    updatedAt: DateTime!
    editToken: String!
    previewToken: String!

    ownerEmail: String!
    confirmed: Boolean!

    expiresAt: DateTime!
    visible: Boolean!
    slug: String!
    title: String!
    description: String!
    start: DateTime!
    end: DateTime!
    reminders: String!
  }

  type Query {
    events: [Event!]! @requireAuth
    event(id: Int!): Event @requireAuth
    eventBySlug(slug: String!): Event @requireAuth
    eventByEditToken(token: String!): Event @requireAuth
    eventByPreviewToken(token: String!): Event @requireAuth
  }

  input CreateEventInput {
    ownerEmail: String!
    title: String!
  }

  input UpdateEventInput {
    expiresAt: DateTime
    visible: Boolean
    slug: String
    title: String
    description: String
    start: DateTime
    end: DateTime
    reminders: String
  }

  type Mutation {
    createEvent(input: CreateEventInput!): Event! @requireAuth
    updateEvent(id: Int!, input: UpdateEventInput!): Event! @requireAuth
    deleteEvent(id: Int!): Event! @requireAuth
  }
`
