import { Link } from '@redwoodjs/router'

import PageHead from '../PageHead/PageHead'
import Typ from '../Typ/Typ'

export type Props = {
  title: string
  desc: string | string[]
  c2a: { text: string } & ({ href: string } | { to: string })
}

const DeadEnd = (props: Props) => {
  const { title, c2a } = props
  const desc = Array.isArray(props.desc) ? props.desc : [props.desc]

  const action = (() => {
    if ('href' in c2a) {
      return (
        <a className="button is-primary mt-3" href={c2a.href}>
          {c2a.text}
        </a>
      )
    } else {
      return (
        <Link className="button is-primary mt-3" to={c2a.to}>
          {c2a.text}
        </Link>
      )
    }
  })()

  return (
    <div className="has-text-centered mx-auto" style={{ maxWidth: '600px' }}>
      <PageHead title={title} desc={desc.join(' ')} />
      {desc.map((p, i) => (
        <Typ x="p" key={i}>
          {p}
        </Typ>
      ))}
      {action}
    </div>
  )
}

export default DeadEnd
