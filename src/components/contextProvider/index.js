import React from 'react'
import { contextTypes } from 'mobx-connect'

class ContextProvider extends React.Component {
  getChildContext () {
    return this.props.context
  }
  render () {
    return this.props.children
  }
}

ContextProvider.propTypes = {
  children: React.PropTypes.node,
  context: React.PropTypes.object.isRequired,
}

ContextProvider.childContextTypes = contextTypes

export default ContextProvider
