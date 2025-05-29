import { injectable } from 'inversify'
import { IExternal } from '../../../../shared/adapters/external/interfaces.external'
import { getFirebase } from '../../../../shared/firebase'

@injectable()
export class PublishEpisodeUpdate implements IExternal<string, string> {
  async call(episodeId: string): Promise<string> {
    const firebase = getFirebase()
    const database = firebase.database()

    return database.ref(`stores/${episodeId}`).set({
      action: 'reload',
      payload: episodeId,
    })
  }
}
