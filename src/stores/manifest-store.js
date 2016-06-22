import {observable, action, computed} from 'mobx'
import URI from 'urijs'
import yaml, {YAMLException} from 'js-yaml'

class Manifest {
  @observable manifest = ''

  @observable items = []

  @observable parameters = []

  @observable parametersCompleted = false

  @observable error = null

  @action updateManifest = manifest => {
    this.manifest = manifest
    this.items = []
    this.parameters = []
    this.error = null
  }

  @action updateItem = (item, responseCode) => {
    item.responseCode = responseCode
  }

  @action updateParametersCompleted = (b) => {
    this.parametersCompleted = b
  }

  @action updateParsedManifest = parsedManifest => {
    this.parameters = []

    let tmp = []
    if (parsedManifest.apiVersion && parsedManifest.kind) {
      if (parsedManifest.kind.toLowerCase() === 'list') {
        tmp = parsedManifest.items || []
      } else if (parsedManifest.kind.toLowerCase() === 'template') {
        tmp = parsedManifest.objects || []
        this.parameters = parsedManifest.parameters || []
      } else {
        tmp = [parsedManifest]
      }
      tmp.map(i => {
        i.responseCode = 0
      })
      this.items = tmp
      return
    }

    this.items = []
    throw Error('it doesn\'t look like a valid manifest')
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

  @computed get isParametersValid () {
    if (this.parameters.length === 0) {
      return true
    }
    if (!this.parametersCompleted) {
      return false
    }
    this.parameters.forEach((p) => {
      if (p.required && !p.value) {
        this.updateParametersCompleted(false)
        return false
      }
    })
    return this.parametersCompleted
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
      })
      .catch((e) => {
        if (e instanceof TypeError) {
          this.updateError('Cannot retrieve manifest - is it accessible?')
          return
        }
        if (e instanceof YAMLException) {
          this.updateError('Cannot parse manifest - is it correctly formed JSON or YAML?')
          return
        }
        this.updateError('Cannot retrieve manifest - ' + e.message)
      })
  }

  processItem = (item) => {
    let processed = JSON.stringify(item)
    this.parameters.forEach((p) => {
      processed = processed.replace(new RegExp('\\${' + p.name + '}', 'gi'), p.value)
    })
    return JSON.parse(processed)
  }
}

const singleton = new Manifest()
export default singleton
