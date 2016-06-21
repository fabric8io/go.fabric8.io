import React from 'react'
import { autobind } from 'core-decorators'
import { connect } from 'mobx-connect'
import classNames from 'classnames'

import Server from './server'
import Manifest from './manifest'

@autobind
@connect
class Start extends React.Component {

  render () {
    const { apiServer, manifest } = this.context.store

    let serverClass = classNames({
      'col-lg-12': true,
      'hidden': apiServer.isValidated,
    })

    let manifestClass = classNames({
      'col-lg-12': true,
      'hidden': !apiServer.isValidated || manifest.parsedManifest,
    })

    return (
      <section id='contact'>
        <div className='container'>
          <div className='row'>
            <div className='col-lg-12 text-center'>
              <h2 className='section-heading'>Deploy stuff</h2>
            </div>
          </div>
          <div className='row'>
            <div className={serverClass}>
              <Server />
            </div>
            <div className={manifestClass}>
              <Manifest />
            </div>
          </div>
        </div>
      </section>
    )
  }
}

export default Start
