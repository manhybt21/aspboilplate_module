import * as React from 'react'

import { Input, Modal, Tabs, Form, Checkbox } from 'antd'
import { GetAllPermissionsOutput } from '../../../services/role/dto/getAllPermissionsOutput'
import { L } from '../../../lib/abpUtility'
import RoleStore from '../../../stores/roleStore'
import rules from './createOrUpdateRole.validation'
import { FormInstance } from 'antd/lib/form'
import { observer } from 'mobx-react'
import { CheckboxChangeEvent } from 'antd/es/checkbox'

const TabPane = Tabs.TabPane

export interface ICreateOrUpdateRoleProps {
  roleStore: RoleStore
  visible: boolean
  onCancel: () => void
  modalType: string
  onOk: () => void
  permissions: GetAllPermissionsOutput[]
  formRef: React.RefObject<FormInstance>
}

const CreateOrUpdateRoleModal: React.FC<ICreateOrUpdateRoleProps> = ({
  roleStore,
  visible,
  onCancel,
  onOk,
  permissions,
  formRef,
}) => {
  const [filteredPermissions, setFilteredPermissions] = React.useState<GetAllPermissionsOutput[]>(
    []
  )
  const [checkedAll, setCheckedAll] = React.useState(false)
  React.useEffect(() => {
    setFilteredPermissions(permissions)
  }, [permissions])

  const options = filteredPermissions.map((x: GetAllPermissionsOutput) => {
    return { label: x.displayName ?? '', value: x.name ?? '' }
  })

  const handleSearch = (value: string) => {
    const filtered = permissions.filter((x: GetAllPermissionsOutput) =>
      x.displayName?.toLowerCase().includes(value.toLowerCase())
    )
    setFilteredPermissions(filtered)
  }

  const handleCheckAll = (e: CheckboxChangeEvent) => {
    setCheckedAll(e.target.checked)
    const value: string[] = e.target.checked
      ? (permissions.map((x) => x.name) ?? []).filter(
          (name): name is string => typeof name === 'string'
        )
      : []
    formRef.current?.setFieldsValue({
      grantedPermissions: value,
    })
  }

  return (
    <Modal
      open={visible}
      cancelText={L('Cancel')}
      okText={L('OK')}
      onCancel={onCancel}
      title={L('Role')}
      onOk={onOk}
      destroyOnClose={true}
    >
      <Form ref={formRef} layout='vertical'>
        <Tabs defaultActiveKey={'role'} size={'small'} tabBarGutter={64}>
          <TabPane tab={L('RoleDetails')} key={'role'}>
            <Form.Item label={L('RoleName')} name={'name'} rules={rules.name}>
              <Input />
            </Form.Item>
            <Form.Item
              label={L('DisplayName')}
              name={'displayName'}
              rules={rules.displayName}
            >
              <Input />
            </Form.Item>
            <Form.Item label={L('Description')} name={'description'}>
              <Input />
            </Form.Item>
          </TabPane>
          <TabPane tab={L('RolePermission')} key={'permission'} forceRender={true}>
            <div style={{ marginBottom: '12px' }}>
              <Input.Search placeholder={'Search Permissions'} onSearch={handleSearch} />
            </div>
            <div style={{ marginBottom: '12px' }}>
              <Checkbox checked={checkedAll} onChange={handleCheckAll}>
                {'Check All'}
              </Checkbox>
            </div>
            <Form.Item
              name={'grantedPermissions'}
              valuePropName={'value'}
              style={{ maxHeight: 400, overflowY: 'auto' }}
            >
              <Checkbox.Group
                options={options}
                style={{ display: 'flex', flexWrap: 'wrap', flexDirection: 'column' }}
              >
                {options.map((option) => (
                  <Checkbox key={option.value}>{option.label}</Checkbox>
                ))}
              </Checkbox.Group>
            </Form.Item>
          </TabPane>
        </Tabs>
      </Form>
    </Modal>
  )
}

export default observer(CreateOrUpdateRoleModal)
