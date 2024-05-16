import { Menu } from 'antd'
import React, { FC } from 'react'
import { L, isGranted } from '../../lib/abpUtility'
import { appRouters } from '../Router/router.config'
import utils from '../../utils/utils'
import { useLocation } from 'react-router-dom'
interface INavMenuProps {
  handleMenuClick: (e: any) => void
}
const NavMenu: FC<INavMenuProps> = (props) => {
  const { handleMenuClick } = props
  const location = useLocation()
  const currentRoute = utils.getRoute(location.pathname)
  return (
    <Menu theme='dark' mode='inline' selectedKeys={[currentRoute ? currentRoute.path : '']}>
      {appRouters
        .filter((item: any) => !item.isLayout && item.showInMenu)
        .map((route: any, index: number) => {
          if (route.permission && !isGranted(route.permission)) return null

          return (
            <Menu.Item key={route.path} onClick={() => handleMenuClick(route.path)}>
              <route.icon />
              <span>{L(route.title)}</span>
            </Menu.Item>
          )
        })}
    </Menu>
  )
}

export default NavMenu
