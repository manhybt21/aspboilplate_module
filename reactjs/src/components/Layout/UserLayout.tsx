import './UserLayout.less'

import * as React from 'react'

import { Outlet } from 'react-router-dom'

import { Col } from 'antd'
import DocumentTitle from 'react-document-title'
import Footer from '../Footer'
import LanguageSelect from '../LanguageSelect'
import utils from '../../utils/utils'

const UserLayout: React.FC = () => {
  return (
    <DocumentTitle title={utils.getPageTitle(window.location.pathname)}>
      <Col className='container'>
        <div style={{ height: 'calc(100vh - 55px)' }}>
          <div className={'lang'}>
            <LanguageSelect />
          </div>
          <div style={{ height: '100%', width: '100%', display: 'flex', justifyContent: 'center' }}>
            <Outlet />
          </div>
        </div>
        <Footer />
      </Col>
    </DocumentTitle>
  )
}

export default UserLayout
