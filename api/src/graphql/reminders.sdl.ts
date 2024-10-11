export const schema = gql`
  type Reminder {
    id: Int!
    createdAt: DateTime!
    updatedAt: DateTime!
    response: Response!
    responseId: Int!
    sendAt: DateTime!
    sent: Boolean!
  }
`
