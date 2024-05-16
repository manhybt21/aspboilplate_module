import './AppLayout.less'
import React, { useState, useEffect, FC } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import DocumentTitle from 'react-document-title'
import { Layout } from 'antd'
import SiderMenu from '../../components/SiderMenu'
import utils from '../../utils/utils'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import DrawerMenu from '../DrawerMenu'
import { isMobile } from 'mobile-device-detect'

const { Content } = Layout

const AppLayout: FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    if (location.pathname === '/' || location.pathname === '') {
      navigate('/dashboard')
    }
  }, [location.pathname])

  const toggle = () => {
    setCollapsed(!collapsed)
  }

  const onCollapse = (collapsed: boolean) => {
    setCollapsed(collapsed)
  }

  return (
    <DocumentTitle title={utils.getPageTitle(location.pathname)}>
      <Layout style={{ height: '100vh' }}>
        {isMobile ? (
          <DrawerMenu onCollapse={toggle} collapsed={collapsed} />
        ) : (
          <SiderMenu onCollapse={onCollapse} collapsed={collapsed} />
        )}

        <Layout>
          <Layout.Header
            style={{
              background: '#fff',
              minHeight: 52,
              padding: 0,
            }}
          >
            <Header collapsed={collapsed} toggle={toggle} />
          </Layout.Header>
          <Content
            style={{ padding: 16, maxHeight: '100%', overflowX: 'hidden', overflowY: 'scroll' }}
          >
            <Outlet />
          </Content>
          <Footer />
        </Layout>
      </Layout>
    </DocumentTitle>
  )
}

export default AppLayout
