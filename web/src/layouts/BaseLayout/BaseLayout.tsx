type BaseLayoutProps = {
  children?: React.ReactNode
}

const BaseLayout = ({ children }: BaseLayoutProps) => {
  return (
    <div className="container max-w-screen-md mx-auto my-4">{children}</div>
  )
}

export default BaseLayout
