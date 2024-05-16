import './index.css'
import './AntdCustom.css'
import * as React from 'react'
import ReactDOM from 'react-dom/client'
import moment from 'moment' // Thay đổi import ở đây
import 'moment-timezone'
import { Provider } from 'mobx-react'
import Utils from './utils/utils'
import abpUserConfigurationService from './services/abpUserConfigurationService'
import initializeStores from './stores/storeInitializer'
import registerServiceWorker from './registerServiceWorker'
import App from './App'

declare var abp: any
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
Utils.setLocalization()

abpUserConfigurationService.getAll().then((data) => {
  Utils.extend(true, abp, data.data.result)
  abp.clock.provider = Utils.getCurrentClockProvider(data.data.result.clock.provider)

  moment.locale(abp.localization.currentLanguage.name)

  if (abp.clock.provider.supportsMultipleTimezone) {
    moment.tz.setDefault(abp.timing.timeZoneInfo.iana.timeZoneId)
  }
  const stores = initializeStores()

  root.render(
    <Provider {...stores}>
      <App sessionStore={stores.sessionStore} />
    </Provider>
  )
})

registerServiceWorker()
