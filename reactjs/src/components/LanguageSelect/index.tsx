import './index.less'
import 'famfamfam-flags/dist/sprite/famfamfam-flags.css'

import * as React from 'react'

import { Button, Dropdown, Menu } from 'antd'
//import { GlobalOutlined } from '@ant-design/icons'

import { L } from '../../lib/abpUtility'
import UserStore from '../../stores/userStore'
//import classNames from 'classnames'

declare var abp: any

export interface ILanguageSelectProps {
  userStore?: UserStore
}
const LanguageSelect: React.FC<ILanguageSelectProps> = ({ userStore }) => {
  const languages = abp.localization.languages.filter((val: any) => !val.isDisabled)

  const changeLanguage = async (languageName: string) => {
    await userStore?.changeLanguage(languageName)

    abp.utils.setCookieValue(
      'Abp.Localization.CultureName',
      languageName,
      new Date(new Date().getTime() + 5 * 365 * 86400000), // 5 years
      abp.appPath
    )

    window.location.reload()
  }
  const currentLanguage =
    languages.find((x: any) => x.name === abp.localization.currentLanguage.name) ?? languages[0]

  const langMenu = (
    <Menu className={'menu'} selectedKeys={[currentLanguage.name]}>
      {languages.map((item: any) => (
        <Menu.Item key={item.name} onClick={() => changeLanguage(item.name)}>
          <i className={item.icon} /> {item.displayName}
        </Menu.Item>
      ))}
    </Menu>
  )

  return (
    <Dropdown overlay={langMenu} placement='bottomRight'>
      <Button type='text' style={{ padding: '4px 8px' }} title={L('Languages')}>
        <span className={currentLanguage.icon}></span>
      </Button>
    </Dropdown>
  )
}

export default LanguageSelect
