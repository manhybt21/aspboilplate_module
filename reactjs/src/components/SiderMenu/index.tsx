import './index.less'
import React from 'react'
import { Avatar, Col, Layout } from 'antd'
import { useNavigate } from 'react-router-dom' // Importing useNavigate and useLocation
import AbpLogo from '../../images/abp-logo-long.png'
import NavMenu from '../NavMenu'

const { Sider } = Layout

export interface ISiderMenuProps {
  collapsed: boolean
  onCollapse: any
}

const SiderMenu = (props: ISiderMenuProps) => {
  const { collapsed, onCollapse } = props
  const navigate = useNavigate()
  const handleMenuClick = (path: string) => {
    navigate(path)
  }

  return (
    <Sider
      trigger={null}
      className='sidebar'
      width={256}
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
    >
      {collapsed ? (
        <Col style={{ textAlign: 'center', marginTop: 15, marginBottom: 10 }}>
          <Avatar shape='square' style={{ height: 27, width: 64 }} src={AbpLogo} />
        </Col>
      ) : (
        <Col style={{ textAlign: 'center', marginTop: 15, marginBottom: 10 }}>
          <Avatar shape='square' style={{ height: 54, width: 128 }} src={AbpLogo} />
        </Col>
      )}

      <NavMenu handleMenuClick={handleMenuClick} />
    </Sider>
  )
}

export default SiderMenu
