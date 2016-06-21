import {observable, action, computed} from 'mobx'
import URI from 'urijs'

class APIServer {
  @observable server = ''

  @observable token = ''

  @observable useCORSProxy = false

  @observable error = null

  @observable validated = false

  @action updateServer = server => {
    this.server = server
    this.error = null
  }

  @action updateToken = token => {
    this.token = token
  }

  @action updateCORSProxy = useCORSProxy => {
    this.useCORSProxy = useCORSProxy
  }

  @action updateError = error => {
    this.error = error
  }

  @action updateValidated = validated => {
    this.validated = validated
  }

  @computed get serverURL () {
    return URI(this.server)
  }

  @computed get isValid () {
    return this.server &&
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
    let init = {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      mode: 'cors',
    }
    if (this.token) {
      init.headers['Authentication'] = 'Bearer ' + this.token
    }
    fetch(this.serverURL.path('/api/v1'), init)
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
}

const singleton = new APIServer()
export default singleton
