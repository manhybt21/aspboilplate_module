import * as React from 'react'

import { Link, Route } from 'react-router-dom'

import { isGranted } from '../../lib/abpUtility'

declare var abp: any

const ProtectedRoute = ({ path, component: Component, permission, render, ...rest }: any) => {
  return (
    <Route
      {...rest}
      render={(props: any) => {
        if (!abp.session.userId)
          return (
            <Link
              to={{
                pathname: '/user/login',
              }}
            />
          )

        if (permission && !isGranted(permission)) {
          return (
            <Link
              to={{
                pathname: '/exception?type=401',
              }}
            />
          )
        }

        return Component ? <Component {...props} /> : render(props)
      }}
    />
  )
}

export default ProtectedRoute
