import React, { Component } from 'react'
import { Route, Link } from 'react-router-dom'

export class NotFoundRoute extends Component {
  render() {
    return (
      <>
        <Route
          Component={(props) => {
            return (
              <Link
                to={{
                  pathname: '/exception?type=404',
                }}
              />
            )
          }}
        />
      </>
    )
  }
}

export default NotFoundRoute
