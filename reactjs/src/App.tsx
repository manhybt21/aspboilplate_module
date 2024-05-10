import './App.css';
import React, { useEffect } from 'react';
import Router from './components/Router';
import SignalRAspNetCoreHelper from './lib/signalRAspNetCoreHelper';
import SessionStore from './stores/sessionStore'; // Import SessionStore directly
import { Feature } from './services/session/dto/applicationInfoDto';

const App: React.FC = () => {
  const sessionStore = new SessionStore(); // Instantiate SessionStore

  useEffect(() => {
    const fetchData = async () => {
      await sessionStore.getCurrentLoginInformations();

      const { currentLogin } = sessionStore;

      if (currentLogin.user && currentLogin.application && currentLogin.application.features) {
        const features: Feature[] = currentLogin.application.features;

        const signalRFeature = features.find((feature) => feature.name === 'SignalR');
        const signalRAspNetCoreFeature = features.find(
          (feature) => feature.name === 'SignalR.AspNetCore'
        );

        if (signalRFeature && signalRAspNetCoreFeature) {
          SignalRAspNetCoreHelper.initSignalR();
        }
      }
    };

    fetchData();
  }, [sessionStore]);

  return <Router />;
};

export default App;
