import { MetaTags } from '@redwoodjs/web'

import Typ from '../Typ/Typ'

export interface Props {
  title: string
  desc: string
  image?: string
}

const PageHead = ({ title, desc, image }: Props) => {
  const ogTitle = `${title} | Freevite`
  const metaAttrs = {
    title: ogTitle,
    description: desc,
    image: image || undefined, // TODO: placeholder for the app
  }
  return (
    <>
      <MetaTags title={ogTitle} description={desc} />
      <Typ x="pageTitle">{title}</Typ>
    </>
  )
}

export default PageHead
