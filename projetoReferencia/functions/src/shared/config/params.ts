import * as functions from 'firebase-functions'

const { mode } = functions.config().env

export const DATABASE =
  mode === 'production'
    ? 'mongodb://db.zelpay.solutions/zelpay?retryWrites=true&w=majority'
    : 'mongodb://db.zelpay.stage.redwall.solutions:32769/zelpay?retryWrites=true&w=majority'

const firebaseConfig = {
  apiKey: 'AIzaSyDVBIy-QDoeU3nVPFCwflr1TjVKSqkj044',
  authDomain: 'zelpay-stage-br.firebaseapp.com',
  databaseURL: 'https://zelpay-stage-br.firebaseio.com',
  projectId: 'zelpay-stage-br',
  storageBucket: 'zelpay-stage-br.appspot.com',
  messagingSenderId: '277746450861',
  appId: '1:277746450861:web:2e52fe158af8e8d452e124',
}

const firebaseProdConfig = {
  apiKey: 'AIzaSyBzoZZSNKq8BAduvcDY-iM19TOzSaMUimY',
  authDomain: 'zelpay-prod-br.firebaseapp.com',
  databaseURL: 'https://zelpay-prod-br.firebaseio.com',
  projectId: 'zelpay-prod-br',
  storageBucket: 'zelpay-prod-br.appspot.com',
  messagingSenderId: '60579288736',
  appId: '1:60579288736:web:311b150db6ab4b2faf9bc5',
  measurementId: 'G-LXPF4V6M8M',
}

const adminsdk = functions.config().adminsdk
if (mode === 'production') {
  adminsdk.private_key =
    '-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCNK79/DVFQoWem\n70ZBGtcwcBKlqdKkEknSjwHEqoJrwC2UACAR7UDMZDwmVXFrmwyjRGXDiDBsYtcP\nFerQYhRyKdfxKqNueOezm8C7ca+oTYWA0rlWCmL4qNwChK1bI8+OSAcXVprtSvDV\nS/nJLON6gVChkvq23276dSQvQk0wo3+tphoo8kvgu4aLmOfRndCoEVgEvvVVggLf\nNOvQOvyq2EAvKpBdPWnmwQu51mW9EE/i2XVYNs7YQluJnPbO6kMy0MUKYqdQnDss\nTGPFT0OzX/Yww1onN/np24KgB19OY9uxznLTrDwUbYlz/YdmI9UkhM22/FZSGbfU\nFyVUyZPPAgMBAAECggEAEWfp+g/ZzU/BWHdbGa7mBm5jFjL8qkco/AGu7aE6aG+v\nDvb+/Ubb/PeE5RMW43YgFkdaJsQ1eD+tlYoVxDC7paHcIrunn/jfVKlpF5N6XY2F\nXu9cc6vfLRqg2dyjBUBCmJ/v4+RFQOnDDQGLoE7dE187YlidegvNgqsL1Zneq5bm\nRiYRMRtHdhiujho8BaUD4RyRGNwVZCtqwYy2U+8MCBjgqgn1Wfr8+dSmnAlwudyn\n//bghpd8LUomJwFCaNJz0qQLl807YCx/qVD2LZEntHS5HknLWHlXZOHG9OGo2/7R\n+kw7NnZkzGl3BQa3MaehzEmKqaS4eXJ0l8LKPYzUgQKBgQDBFlhJEcO6/2HOvKW+\n1W8rq7bxLn7hsONPo92DqAnQQCiIu2I8m7FquntwZanTX8OII9v1eyFQZnGplzDG\nYyqa3MOkg3QMtWUADS37PzRzRPzW5iW5CxLAOs4VJ+LIDIQFHLApfaOymI7Y47nX\nT4xDuYgCUxRj3SoUPM78SDungQKBgQC7Kv2vJ4vRQqusKBNkS8/OV3A1JbN3szsk\n78xw7ZX35owE+pUJ7MfsVA86VLH9IupJqrfZQMzbMs6K6SyryPF8zZ7OQX4NAphz\nL/QVFymVuO9zqH1r0Etv4h38dRkNH1IAlomPB1FpUVhpO8t7fFd+idmdNYM6kuCG\nnJOLtZpjTwKBgBxp2VwHTTI7Wn09rXZDmjRm9GjRWsKDcS/LAVHabHdEubJFQNOC\nZb066+dCTpdYREHIZRneoKxgJuG56eeHuEFJs1CGN5GXL+GuDtImHuXHhR1qiKqO\nQpgfDyx1zh16GgNWkWXJo0kowfyQpkxU3GMq7iTJbPq1FPgdaqgdSQoBAoGAeyE7\nJsFTX+UGXwk2SKL/IHWxYaVdvX9xh0kiK6CBKkbHEndvGMpmc3iRVARn22ney3u9\n2vSgUAvKiOQA+ToGc94pfPLk49YzSIPhhQZp2w+Ap4vOhuDO39nXdD/srQ9PuQdP\nk4Jy8mALU598q84PGTXCrYOIwz3g622SOzTLTk0CgYB9CcVynza483bhiazj4JJe\ntAlZj2ZaWaM2yt1S3kv4tNT85mSTuoJwrixCV7p2hj5s2JTv3pDeDl7/HjFKOcQm\nBGBHdTAAzV+2DVuGkpAQxAUi7S7AlN3g4Ti/V6L53CeDJ4bYICPUAynSyYfQo/4G\n9MHZisbGVFC/KwsFaCwimQ==\n-----END PRIVATE KEY-----\n'
} else {
  adminsdk.private_key =
    '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDCR2EziPFL3ntg\n1vqn+67g+Oheg1GqxVFavDLayBCOVp0cVRvovXxGpL9/CYR1BBSCOw90n1gsf6yT\nXZ0d5RSr1sQEfq4/y9jH1JH5RsyxkU0FyOw8JD3qxwfpbDifnruPZOVBsfNLLAYw\niomQJAcSRc8nGMWxd6+qweSx4IC7D89NZ8D0Edc52XTY2FPTy5HVFvuoTgKTHXRa\nQsPWO+0WX8u6kPOHtDFq3SPjp7AwkNrHiY+Vuj/tWO6pYTpc7l0y8JPFr2xFZJxK\nqc5QhwZDcLq6cXa6pL4+0QyzaFBfcLsAZojo/k86XPB6rWCb+b4i37D/htSbi3n4\nXbRKtfglAgMBAAECggEAKSjPNohaOq0hbXROOV2QgLgrHq7qk+fm4vbBPWmqXEWM\nVo7PcWEHnb3Uljjxd4sMP0T88sO5ff/0k2n/WfCJDxjagWtHRlvNCxUFcg7mWe5D\nJ6kYJ2u0NHPDQNg9LNAHw4roKSFmvnPOweTv3PpNBzmD+C/+3ijRrjcS2P6Lt1V0\nq++QxpPFGrMf2BKC6fiPHZmnnHWGNuKtO1mpInwGSJ4LP4k1El3JcsK3o/ynxY0S\nQ7NeR7y0rUTVnIcp6mhgAtzYGe/SmpMOdC8QcvVPWg27oVsW1186iXZAUjz6p0/5\nI8SLKJOOFN5o8dpvNIWLkHCjKYiNlgaA5RHqcMczdwKBgQD2NHvuXvdd4gI37Ie/\n22LD5MtTDEIIU/LprcUjtFO8YVwNfkXCcrD1FjiCJC0/cd7hmN89IN7NwW3DICoY\nTR3TgWSrJs4gZ+vzNXY0d0ChkZYfuF6kERVkOEUJ+Hk6DnSrCPiI6vf93NGLVH/b\nW+LIqrsYZEKF98e0HgFeFsUsvwKBgQDKAgtwhwZ5jkPYXmkjL73nE2CzllHAlYft\nV+QHjCuj3fyVHiFYWBU07U4kTWz3gM/A/O1FK4oZka1CD3JnCU9WF0VK3uEQrCD1\n3zccZbhoOmTIzleXpMFwj/MSqSLJ8QXKCWAi1mqSEwmT68mWHyxtmerWdldS15LI\n97U+ZWXAGwKBgGyq0aBubgQUAyKn1WrK7BbGXy+yk1qVovuc5QxTRTo6RqT1/NhM\nQuqJ+jsGuKnuGo+8J5wVbAGoxEeBZNMBBo8Z51Lbd9M5yxy3lgqmL/KgDYDGoY8M\ns0Jey6oQ74C+bKQo+3mDLB3yXtJ+Y0hwj/I92QJ1Dh+PM6e+LqBWsISFAoGARolY\nPT6owCExB4hP5f1xrhJSHeNLQJf2EqYx9YC4bEvDOr5+nj6DiSujsYFnnzTXVmf6\n4cBGRI9dlEeYhun1TfZqN66DoDK6f6AlukC6l4psTsHeTBE3inp5QfbVMvZ6MwX7\nD68XH1KOcZxPk5/m/45TNfe0njSwCISWQOdfFCkCgYEAozcqJzECPItzSUp9UyQl\n+n2fs3oHDwVzFUL3HpF9yazi1XWqhOFJ1glx1+eGY9Y9KS/rKfrBjyQi6VnjUoNE\n9m43EUqAGXv96h2OlIz2ap3bKV/O6c7zI13n2ilU9529N8SDvcrdEXHkP9jtCVQS\nf+KZbiwlT80eFpanU/LJNbs=\n-----END PRIVATE KEY-----\n'
}

export const ADMINSDK = adminsdk
export const SECRET = functions.config().jwt.secret
export const FIREBASEAPP =
  mode === 'production' ? firebaseProdConfig : firebaseConfig
export const BASE_URL = `http${
  mode === 'production' || mode === 'stage' ? 's' : ''
}://${
  mode === 'production'
    ? 'southamerica-east1-zelpay-prod-br'
    : mode === 'stage'
    ? 'southamerica-east1-zelpay-stage-br'
    : 'localhost:4000/zelpay-stage-br/southamerica-east1'
}${mode === 'production' || mode === 'stage' ? '.cloudfunctions.net' : ''}`

export const AWS_CONFIG = {
  region: 'sa-east-1',
  credentials: {
    accessKeyId: 'AKIATX3PF5QRXRITSOWY',
    secretAccessKey: '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',
  },
}