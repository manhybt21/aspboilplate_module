import React, { useState, useRef, FC } from 'react';
import { Button, Card, Checkbox, Col, Form, Input, Modal, Row } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { inject, observer } from 'mobx-react';
import { L } from '../../lib/abpUtility';
import Stores from '../../stores/storeIdentifier';
import TenantAvailabilityState from '../../services/account/dto/tenantAvailabilityState';
import rules from './index.validation';
import { Link } from 'react-router-dom';
import { FormInstance } from 'antd/lib';
declare var abp: any;
const FormItem = Form.Item;

const Login: FC<any> = (props) => {
  const [showModal, setShowModal] = useState(false);
  const [tenancyName, setTenancyName] = useState('');
  const formRef = useRef<FormInstance>(null);

  const { authenticationStore, sessionStore, accountStore } = props;

  const changeTenant = async () => {
    if (!tenancyName) {
      abp.multiTenancy.setTenantIdCookie(undefined);
      window.location.href = '/';
      return;
    } else {
      await accountStore.isTenantAvailable(tenancyName);
      const { tenant } = accountStore;
      switch (tenant.state) {
        case TenantAvailabilityState.Available:
          abp.multiTenancy.setTenantIdCookie(tenant.tenantId);
          authenticationStore.loginModel.tenancyName = tenancyName;
          setShowModal(false);
          window.location.href = '/';
          return;
        case TenantAvailabilityState.InActive:
          Modal.error({ title: L('Error'), content: L('TenantIsNotActive') });
          break;
        case TenantAvailabilityState.NotFound:
          Modal.error({
            title: L('Error'),
            content: L('ThereIsNoTenantDefinedWithName{0}', tenancyName),
          });
          break;
      }
    }
  };

  const handleSubmit = async (values: any) => {
    const { loginModel } = authenticationStore;
    await authenticationStore.login(values);
    sessionStorage.setItem('rememberMe', loginModel.rememberMe ? '1' : '0');
    //const { state } = location;
    window.location.href = '/';
  };

  //const { from } = location.state || { from: { pathname: '/' } };
  if (authenticationStore.isAuthenticated) return <Link to={'/'} />;

  return (
    <Form className="" onFinish={handleSubmit} ref={formRef}>
      <Row style={{ marginTop: 100 }}>
        <Col span={8} offset={8}>
          <Card>
            <Row>
              {!!sessionStore.currentLogin.tenant ? (
                <Col span={24} offset={0} style={{ textAlign: 'center' }}>
                  <Button type="link" onClick={() => setShowModal(true)}>
                    {L('CurrentTenant')} : {sessionStore.currentLogin.tenant.tenancyName}
                  </Button>
                </Col>
              ) : (
                <Col span={24} offset={0} style={{ textAlign: 'center' }}>
                  <Button type="link" onClick={() => setShowModal(true)}>
                    {L('NotSelected')}
                  </Button>
                </Col>
              )}
            </Row>
          </Card>
        </Col>
      </Row>

      <Row>
        <Modal
          visible={showModal}
          onCancel={() => setShowModal(false)}
          onOk={changeTenant}
          title={L('ChangeTenant')}
          okText={L('OK')}
          cancelText={L('Cancel')}
        >
          <Row>
            <Col span={8} offset={8}>
              <h3>{L('TenancyName')}</h3>
            </Col>
            <Col>
              <FormItem name={'tenancyName'}>
                <Input
                  placeholder={L('TenancyName')}
                  prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                  size="large"
                  onChange={(e) => setTenancyName(e.target.value)}
                />
              </FormItem>
              {!formRef.current?.getFieldValue('tenancyName') ? (
                <div>{L('LeaveEmptyToSwitchToHost')}</div>
              ) : (
                ''
              )}
            </Col>
          </Row>
        </Modal>
      </Row>
      <Row style={{ marginTop: 10 }}>
        <Col span={8} offset={8}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <h3>{L('WellcomeMessage')}</h3>
            </div>
            <FormItem name={'userNameOrEmailAddress'} rules={rules.userNameOrEmailAddress}>
              <Input
                placeholder={L('UserNameOrEmail')}
                prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                size="large"
              />
            </FormItem>

            <FormItem name={'password'} rules={rules.password}>
              <Input
                placeholder={L('Password')}
                prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                type="password"
                size="large"
              />
            </FormItem>
            <Row style={{ margin: '0px 0px 10px 15px ' }}>
              <Col span={12} offset={0}>
                <Checkbox
                  checked={authenticationStore.loginModel.rememberMe}
                  onChange={authenticationStore.loginModel.toggleRememberMe}
                  style={{ paddingRight: 8 }}
                />
                {L('RememberMe')}
                <br />
                <a>{L('ForgotPassword')}</a>
              </Col>

              <Col span={8} offset={4}>
                <Button
                  style={{ backgroundColor: '#f5222d', color: 'white' }}
                  htmlType={'submit'}
                  danger
                >
                  {L('LogIn')}
                </Button>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </Form>
  );
};

export default inject(
  Stores.AuthenticationStore,
  Stores.SessionStore,
  Stores.AccountStore
)(observer(Login));
