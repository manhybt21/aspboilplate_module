import React, { useState, useRef, FC } from 'react'
import { Button, Card, Checkbox, Col, Flex, Form, Input, Row, Typography } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { inject, observer } from 'mobx-react'
import { L } from '../../lib/abpUtility'
import Stores from '../../stores/storeIdentifier'
import rules from './index.validation'
import { FormInstance } from 'antd/lib'
import TenantChangeModal from '../../components/TenantChangeModal'
import AccountStore from '../../stores/accountStore'
import AuthenticationStore from '../../stores/authenticationStore'
import LoginModel from '../../models/Login/loginModel'
declare var abp: any
const FormItem = Form.Item
export interface ILoginProps {
  authenticationStore: AuthenticationStore
  accountStore: AccountStore
}
const Login: FC<ILoginProps> = (props) => {
  const [showModal, setShowModal] = useState(false)
  const formRef = useRef<FormInstance<LoginModel>>(null)

  const { authenticationStore, accountStore } = props
  const handleSubmit = async (values: LoginModel) => {
    await authenticationStore.login(values)
    sessionStorage.setItem('rememberMe', values.rememberMe ? '1' : '0')
    window.location.href = '/'
  }

  return (
    <Flex justify='center' align='center' style={{ width: '100%' }}>
      <Row style={{ width: '100%', padding: 16 }}>
        <Col xs={24} sm={8}></Col>
        <Col xs={24} sm={8}>
          <Form className='' onFinish={handleSubmit} ref={formRef} layout='vertical'>
            <Card style={{ marginTop: 12 }}>
              <div style={{ textAlign: 'center' }}>
                <h3>{L('WelcomeMessage')}</h3>
              </div>
              <Flex justify='center' align='center' style={{ marginBottom: 16 }} gap={8}>
                <Typography.Text color='#3f4254'>
                  {L('CurrentTenant')} :{' '}
                  {!!abp.multiTenancy.getTenancyNameCookie()
                    ? abp.multiTenancy.getTenancyNameCookie()
                    : L('NotSelected')}
                </Typography.Text>
                <Button type='link' onClick={() => setShowModal(true)} style={{ padding: 0 }}>
                  ({L('ChangeTenant')})
                </Button>
              </Flex>
              <Form.Item name={'userNameOrEmailAddress'} rules={rules.userNameOrEmailAddress}>
                <Input
                  placeholder={L('UserNameOrEmail')}
                  size='large'
                  prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                  variant='filled'
                />
              </Form.Item>
              <FormItem name={'password'} rules={rules.password}>
                <Input.Password
                  placeholder={L('Password')}
                  prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                  size='large'
                />
              </FormItem>
              <Row>
                <Col xs={12}>
                  <FormItem name={'rememberMe'} valuePropName='checked'>
                    <Checkbox style={{ paddingRight: 8 }}>{L('RememberMe')}</Checkbox>
                  </FormItem>
                </Col>
                <Col xs={12} style={{ textAlign: 'end' }}>
                  <a>{L('ForgotPassword')}</a>
                </Col>
              </Row>
              <FormItem style={{ marginTop: 24 }}>
                <Button htmlType='submit' type='primary' size={'large'} style={{ width: '100%' }}>
                  {L('LogIn')}
                </Button>
              </FormItem>
            </Card>
          </Form>
        </Col>
        <Col xs={24} sm={8}></Col>
      </Row>
      <TenantChangeModal
        accountStore={accountStore}
        authenticationStore={authenticationStore}
        handleClose={() => {
          setShowModal(false)
        }}
        visible={showModal}
      />
    </Flex>
  )
}

export default inject(
  Stores.AuthenticationStore,
  Stores.SessionStore,
  Stores.AccountStore
)(observer(Login))
