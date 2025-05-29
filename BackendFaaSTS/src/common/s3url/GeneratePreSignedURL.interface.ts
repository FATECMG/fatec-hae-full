export interface GeneratePreSignedURLInterface {
  getPreSignedGetURLs: (prefix: string) => Promise<string[] | Error>
  getPreSignedPostURLs: (key: string) => Promise<string | Error>
  deleteObjectsByPrefix: (prefix: string) => Promise<void | Error>
}
