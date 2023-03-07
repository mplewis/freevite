import { MetaTags } from '@redwoodjs/web'

import { SITE_URL } from 'src/app.config'

import Typ from '../Typ/Typ'

export interface Props {
  title: string
  desc: string
}

const PageHead = ({ title, desc }: Props) => {
  const ogTitle = `${title} | Freevite`
  return (
    <>
      <MetaTags
        title={ogTitle}
        description={desc}
        ogContentUrl={`${SITE_URL}/og-logo.png`}
      />
      <Typ x="pageTitle">{title}</Typ>
    </>
  )
}

export default PageHead
