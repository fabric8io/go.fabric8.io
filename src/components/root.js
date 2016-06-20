import React from 'react'
import { browserHistory, IndexRoute, Route, Router } from 'react-router'

// Components
import App from './app/app'
import Start from './start/start'

export function Root () {
  return (
    <Router history={browserHistory}>
      <Route component={App} path='/'>
        <IndexRoute component={Start} />
      </Route>
    </Router>
  )
}
