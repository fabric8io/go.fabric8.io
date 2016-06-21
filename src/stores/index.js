import apiServer from './api-server-store'
import manifest from './manifest-store'

import { useStrict } from 'mobx'

useStrict(true)

export default {
  apiServer: apiServer,
  manifest: manifest,
}
