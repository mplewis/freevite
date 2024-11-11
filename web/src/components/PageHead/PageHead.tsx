import { Metadata } from '@redwoodjs/web'

import { SITE_URL } from 'src/app.config'

import Typ from '../Typ/Typ'

export interface Props {
  title: string
  desc: string
  ogImage?: string
}

const PageHead = ({ title, desc, ogImage }: Props) => {
  // `| Freevite` is suffixed in `<RedwoodProvider titleTemplate="...">` in index.html
  const ogTitle = `${title}`
  const image = ogImage || `${SITE_URL}/og-logo.png`
  return (
    <>
      <Metadata title={ogTitle} description={desc} og={{ image }} />
      <Typ x="head">{title}</Typ>
    </>
  )
}

export default PageHead
