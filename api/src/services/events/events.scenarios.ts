import type { Prisma, Event } from '@prisma/client'
import dayjs from 'dayjs'

import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.EventCreateArgs>({
  event: {
    visible: {
      data: {
        editToken: 'String1328327',
        previewToken: 'String571517',
        ownerEmail: 'String',
        expiresAt: dayjs().add(1, 'day').toISOString(),
        confirmed: true,
        visible: true,
        slug: 'String6210380',
        title: 'String',
        description: 'String',
        start: '2023-02-12T23:13:37.652Z',
        end: '2023-02-12T23:13:37.652Z',
        reminders: 'String',
      },
    },
    invisible: {
      data: {
        editToken: 'String948979',
        previewToken: 'String2012098',
        ownerEmail: 'String',
        expiresAt: dayjs().add(1, 'day').toISOString(),
        confirmed: true,
        visible: false,
        slug: 'String3041401',
        title: 'String',
        description: 'String',
        start: '2023-02-12T23:13:37.652Z',
        end: '2023-02-12T23:13:37.652Z',
        reminders: 'String',
      },
    },
  },
})

export type StandardScenario = ScenarioData<Event, 'event'>
