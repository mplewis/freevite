import type { Prisma, Response } from '@prisma/client'

import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.ResponseCreateArgs>({
  response: {
    one: {
      data: {
        editToken: 'String2156540',
        email: 'String',
        event: {
          create: {
            editToken: 'String5241332',
            previewToken: 'String4460811',
            ownerEmail: 'String',
            slug: 'String7410202',
            title: 'String',
            description: 'String',
            start: '2024-10-11T17:58:11.858Z',
            end: '2024-10-11T17:58:11.858Z',
          },
        },
      },
    },
    two: {
      data: {
        editToken: 'String3868629',
        email: 'String',
        event: {
          create: {
            editToken: 'String7481446',
            previewToken: 'String9888314',
            ownerEmail: 'String',
            slug: 'String4988810',
            title: 'String',
            description: 'String',
            start: '2024-10-11T17:58:11.858Z',
            end: '2024-10-11T17:58:11.858Z',
          },
        },
      },
    },
    withReminder: {
      data: {
        editToken: 'editTokenWithReminder',
        email: 'String',
        event: {
          create: {
            editToken: 'eventEditTokenWithReminder',
            previewToken: 'eventPreviewTokenWithReminder',
            ownerEmail: 'String',
            slug: 'eventSlugWithReminder',
            title: 'String',
            description: 'String',
            start: '2024-01-07T12:00:00Z',
            end: '2024-01-07T18:00:00Z',
          },
        },
        reminders: {
          create: {
            sendAt: '2024-01-07T11:00:00Z',
          },
        },
      },
    },
  },
})

export type StandardScenario = ScenarioData<Response, 'response'>
