import { IExternal } from '../../../../shared/adapters/external/interfaces.external'

export class SuperBusinessSetCookiesExternal
  implements IExternal<{ jwt: string; res: any }, void> {
  async call(args: { jwt: string; res: any }): Promise<void> {
    const { jwt, res } = args
    res.cookie('superb', jwt)
  }
}
