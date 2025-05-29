import firebaseTest from 'firebase-functions-test'
const initTest = firebaseTest()
initTest.mockConfig({
  env: { mode: 'production' },
  adminsdk: { private_key: 'someprivatekey' },
  jwt: { secret: 'secret' },
})
describe('params', () => {
  it('should return adminsdk with production mode', async () => {
    const adminsdk = (await import('../params')).ADMINSDK
    expect(adminsdk).toBeDefined()
  })
})
