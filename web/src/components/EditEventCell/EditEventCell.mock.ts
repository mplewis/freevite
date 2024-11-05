import { Event } from 'types/graphql'

// Define your own mock data here:
export const standard = (/* vars, { ctx, req } */) => ({
  event: {
    id: 42,
    slug: 'test',
    createdAt: '2021-04-01T00:00:00Z',
    updatedAt: '2021-04-01T00:00:00Z',
    editToken: 'String',
    previewToken: 'String',
    ownerEmail: 'String',
    confirmed: true,
    visible: true,
    title: 'String',
    description: 'String',
    location: '',
    start: '2021-04-01T00:00:00Z',
    end: '2021-04-01T00:00:00Z',
    timezone: 'America/Denver',
    responseConfig: 'DISABLED',
    responses: [],
  } as Event,
})
