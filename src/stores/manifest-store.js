import {observable, action, computed} from 'mobx'
import URI from 'urijs'
import yaml from 'js-yaml'

class Manifest {
  @observable manifest = ''

  @observable parsedManifest = null

  @observable error = null

  @action updateManifest = manifest => {
    this.manifest = manifest
    this.error = null
  }

  @action updateParsedManifest = parsedManifest => {
    this.parsedManifest = parsedManifest
  }

  @action updateError = error => {
    this.error = error
  }

  @computed get manifestURL () {
    return URI(this.manifest)
  }

  @computed get isValid () {
    return this.manifest &&
      this.manifestURL.is('absolute')
  }

  handleErrors = (response) => {
    if (!response.ok) {
      throw Error(response.statusText)
    }
    return response
  }

  downloadManifest = () => {
    if (!this.manifest) {
      return
    }
    fetch(URI('https://anywhere.fabric8.io').path(this.manifest))
      .then(this.handleErrors)
      .then((response) => {
        this.updateError(null)
        return response.text()
      }).then((body) => {
        try {
          this.updateParsedManifest(JSON.parse(body))
        } catch (e) {
          this.updateParsedManifest(yaml.safeLoad(body))
        }
        console.log(this.parsedManifest)
      })
      .catch((e) => {
        if (e instanceof TypeError) {
          this.updateError('Cannot retrieve manifest - is it accessible?')
          return
        }
        this.updateError('Cannot retrieve manifest - ' + e.message)
      })
  }
}

const singleton = new Manifest()
export default singleton
