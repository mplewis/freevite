import { Response } from 'types/graphql'

import Typ from '../Typ/Typ'

type Props = {
  responses:
    | Pick<Response, 'name' | 'headCount' | 'comment'>[]
    | null
    | undefined
  hideHint?: boolean
}

export const ResponseDetails = ({ responses, hideHint }: Props) => {
  if (!responses || responses.length === 0) return null
  const hint = !hideHint

  return (
    <>
      <table className="table is-fullwidth is-hoverable is-bordered is-narrow">
        <thead>
          <tr>
            <th>Name</th>
            <th>Guests</th>
            <th>Comment</th>
          </tr>
        </thead>
        <tbody>
          {responses.map((response, index) => (
            <tr key={index}>
              <td>{response.name}</td>
              <td>{response.headCount}</td>
              <td>{response.comment}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {hint && (
        <Typ x="p">
          If your RSVP isn&apos;t appearing in the table above, double-check
          that you&apos;ve clicked the confirmation link in your email.
        </Typ>
      )}
    </>
  )
}
