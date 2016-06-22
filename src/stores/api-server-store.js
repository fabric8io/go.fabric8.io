import {observable, action, computed} from 'mobx'
import URI from 'urijs'
import pluralize from 'pluralize'

class APIServer {
  @observable server = ''

  @observable token = ''

  @observable namespace = ''

  @observable useCORSProxy = false

  @observable error = null

  @observable validated = false

  @action updateServer = server => {
    this.server = server
    this.error = null
  }

  @action updateNamespace = namespace => {
    this.namespace = namespace
    this.error = null
  }

  @action updateToken = token => {
    this.token = token
    this.error = null
  }

  @action updateCORSProxy = useCORSProxy => {
    this.useCORSProxy = useCORSProxy
    this.error = null
  }

  @action updateError = error => {
    this.error = error
  }

  @action updateValidated = validated => {
    this.validated = validated
  }

  @computed get serverURL () {
    if (this.useCORSProxy) {
      return URI('https://anywhere.fabric8.io').path(this.server)
    }

    return URI(this.server)
  }

  @computed get isValid () {
    return this.server &&
      this.namespace &&
      this.error === null &&
      this.serverURL.is('absolute')
  }

  @computed get isValidated () {
    return this.isValid && this.validated
  }

  handleErrors = (response) => {
    if (!response.ok) {
      throw Error(response.statusText)
    }
    return response
  }

  validate = () => {
    if (!this.server) {
      return
    }
    if (!this.namespace) {
      return
    }
    let init = {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      mode: 'cors',
    }
    if (this.token) {
      init.headers['Authorization'] = 'Bearer ' + this.token
    }
    fetch(this.serverURL.clone().segment(['/api/v1/namespaces', this.namespace, 'pods']), init)
      .then(this.handleErrors)
      .then(() => {
        this.updateError(null)
        this.updateValidated(true)
      })
      .catch((e) => {
        if (e instanceof TypeError) {
          this.updateError('Cannot connect to API server - is it accessible?')
          return
        }
        this.updateError('Cannot connect to API server - ' + e.message)
      })
  }

  createItem = async (item) => {
    let init = {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      mode: 'cors',
      method: 'POST',
      body: JSON.stringify(item),
    }
    if (this.token) {
      init.headers['Authorization'] = 'Bearer ' + this.token
    }
    const url = this.itemURL(item)
    try {
      // request
      const response = await fetch(url, init).then((response) => { return response })

      return response.status
    } catch (error) {
      return 500
    }
  }

  itemURL (item) {
    let segment = ['/api']

    const k = item.kind.toLowerCase()
    if (k === 'oauthclient' ||
      k === 'build' ||
      k === 'buildconfig' ||
      k === 'oauthclient' ||
      k === 'deploymentconfig') {
      segment = ['/oapi']
    }

    if (/\//.test(item.apiVersion)) {
      segment[0] = segment[0] + 's'
    }

    segment.push(item.apiVersion)

    if (this.isItemNamespaced(k)) {
      segment.push('namespaces')
      segment.push(this.namespace)
    }

    segment.push(pluralize(item.kind.toLowerCase()))

    return this.serverURL.clone().segment(segment)
  }

  isItemNamespaced (kind) {
    if (kind === 'oauthclient' ||
      kind === 'node'
    ) {
      return false
    }
    return true
  }
}

const singleton = new APIServer()
export default singleton
