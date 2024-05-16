import React from 'react'
import { Checkbox, Form, Input, Modal, Tabs } from 'antd'
import { GetRoles } from '../../../services/user/dto/getRolesOuput'
import { L } from '../../../lib/abpUtility'
import rules from './createOrUpdateUser.validation'
import { FormInstance } from 'antd/lib/form'

const TabPane = Tabs.TabPane
const { Item: FormItem } = Form

interface ICreateOrEditUserProps {
  visible: boolean
  onCancel: () => void
  modalType: string
  onCreate: () => void
  roles: GetRoles[]
  formRef: React.RefObject<FormInstance>
}

const CreateOrEditUserModal: React.FC<ICreateOrEditUserProps> = ({
  visible,
  onCancel,
  modalType,
  onCreate,
  roles,
  formRef,
}) => {
  const options = roles.map((x: GetRoles) => ({ label: x.displayName, value: x.normalizedName }))

  return (
    <Modal
      open={visible}
      cancelText={L('Cancel')}
      okText={L('OK')}
      onCancel={onCancel}
      onOk={onCreate}
      title={'User'}
    >
      <Form ref={formRef} layout='vertical'>
        <Tabs defaultActiveKey={'userInfo'} size={'small'} tabBarGutter={64}>
          <TabPane tab={'User'} key={'user'}>
            <FormItem label={L('Name')} name={'name'} rules={rules.name}>
              <Input />
            </FormItem>
            <FormItem label={L('Surname')} name={'surname'} rules={rules.surname}>
              <Input />
            </FormItem>
            <FormItem label={L('UserName')} name={'userName'} rules={rules.userName}>
              <Input />
            </FormItem>
            <FormItem label={L('Email')} name={'emailAddress'} rules={rules.emailAddress as []}>
              <Input />
            </FormItem>
            {modalType === 'edit' ? (
              <>
                <FormItem
                  label={L('Password')}
                  name={'password'}
                  rules={[{ required: true, message: 'Please input your password!' }]}
                >
                  <Input type='password' />
                </FormItem>
                <FormItem
                  label={L('ConfirmPassword')}
                  name={'confirm'}
                  rules={[{ required: true, message: L('ConfirmPassword') }]}
                >
                  <Input type='password' />
                </FormItem>
              </>
            ) : null}
            <FormItem label={L('IsActive')} name={'isActive'} valuePropName={'checked'}>
              <Checkbox></Checkbox>
            </FormItem>
          </TabPane>
          <TabPane tab={L('Roles')} key={'roles'}>
            <FormItem name={'roleNames'}>
              <Checkbox.Group options={options}>
                {options.map((item, index) => {
                  return <Checkbox key={index} title={item.label} />
                })}
              </Checkbox.Group>
            </FormItem>
          </TabPane>
        </Tabs>
      </Form>
    </Modal>
  )
}

export default CreateOrEditUserModal
