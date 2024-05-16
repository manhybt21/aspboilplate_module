import * as React from 'react'
import { Navigate, Route, Routes, BrowserRouter } from 'react-router-dom'

import UserLayout from '../Layout/UserLayout'
import AppLayout from '../Layout/AppLayout'
import { appRouters, userRouter } from './router.config'
import { isGranted } from '../../lib/abpUtility'

declare var abp: any

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<AppLayout />}>
          {appRouters
            .filter((x) => x.isLayout !== true)
            .map((router) => {
              return (
                router.component &&
                router.path && (
                  <Route
                    key={router.title}
                    path={router.path}
                    element={
                      !abp.session.userId ? (
                        <Navigate to='/user/login' />
                      ) : router.permission && !isGranted(router.permission) ? (
                        <Navigate to='/exception/403' />
                      ) : (
                        <router.component />
                      )
                    }
                  />
                )
              )
            })}
        </Route>
        <Route path='/user' element={<UserLayout />}>
          {userRouter
            .filter((x) => x.isLayout !== true)
            .map((router) => (
              <Route key={router.name} path={router.path} element={<router.component />} />
            ))}
        </Route>
        <Route path='*' element={<Navigate to='/exception/404' />} />
      </Routes>
    </BrowserRouter>
  )
}

export default Router
