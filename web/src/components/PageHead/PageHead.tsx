import { MetaTags } from '@redwoodjs/web'

import Typ from '../Typ/Typ'

export interface Props {
  title: string
  desc: string
}

const PageHead = ({ title, desc }: Props) => {
  return (
    <>
      <MetaTags title={title} description={desc} />
      <Typ x="pageTitle">{title}</Typ>
    </>
  )
}

export default PageHead
