export const schema = gql`
  type IgnoredEmail {
    id: Int!
    createdAt: DateTime!
    updatedAt: DateTime!
    email: String!
  }

  input IgnoredEmailInput {
    email: String!
    token: String!
  }

  type Query {
    ignoredEmail(input: IgnoredEmailInput!): IgnoredEmail @requireAuth
  }

  type Mutation {
    createIgnoredEmail(input: IgnoredEmailInput!): IgnoredEmail! @requireAuth
    deleteIgnoredEmail(input: IgnoredEmailInput!): IgnoredEmail! @requireAuth
  }
`
