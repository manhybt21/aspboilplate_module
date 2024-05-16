import * as React from 'react'

import { Checkbox, Col, Form, Input, Modal } from 'antd'

import { FormInstance } from 'antd/lib/form'
import { L } from '../../../lib/abpUtility'
import rules from './createOrUpdateTenant.validation'

export interface ICreateOrUpdateTenantProps {
  visible: boolean
  modalType: string
  onCreate: () => Promise<void>
  onCancel: () => void
  formRef: React.RefObject<FormInstance>
}

const CreateOrUpdateTenantModal: React.FC<ICreateOrUpdateTenantProps> = (props) => {

  const { visible, onCancel, onCreate, formRef } = props

  return (
    <Modal open={visible} onCancel={onCancel} onOk={onCreate} title={L('Tenants')} width={550}>
      <Form ref={formRef} layout='vertical'>
        <Form.Item
          label={L('TenancyName')}
          name={'tenancyName'}
          rules={rules.tenancyName}
        >
          <Input />
        </Form.Item>
        <Form.Item label={L('Name')} name={'name'} rules={rules.name} >
          <Input />
        </Form.Item>
        {props.modalType === 'edit' ? (
          <Form.Item
            label={L('AdminEmailAddress')}
            name={'adminEmailAddress'}
            rules={rules.adminEmailAddress as []}
          >
            <Input />
          </Form.Item>
        ) : null}
        {props.modalType === 'edit' ? (
          <Form.Item
            label={L('DatabaseConnectionString')}
            name={'connectionString'}
            
          >
            <Input />
          </Form.Item>
        ) : null}
        <Form.Item
          label={L('IsActive')}
          name={'isActive'}
          valuePropName={'checked'}
        >
          <Checkbox />
        </Form.Item>
        <Col>{L('Default password is  123qwe')}</Col>
      </Form>
    </Modal>
  )
}

export default CreateOrUpdateTenantModal
