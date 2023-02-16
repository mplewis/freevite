type BaseLayoutProps = {
  children?: React.ReactNode
}

const BaseLayout = ({ children }: BaseLayoutProps) => {
  return (
    <div className="container mx-auto my-4 max-w-screen-md px-2">
      {children}
    </div>
  )
}

export default BaseLayout
