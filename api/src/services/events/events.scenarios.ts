import type { Prisma, Event } from '@prisma/client'

import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.EventCreateArgs>({
  event: {
    visible: {
      data: {
        editToken: 'String1328327',
        previewToken: 'String571517',
        ownerEmail: 'String',
        confirmed: true,
        visible: true,
        slug: 'String6210380',
        title: 'String',
        description: 'String',
        start: '2023-02-12T23:13:37.652Z',
        end: '2023-02-12T23:13:37.652Z',
      },
    },
    invisible: {
      data: {
        editToken: 'String948979',
        previewToken: 'String2012098',
        ownerEmail: 'String',
        confirmed: true,
        visible: false,
        slug: 'String3041401',
        title: 'String',
        description: 'String',
        start: '2023-02-12T23:13:37.652Z',
        end: '2023-02-12T23:13:37.652Z',
      },
    },
  },
})

export type StandardScenario = ScenarioData<Event, 'event'>
