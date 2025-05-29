import { injectable } from 'inversify'
import { IExternal } from '../../../../shared/adapters/external/interfaces.external'
import AWS from 'aws-sdk'
import { AWS_CONFIG } from '../../../../shared/config/params'
AWS.config.update(AWS_CONFIG)

export interface CreateBusinessJiraCardBody {
  businessId: string
}

@injectable()
export class CreateBusinessJiraCard
  implements IExternal<CreateBusinessJiraCardBody, void> {
  async call(body: CreateBusinessJiraCardBody): Promise<void> {
    const { businessId } = body
    const SQS = new AWS.SQS({ apiVersion: '2012-11-05', region: 'sa-east-1' })
    const STS = new AWS.STS()
    const { Account } = await STS.getCallerIdentity().promise()

    await SQS.sendMessage({
      QueueUrl: `https://sqs.sa-east-1.amazonaws.com/${Account}/jira-business-queue`,
      MessageBody: JSON.stringify({
        businessId,
      }),
    }).promise()
    return
  }
}
