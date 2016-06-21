import React from 'react'
import { browserHistory, IndexRoute, Route, Router, RouterContext } from 'react-router'
import ContextProvider from '../contextProvider'
import stores from '../../stores'

// Components
import App from '../app'
import Start from '../start'

const context = {
  store: stores,
}

function createContextProviderElement (props) {
  return (
    <ContextProvider context={context}>
      <RouterContext {...props} />
    </ContextProvider>
  )
}

export function Root () {
  return (
    <Router history={browserHistory} render={createContextProviderElement}>
      <Route component={App} path='/'>
        <IndexRoute component={Start} />
      </Route>
    </Router>
  )
}
