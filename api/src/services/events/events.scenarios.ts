import type { Prisma, Event } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.EventCreateArgs>({
  event: {
    one: {
      data: {
        token: 'String434184',
        expiresAt: '2022-12-16T23:11:00.447Z',
        slug: 'String3338473',
        title: 'String',
        description: 'String',
        start: '2022-12-16T23:11:00.447Z',
        end: '2022-12-16T23:11:00.447Z',
        reminders: 'String',
      },
    },
    two: {
      data: {
        token: 'String4016761',
        expiresAt: '2022-12-16T23:11:00.447Z',
        slug: 'String8862604',
        title: 'String',
        description: 'String',
        start: '2022-12-16T23:11:00.447Z',
        end: '2022-12-16T23:11:00.447Z',
        reminders: 'String',
      },
    },
  },
})

export type StandardScenario = ScenarioData<Event, 'event'>
