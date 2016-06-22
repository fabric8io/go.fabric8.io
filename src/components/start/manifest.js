import React from 'react'
import { autobind } from 'core-decorators'
import { connect } from 'mobx-connect'
import Err from '../err'

@autobind
@connect
class Manifest extends React.Component {
  handleManifestChange (e) {
    this.context.store.manifest.updateManifest(e.target.value)
  }

  handleSubmit (e) {
    e.preventDefault()
    this.context.store.manifest.downloadManifest()
  }

  render () {
    const { apiServer, manifest } = this.context.store

    return (
      <form onSubmit={this.handleSubmit} noValidate>
        <div className='row'>
          <div className='col-lg-12'>
            <div className='callout callout-success'>
              So now we've validated we can connect to your API server
              at <a href={apiServer.server}>{apiServer.server}</a>,
              we need to know what you want to deploy. Enter the address of a manifest that
              you want to load. On the next page you will be able to review what is going to
              be created before we do anything.
            </div>
            <div className='form-group'>
              <label htmlFor='manifest'>Manifest address</label>
              <input type='url' className='form-control' value={manifest.manifest}
                onChange={this.handleManifestChange}
                placeholder='http://your.domain.com/your/manifest.yml *'
                id='manifest' />
              <p className='help-block'>The URL of a manifest to load, either JSON or YAML.</p>
            </div>
          </div>
          <div className='clearfix'></div>
          <div className='col-lg-12 text-center'>
            <Err error={manifest.error}>
              <br /><br />Please check your settings &amp; try again.
            </Err>
            <button type='submit' className='btn' disabled={!manifest.isValid}>Next</button>
          </div>
        </div>
      </form>
    )
  }
}

export default Manifest
