import { injectable } from 'inversify'
import { IExternal } from '../../../../shared/adapters/external/interfaces.external'
import { upload } from '../../../../shared/firebase/storage'
import { File } from './interfaces'

@injectable()
export class UploadEpisodeLogo implements IExternal<File, string> {
  async call(file: File): Promise<string> {
    const url = await upload({ path: 'episodes', file })
    return url
  }
}
