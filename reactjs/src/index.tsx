import './index.css';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import moment from 'moment'; // Thay đổi import ở đây
import 'moment-timezone';
//import App from './App';
//import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Provider } from 'mobx-react';
import Utils from './utils/utils';
import abpUserConfigurationService from './services/abpUserConfigurationService';
import initializeStores from './stores/storeInitializer';
import registerServiceWorker from './registerServiceWorker';
//import UserLayout from './components/Layout/UserLayout';
import Login from './scenes/Login';

declare var abp: any;

Utils.setLocalization();

abpUserConfigurationService.getAll().then((data) => {
  Utils.extend(true, abp, data.data.result);
  abp.clock.provider = Utils.getCurrentClockProvider(data.data.result.clock.provider);

  moment.locale(abp.localization.currentLanguage.name);

  if (abp.clock.provider.supportsMultipleTimezone) {
    moment.tz.setDefault(abp.timing.timeZoneInfo.iana.timeZoneId);
  }
  const stores = initializeStores();
  ReactDOM.render(
    <Provider {...stores}>
      <Login />
    </Provider>,
    document.getElementById('root') as HTMLElement
  );
});


registerServiceWorker();
