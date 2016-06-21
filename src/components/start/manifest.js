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
    const { manifest } = this.context.store

    return (
      <form onSubmit={this.handleSubmit} noValidate>
        <div className='row'>
          <div className='col-lg-12'>
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
