import './App.css'
import React, { useEffect } from 'react'
import Router from './components/Router'
import SignalRAspNetCoreHelper from './lib/signalRAspNetCoreHelper'
import SessionStore from './stores/sessionStore'
import { observer } from 'mobx-react-lite' // Correct import

export interface IAppProps {
  sessionStore?: SessionStore
}

const App: React.FC<IAppProps> = (props) => {
  const fetchData = async () => {
    await props.sessionStore?.getCurrentLoginInformations()

    const features = props.sessionStore?.currentLogin.application.features

    if (props.sessionStore?.currentLogin.user && features) {
      const hasSignalR = features['SignalR'] ?? false
      const hasSignalRAspNetCore = features['SignalR.AspNetCore'] ?? false

      if (hasSignalR && hasSignalRAspNetCore) {
        SignalRAspNetCoreHelper.initSignalR()
      }
    }
  }
  useEffect(() => {
    fetchData()
  }, []) // Optionally add props.sessionStore if you expect it to change

  return <Router />
}

export default observer(App)
