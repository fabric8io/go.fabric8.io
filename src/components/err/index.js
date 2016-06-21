import React from 'react'

class Err extends React.Component {
  render () {
    if (this.props.error) {
      return (
        <div className='text-center alert alert-danger' role='alert'>
          {this.props.error}
          {this.props.children}
        </div>
      )
    } else {
      return null
    }
  }
}

Err.propTypes = {
  error: React.PropTypes.string,
  children: React.PropTypes.node,
}

export default Err
