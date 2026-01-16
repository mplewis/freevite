process.env.SITE_HOST = 'example.com'
process.env.SMTP_HOST = 'smtp.example.com'
process.env.SMTP_USER = 'username'
process.env.SMTP_PASS = 'password'
process.env.FROM_NAME = 'Freevite Test'
process.env.FROM_EMAIL = 'test@freevite.app'
process.env.SECRET_KEY = 'secret-key-for-testing'

// Mock routes for tests that use them
jest.mock('@redwoodjs/router', () => {
  const actualRouter = jest.requireActual('@redwoodjs/router')
  return {
    ...actualRouter,
    routes: {
      home: () => '/',
      newEvent: () => '/new',
      viewEvent: ({ slug }) => `/event/${slug}`,
      editEvent: ({ editToken }) => `/edit/${editToken}`,
      previewEvent: ({ previewToken }) => `/preview/${previewToken}`,
    },
  }
})
