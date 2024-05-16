import React, { useEffect, useState } from 'react'
import AccountStore from '../../stores/accountStore'
import TenantAvailabilityState from '../../services/account/dto/tenantAvailabilityState'
import AuthenticationStore from '../../stores/authenticationStore'
import { Button, Divider, Flex, Input, Modal, Space, Switch, Typography } from 'antd'
import { L } from '../../lib/abpUtility'
interface ITenantChangeModalProps {
  accountStore: AccountStore
  authenticationStore: AuthenticationStore
  visible: boolean
  handleClose: () => void
}
declare var abp: any
const TenantChangeModal: React.FC<ITenantChangeModalProps> = (props) => {
  const { accountStore, authenticationStore, handleClose, visible } = props
  const [isTenant, setIsTenant] = useState<boolean>(false)
  const [tenancyName, setTenancyName] = useState<string>('')
  useEffect(() => {
    if (
      abp.multiTenancy.getTenancyNameCookie() !== null ||
      abp.multiTenancy.getTenancyNameCookie() !== undefined ||
      abp.multiTenancy.getTenancyNameCookie() !== ''
    ) {
      setTenancyName(abp.multiTenancy.getTenancyNameCookie())
      setIsTenant(true)
    } else {
      setIsTenant(false)
    }
  }, [])
  const changeTenant = async () => {
    if (!tenancyName) {
      abp.multiTenancy.setTenantIdCookie(undefined)
      abp.multiTenancy.setTenancyNameCookie(undefined)
      window.location.href = '/'
      return
    } else {
      await accountStore.isTenantAvailable(tenancyName)
      const { tenant } = accountStore
      switch (tenant.state) {
        case TenantAvailabilityState.Available:
          abp.multiTenancy.setTenantIdCookie(tenant.tenantId)
          abp.multiTenancy.setTenancyNameCookie(tenancyName)
          authenticationStore.loginModel.tenancyName = tenancyName
          handleClose()
          window.location.href = '/'
          return
        case TenantAvailabilityState.InActive:
          Modal.error({ title: L('Error'), content: L('TenantIsNotActive') })
          break
        case TenantAvailabilityState.NotFound:
          Modal.error({
            title: L('Error'),
            content: L('ThereIsNoTenantDefinedWithName{0}', tenancyName),
          })
          break
      }
    }
  }
  return (
    <Modal
      open={visible}
      onCancel={handleClose}
      onOk={changeTenant}
      title={L('ChangeTenant')}
      okButtonProps={{ style: { display: 'none' } }}
      cancelButtonProps={{ style: { display: 'none' } }}
    >
      <Divider style={{ margin: '16px 0' }} />
      <Space direction='vertical' style={{ width: '100%' }} size={'middle'}>
        <Space direction='horizontal' style={{ width: '100%' }} size={'large'}>
          <Typography>{L('LeaveEmptyToSwitchToHost')}</Typography>
          <Switch
            checked={isTenant}
            onChange={(checked, event) => {
              setIsTenant(checked)
              if (checked === false) {
                setTenancyName('')
              }
            }}
          />
        </Space>
        <Space direction='horizontal' style={{ width: '100%' }} size={'large'}>
          <Typography>{L('TenancyName')}</Typography>
          <Input
            width={'100%'}
            allowClear
            disabled={!isTenant}
            value={tenancyName}
            onChange={(e) => {
              setTenancyName(e.target.value)
            }}
          />
        </Space>
      </Space>
      <Divider style={{ margin: '16px 0' }} />
      <Flex gap={16} justify='end' align='center'>
        <Button danger onClick={handleClose}>
          {L('Cancel')}
        </Button>
        <Button type='primary' onClick={changeTenant}>
          {L('Ok')}
        </Button>
      </Flex>
    </Modal>
  )
}

export default TenantChangeModal
