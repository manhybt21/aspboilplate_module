import './index.less'

import * as React from 'react'

import { Avatar, Col, Dropdown, Menu, Row } from 'antd'
import { MenuUnfoldOutlined, MenuFoldOutlined, LogoutOutlined } from '@ant-design/icons'

import { L } from '../../lib/abpUtility'
import LanguageSelect from '../LanguageSelect'
import { Link } from 'react-router-dom'

import profilePicture from '../../images/user.png'
import { FC } from 'react'
import UserStore from '../../stores/userStore'

export interface IHeaderProps {
  collapsed?: any
  toggle?: any
}

const userDropdownMenu = (
  <Menu>
    <Menu.Item key='2'>
      <Link to='/logout'>
        <LogoutOutlined />
        <span> {L('Logout')}</span>
      </Link>
    </Menu.Item>
  </Menu>
)

const Header: FC<IHeaderProps> = ({ collapsed, toggle }) => {
  const userStore = new UserStore()
  return (
    <Row className={'header-container'}>
      <Col style={{ textAlign: 'left' }} span={12}>
        {collapsed ? (
          <MenuUnfoldOutlined className='trigger' onClick={toggle} />
        ) : (
          <MenuFoldOutlined className='trigger' onClick={toggle} />
        )}
      </Col>
      <Col
        style={{
          padding: '0px 24px 0px 15px',
          textAlign: 'right',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'end',
          gap: 24,
        }}
        span={12}
      >
        <LanguageSelect userStore={userStore} /> {'   '}
        <Dropdown overlay={userDropdownMenu} trigger={['click']}>
          <Avatar
            //style={{ height: 24, width: 24 }}
            shape='circle'
            alt={'profile'}
            src={profilePicture}
            size={'large'}
          />
        </Dropdown>
      </Col>
    </Row>
  )
}

export default Header
