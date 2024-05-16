import React, { useState, useRef, useEffect, FC } from 'react'
import {
  Button,
  Card,
  Col,
  Dropdown,
  Input,
  Menu,
  Modal,
  Row,
  Table,
  TableColumnsType,
  TablePaginationConfig,
} from 'antd'
import { inject, observer } from 'mobx-react'
import CreateOrUpdateRoleModal from './components/createOrUpdateRole'
import { EntityDto } from '../../services/dto/entityDto'
import { L } from '../../lib/abpUtility'
import RoleStore from '../../stores/roleStore'
import { PlusOutlined, SettingOutlined } from '@ant-design/icons'
import { FormInstance } from 'antd/lib/form'
import { GetAllRoleOutput } from '../../services/role/dto/getAllRoleOutput'
import Stores from '../../stores/storeIdentifier'
export interface IRoleProps {
  roleStore: RoleStore
}
const confirm = Modal.confirm
const Search = Input.Search

const Role: FC<IRoleProps> = (props) => {
  const [modalVisible, setModalVisible] = useState(false)
  const [roleId, setRoleId] = useState(0)
  const [filter, setFilter] = useState<string>('')
  const [skipCount, setSkipCount] = useState(1)
  const [maxResultCount, setMaxResultCount] = React.useState<number>(10)
  const [dataSource, setDataSource] = useState<GetAllRoleOutput[]>([])
  const formRef = useRef<FormInstance>(null)
  const { roleStore } = props
  useEffect(() => {
    getAll()
  }, [maxResultCount, skipCount, filter])

  const getAll = async () => {
    await roleStore.getAll({
      maxResultCount: maxResultCount,
      skipCount: skipCount - 1,
      keyword: filter,
    })
    setDataSource(roleStore.roles === undefined ? [] : roleStore.roles.items)
  }

  const handleTableChange = (pagination: TablePaginationConfig) => {
    const skipCount = pagination.current ?? 1 - 1
    setSkipCount(skipCount)
    setMaxResultCount(10)
  }

  const createOrUpdateModalOpen = async (entityDto: EntityDto) => {
    if (entityDto.id === 0) {
      await roleStore.getAllPermissions()
      roleStore.createRole()
    } else {
      await roleStore.getAllPermissions()
      await roleStore.getRoleForEdit(entityDto)
    }

    setRoleId(entityDto.id)
    setModalVisible(true)

    setTimeout(() => {
      formRef.current?.setFieldsValue({
        ...roleStore.roleEdit.role,
        grantedPermissions: roleStore.roleEdit.grantedPermissionNames,
      })
    }, 100)
  }

  const deleteRole = (input: EntityDto) => {
    confirm({
      title: 'Do you Want to delete these items?',
      onOk() {
        roleStore.delete(input)
      },
      onCancel() {},
    })
  }

  const handleCreate = () => {
    const form = formRef.current
    form!.validateFields().then(async (values) => {
      if (roleId === 0) {
        await roleStore.create(values)
      } else {
        await roleStore.update({ id: roleId, ...values })
      }

      await getAll()
      setModalVisible(false)
      form!.resetFields()
    })
  }

  const handleSearch = (value: string) => {
    setFilter(value)
    getAll()
  }
  const columns: TableColumnsType<GetAllRoleOutput> = [
    {
      title: L('RoleName'),
      dataIndex: 'name',
      key: 'name',
      width: 150,
      render: (text) => <div>{text}</div>,
    },
    {
      title: L('DisplayName'),
      dataIndex: 'displayName',
      key: 'displayName',
      width: 150,
      render: (text) => <div>{text}</div>,
    },
    {
      title: L('Actions'),
      width: 150,
      render: (text, item) => (
        <div>
          <Dropdown
            trigger={['click']}
            overlay={
              <Menu>
                <Menu.Item onClick={() => createOrUpdateModalOpen({ id: item.id })}>
                  {L('Edit')}
                </Menu.Item>
                <Menu.Item onClick={() => deleteRole({ id: item.id })}>{L('Delete')}</Menu.Item>
              </Menu>
            }
            placement='bottomLeft'
          >
            <Button type='primary' icon={<SettingOutlined />}>
              {L('Actions')}
            </Button>
          </Dropdown>
        </div>
      ),
    },
  ]

  return (
    <Card>
      <Row>
        <Col
          xs={{ span: 4, offset: 0 }}
          sm={{ span: 4, offset: 0 }}
          md={{ span: 4, offset: 0 }}
          lg={{ span: 2, offset: 0 }}
          xl={{ span: 2, offset: 0 }}
          xxl={{ span: 2, offset: 0 }}
        >
          <h2>{L('Roles')}</h2>
        </Col>
        <Col
          xs={{ span: 14, offset: 0 }}
          sm={{ span: 15, offset: 0 }}
          md={{ span: 15, offset: 0 }}
          lg={{ span: 1, offset: 21 }}
          xl={{ span: 1, offset: 21 }}
          xxl={{ span: 1, offset: 21 }}
        >
          <Button
            type='primary'
            shape='circle'
            icon={<PlusOutlined />}
            onClick={() => createOrUpdateModalOpen({ id: 0 })}
          />
        </Col>
      </Row>
      <Row>
        <Col sm={{ span: 10, offset: 0 }}>
          <Search placeholder={L('Filter')} onSearch={handleSearch} />
        </Col>
      </Row>
      <Row style={{ marginTop: 20 }}>
        <Col
          xs={{ span: 24, offset: 0 }}
          sm={{ span: 24, offset: 0 }}
          md={{ span: 24, offset: 0 }}
          lg={{ span: 24, offset: 0 }}
          xl={{ span: 24, offset: 0 }}
          xxl={{ span: 24, offset: 0 }}
        >
          <Table
            rowKey='id'
            bordered={true}
            pagination={{
              pageSize: 10,
              total: roleStore.roles !== undefined ? roleStore.roles.totalCount : 0,
              defaultCurrent: 1,
            }}
            columns={columns}
            loading={dataSource.length === 0 ? true : false}
            dataSource={dataSource}
            onChange={handleTableChange}
          />
        </Col>
      </Row>

      <CreateOrUpdateRoleModal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        modalType={roleId === 0 ? 'edit' : 'create'}
        onOk={handleCreate}
        permissions={roleStore.allPermissions}
        roleStore={roleStore}
        formRef={formRef}
      />
    </Card>
  )
}

export default inject(Stores.RoleStore)(observer(Role))
