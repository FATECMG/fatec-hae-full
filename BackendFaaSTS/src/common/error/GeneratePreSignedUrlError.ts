export class GeneratePreSignedUrlError extends Error {
  constructor () {
    super()
    this.message = 'Erro ao gerar URL Pré-Assinada!'
    this.name = 'GeneratePreAssignedUrlError'
  }
}
