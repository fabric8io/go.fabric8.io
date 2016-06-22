import React from 'react'
import { autobind } from 'core-decorators'
import { connect } from 'mobx-connect'

@autobind
@connect
class Deploy extends React.Component {

  handleSubmit (e) {
    e.preventDefault()
    this.context.store.manifest.items.map(async (x) => {
      const status = await this.context.store.apiServer.createItem(x)
      this.context.store.manifest.updateItem(x, status)
    })
  }

  status (code) {
    let status = 'Pending'
    let icon = 'glyphicon glyphicon-off'
    if (code === 1) {
      status = 'Creating'
      icon = 'glyphicon glyphicon-refresh spinning'
    } else if (code >= 200 && code < 300) {
      status = ''
      icon = 'glyphicon glyphicon-ok'
    } else if (code === 400) {
      status = 'Bad request'
      icon = 'glyphicon glyphicon-remove'
    } else if (code === 422) {
      status = 'Unprocessable entity'
      icon = 'glyphicon glyphicon-remove'
    } else if (code === 409) {
      status = 'Already exists'
      icon = 'glyphicon glyphicon-remove'
    } else if (code === 500) {
      icon = 'glyphicon glyphicon-exclamation-sign'
      status = 'Server error'
    }
    return (
      <span className={'pull-right status-' + code}>
        {status} <i className={icon} />
      </span>
    )
  }

  render () {
    const { apiServer, manifest } = this.context.store

    return (
      <form onSubmit={this.handleSubmit} noValidate>
        <div className='row'>
          <div className='col-lg-12'>
            <div className='callout callout-success'>
              Before we deploy your stuff
              to <a href={apiServer.server}>{apiServer.server}</a>, please review
              what you've requested to deploy. When you're ready, just click the button.
            </div>
            <div className='panel panel-primary'>
              <div className='panel-heading'>Items to create</div>
              <ul className='list-group'>
              {manifest.items.map((x) =>
                <li key={x.kind + '-' + x.metadata.name} className='list-group-item clearfix'>
                  <strong>{x.kind}:</strong> {x.metadata.name}
                  {this.status(x.responseCode)}
                </li>
              )}
              </ul>
            </div>
          </div>
          <div className='clearfix'></div>
          <div className='col-lg-12 text-center'>
            <button type='submit' className='btn'>Go fabric8!</button>
          </div>
        </div>
      </form>
    )
  }
}

export default Deploy
