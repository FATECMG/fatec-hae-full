import 'reflect-metadata'
import * as functions from 'firebase-functions'
import { connectDatabase } from './shared/mongodb/index'
import { onRequest } from './shared/utils/onRequest'
import { onPublish } from './shared/utils/onPublish'

// Just to keep warm between connections
export const warmConnections = async () => {
  await connectDatabase()
}

function replaceLog() {
  console.log = functions.logger.log
  console.error = functions.logger.error
}
replaceLog()

export const business = functions
  .region('southamerica-east1')
  .https.onRequest(async (req, res) => {
    await (
      await import('./fn/business/adapters/controllers/business.controller')
    ).default(req, res)
  })

export const address = onRequest({
  handler: async (req, res) => {
    await (
      await import('./fn/address/adapters/controllers/address.controller')
    ).default(req, res)
  },
})

export const items = functions
  .region('southamerica-east1')
  .https.onRequest(async (req, res) => {
    await (
      await import('./fn/items/adapters/controllers/items.controller')
    ).default(req, res)
  })

export const menus = onRequest({
  handler: async (req, res) => {
    await (
      await import('./fn/menus/adapters/controllers/menus.controller')
    ).default(req, res)
  },
})

export const superepisodes = onRequest({
  handler: async (req, res) => {
    await (
      await import(
        './fn/superepisode/adapters/controllers/superepisode.controller'
      )
    ).default(req, res)
  },
})

export const superbusinesses = onRequest({
  handler: async (req, res) => {
    await (
      await import(
        './fn/superbusinesses/adapters/controllers/superbusiness.controller'
      )
    ).default(req, res)
  },
})

export const episodes = onRequest({
  handler: async (req, res) => {
    await (
      await import('./fn/episodes/adapters/controllers/episodes.controller')
    ).default(req, res)
  },
})

export const plans = onRequest({
  handler: async (req, res) => {
    await (
      await import('./fn/plans/adapters/controllers/plans.controller.http')
    ).default(req, res)
  },
})

export const login = onRequest({
  handler: async (req, res) => {
    await (
      await import('./fn/login/adapters/controllers/logins.controller')
    ).login(req, res)
  },
})

export const orders = onRequest({
  handler: async (req, res) => {
    await (await import('./fn/orders/adapters/controllers/ordersHttp')).orders(
      req,
      res,
    )
  },
})

export const collaborators = onRequest({
  handler: async (req, res) => {
    await (
      await import('./fn/collaborators/adapters/controllers/collaboratorHttp')
    ).collaborators(req, res)
  },
})

export const contracts = onRequest({
  handler: async (req, res) => {
    await (
      await import('./fn/contracts/adapters/controllers/contract.controller')
    ).default(req, res)
  },
})

export const subscriptions = onRequest({
  handler: async (req, res) => {
    await (
      await import(
        './fn/subscriptions/adapters/controllers/subscriptionsController'
      )
    ).subscriptions(req, res)
  },
})

export const createContractTrigger = onPublish({
  topic: 'create-contract',
  handler: async (message, context) => {
    await (
      await import('./fn/contracts/adapters/controllers/contracts.trigger')
    ).create(message, context)
  },
})

export const createEpisodeTrigger = onPublish({
  topic: 'create-episode',
  handler: async (message, context) => {
    await (
      await import(
        './fn/episodes/adapters/controllers/episodes.controller.trigger'
      )
    ).create(message, context)
  },
  retry: true,
})

export const sendEmailTrigger = onPublish({
  topic: 'send-email',
  handler: async message => {
    await (
      await import('./fn/emails/adapters/controllers/emailsTrigger')
    ).sendEmailTrigger(message)
  },
})

export const endTrialTrigger = onPublish({
  topic: 'end-trial',
  handler: async message => {
    await (
      await import('./fn/contracts/adapters/controllers/contracts.trigger')
    ).endTrial(message)
  },
})

export const deactivateContractTrigger = onPublish({
  topic: 'deactivate-contract',
  handler: async message => {
    await (
      await import('./fn/contracts/adapters/controllers/contracts.trigger')
    ).deactivateContract(message)
  },
})

// export const createChargeTrigger = onPublish({
//   topic: 'create-charge',
//   handler: async message => {
//     await (await import('./fn/charges/adapters/controllers')).createCharge(
//       message,
//     )
//   },
// })

// export const manageContracts = onPublish({
//   topic: 'manage-contracts',
//   handler: async () => {
//     await (
//       await import('./fn/contracts/adapters/controllers/contracts.trigger')
//     ).manageContracts()
//   },
// })

export const manageContracts = functions
  .region('southamerica-east1')
  .pubsub.schedule('0 8 * * *')
  .timeZone('America/Sao_Paulo')
  .onRun(async () => {
    await (
      await import('./fn/contracts/adapters/controllers/contracts.trigger')
    ).manageContracts()
  })

// WITH CRON SCHEDULER

// JUST TO TEST USECASE

/**
 * Function below is a structure to test trigger functions.
 */
// export const script = onRequest({
//   handler: async (req, res) => {
//     try {
//       await connectDatabase()

//       const repository = new BusinessRepository()
//       const { list } = await repository.list({}, '_id')

//       const SQS = new AWS.SQS({ apiVersion: '2012-11-05', region: 'sa-east-1' })
//       const STS = new AWS.STS()
//       const { Account } = await STS.getCallerIdentity().promise()

//       for (const item of list) {
//         await SQS.sendMessage({
//           QueueUrl: `https://sqs.sa-east-1.amazonaws.com/${Account}/jira-business-queue`,
//           MessageBody: JSON.stringify({
//             businessId: item._id.toString(),
//           }),
//         }).promise()
//       }
//       return res.json(list)
//     } catch (err) {
//       return res.status(500).json(err)
//     }
//   },
// })
