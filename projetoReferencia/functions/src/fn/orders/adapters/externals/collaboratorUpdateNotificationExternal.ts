import { injectable } from 'inversify'
import { IExternal } from '../../../../shared/adapters/external/interfaces.external'
import { getFirebase } from '../../../../shared/firebase'
import * as functions from 'firebase-functions'
import { ICollaborator } from '../../../collaborators/entities/interfaces'

export interface ICollaboratorUpdateNotificationArgs {
  collaborator: ICollaborator
  icon: string
  notificationBody: string
  notificationTitle: string
}

@injectable()
export class CollaboratorUpdateNotificationExternal
  implements IExternal<ICollaboratorUpdateNotificationArgs, void> {
  async call({
    collaborator,
    icon,
    notificationBody,
    notificationTitle,
  }: ICollaboratorUpdateNotificationArgs): Promise<void> {
    const app = getFirebase()
    const messaging = app.messaging()
    const mode = functions.config().env.mode
    if (collaborator.messagingToken) {
      const message = {
        notification: {
          title: notificationTitle,
          body: notificationBody,
        },
        webpush: {
          notification: {
            icon: icon,
            badge: '/favicon.ico',
          },
          fcmOptions: {
            link: `http${mode === 'development' ? '' : 's'}://${
              mode === 'development'
                ? 'localhost:3002'
                : mode === 'stage'
                ? 'colab.zelpay.stage.redwall.solutions'
                : 'colab.zelpay.solutions'
            }/pedidos/pendentes`,
          },
        },
        token: collaborator.messagingToken,
      }

      try {
        await messaging.send(message)
      } catch (err) {
        console.warn('Error sending notification.', err)
      }
    }
  }
}
