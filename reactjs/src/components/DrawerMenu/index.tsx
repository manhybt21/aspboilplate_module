import './index.less'
import { Avatar, Drawer, Flex } from 'antd'
import React, { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import AbpLogo from '../../images/abp-logo-long.png'
import NavMenu from '../NavMenu'
interface IDrawerMenuProps {
  onCollapse: any
  collapsed: boolean
}
const DrawerMenu: FC<IDrawerMenuProps> = (props) => {
  const { collapsed, onCollapse } = props
  const navigate = useNavigate()
  const handleMenuClick = (path: string) => {
    navigate(path)
    onCollapse()
  }
  return (
    <Drawer
      open={collapsed}
      placement='left'
      width={256}
      onClose={(e) => {
        onCollapse()
      }}
      styles={{
        content: { backgroundColor: '#001529' },
        body: {
          backgroundColor: '#001529',
          paddingLeft: 8,
          paddingRight: 8,
          paddingTop: 16,
          paddingBottom: 16,
        },
        header: {
          display: 'none',
        },
      }}
    >
      <Flex align='center' justify='center' style={{ marginBottom: 16 }}>
        <Avatar shape='square' style={{ height: 54, width: 128 }} src={AbpLogo} />
      </Flex>
      <NavMenu handleMenuClick={handleMenuClick} />
    </Drawer>
  )
}

export default DrawerMenu
