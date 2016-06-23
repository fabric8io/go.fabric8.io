import React from 'react'
import { autobind } from 'core-decorators'
import { connect } from 'mobx-connect'

@autobind
@connect
class Parameters extends React.Component {

  handleParamChange (e) {
    const paramName = e.target.id
    const paramValue = e.target.value
    this.context.store.manifest.updateParameterValue(paramName, paramValue)
  }

  handleSubmit (e) {
    e.preventDefault()
    this.context.store.manifest.updateParametersCompleted(true)
  }

  render () {
    const { manifest } = this.context.store

    return (
      <form onSubmit={this.handleSubmit} noValidate>
        <div className='row'>
          <div className='col-lg-12'>
            <div className='callout callout-success'>
              You have chosen a template to deploy from. Provide values below &amp;
              when you're ready, just click the button.
            </div>
            {manifest.parameters.map((p) =>
              <div key={'param-' + p.name} className='form-group'>
                <label htmlFor={'param-' + p.name}>{p.displayName || p.name}</label>
                <input type='text' className='form-control' value={p.value}
                  onChange={this.handleParamChange}
                  placeholder='Your value'
                  id={p.name} />
                <p className='help-block'>{p.description}</p>
              </div>
            )}
          </div>
          <div className='clearfix'></div>
          <div className='col-lg-12 text-center'>
            <button type='submit' className='btn'>Next</button>
          </div>
        </div>
      </form>
    )
  }
}

export default Parameters
