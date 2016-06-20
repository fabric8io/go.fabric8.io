import React, { PropTypes } from 'react'
import DevTools from 'mobx-react-devtools'

const App = props => {
  return (
    <div>
      <main className='main'>{props.children}</main>
      <DevTools />
    </div>
  )
}

App.propTypes = {
  children: PropTypes.object.isRequired,
}

export default App

