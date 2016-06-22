import React from 'react'
import { autobind } from 'core-decorators'
import { connect } from 'mobx-connect'
import Err from '../err'

@autobind
@connect
class Server extends React.Component {
  origin = window.location.protocol + '//' + window.location.host

  handleServerChange (e) {
    this.context.store.apiServer.updateServer(e.target.value)
  }

  handleNamespaceChange (e) {
    this.context.store.apiServer.updateNamespace(e.target.value)
  }

  handleTokenChange (e) {
    this.context.store.apiServer.updateToken(e.target.value)
  }

  handleUseCORSChange (e) {
    this.context.store.apiServer.updateCORSProxy(e.target.checked)
  }

  handleSubmit (e) {
    e.preventDefault()
    this.context.store.apiServer.validate()
  }

  render () {
    const { apiServer } = this.context.store

    return (
      <form onSubmit={this.handleSubmit} noValidate>
        <div className='row'>
          <div className='col-lg-12'>
            <div className='callout callout-success'>
              To get started, we need to know where you want to deploy stuff to. Please
              enter your API server, namespace &amp; optionally your API token into the form below.
            </div>
            <div className='form-group'>
              <label htmlFor='server'>API server address</label>
              <input type='url' className='form-control' value={apiServer.server}
                onChange={this.handleServerChange}
                placeholder='https://api.server.com:8443 *'
                id='server' />
              <p className='help-block'>The address of your Kubernetes or OpenShift server.</p>
            </div>
            <div className='form-group'>
              <label htmlFor='namespace'>Namespace</label>
              <input type='text' className='form-control' value={apiServer.namespace}
                onChange={this.handleNamespaceChange}
                placeholder='default *'
                id='namespace' />
              <p className='help-block'>The namespace to deploy your stuff into.</p>
            </div>
            <div className='form-group'>
              <label htmlFor='token'>Authentication token (optional)</label>
              <input type='password' className='form-control' value={apiServer.token}
                onChange={this.handleTokenChange}
                placeholder='Your token'
                id='token' />
              <p className='help-block'>Your Kubernetes or OpenShift API token, if required.</p>
            </div>
            <div className='form-group'>
              <div className='callout callout-warning'>
                <h4>CORS</h4>
                If your API server requires a valid CORS origin, this web page will not be
                able to contact your API server directly. If you are having trouble using
                this web page to deploy to your API server then please
                add <a href={this.origin}>{this.origin}</a> as a valid origin.
                <br /><br />
                Alternatively, if your API server is publicly accessible, you can use our CORS proxy
                to work around this restriction, but be aware that your API token (if you're using
                one) will be sent with your request to our CORS proxy. Be assured that your token is
                safe: the request uses TLS and your token will not be stored in any way.
              </div>
              <label>
                <input type='checkbox' value={apiServer.useProxy}
                  onChange={this.handleUseCORSChange}
                  id='useProxy' /> Use CORS proxy
              </label>
            </div>
          </div>
          <div className='clearfix'></div>
          <div className='col-lg-12 text-center'>
            <Err error={apiServer.error}>
              <br /><br />Please check your settings &amp; try again.
            </Err>
            <button type='submit' className='btn' disabled={!apiServer.isValid}>Next</button>
          </div>
        </div>
      </form>
    )
  }
}

export default Server
