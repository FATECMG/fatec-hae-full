import { app } from '@docker/express/config/App'
import { env } from '@docker/config/Environment'

app.listen(env.port, () => { console.log(`Server running at http://localhost:${env.port}`) })
