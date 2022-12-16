import type { Prisma, Event } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.EventCreateArgs>({
  event: {
    one: {
      data: {
        token: 'String',
        expiresAt: '2022-12-15T23:57:54.122Z',
        title: 'String',
        description: 'String',
        start: '2022-12-15T23:57:54.122Z',
        end: '2022-12-15T23:57:54.122Z',
        reminders: 'String',
      },
    },
    two: {
      data: {
        token: 'String',
        expiresAt: '2022-12-15T23:57:54.122Z',
        title: 'String',
        description: 'String',
        start: '2022-12-15T23:57:54.122Z',
        end: '2022-12-15T23:57:54.122Z',
        reminders: 'String',
      },
    },
  },
})

export type StandardScenario = ScenarioData<Event, 'event'>
