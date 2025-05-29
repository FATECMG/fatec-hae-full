import { sendEmail } from '@libs/NodeMailer'
import { type EmailProps } from '@functions/email/entities/Email'

jest.mock('nodemailer')
jest.mock('@libs/NodeMailer', () => ({
  sendEmail: jest.fn()
    .mockRejectedValueOnce(new Error('any_error'))
    .mockResolvedValue(undefined),
  closePoolConnection: jest.fn()
}))

describe('SendEmail Service', () => {
  let email: EmailProps
  beforeAll(() => {
    email = {
      from: 'any_from',
      to: [{ name: 'any_name', address: 'any_address' }],
      subject: 'any_subject',
      body: 'any_html',
      cc: ['any_cc'],
      bcc: ['any_bcc']
    }
  })

  it('it should throw an Error when sendEmail throws', async () => {
    const promise = sendEmail(email)
    await expect(promise).rejects.toThrow(new Error('any_error'))
  })

  it('it should call sendEmail with correct params', async () => {
    await sendEmail(email)
    expect(sendEmail).toHaveBeenCalledWith({
      to: [{ name: 'any_name', address: 'any_address' }],
      from: 'any_from',
      subject: 'any_subject',
      body: 'any_html',
      cc: ['any_cc'],
      bcc: ['any_bcc']
    })
  })

  it('it should return void when sendEmail success', async () => {
    const promise = sendEmail(email)
    await expect(promise).resolves.toBeUndefined()
  })
})
