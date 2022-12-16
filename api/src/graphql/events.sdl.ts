export const schema = gql`
  type Event {
    id: Int!
    createdAt: DateTime!
    updatedAt: DateTime!
    token: String!
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
    eventByToken(token: String!): Event @requireAuth
  }

  input CreateEventInput {
    token: String!
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

  input UpdateEventInput {
    token: String
    confirmed: Boolean
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
