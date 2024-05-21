import * as React from 'react'
import { Button, Card, Col, Dropdown, Flex, Input, Modal, Row, Table, Tag } from 'antd'
import { inject, observer } from 'mobx-react'
import { EntityDto } from '../../services/dto/entityDto'
import { L } from '../../lib/abpUtility'
import UserStore from '../../stores/userStore'
import { FormInstance } from 'antd/lib/form'
import { PlusOutlined, SettingOutlined } from '@ant-design/icons'
import { GetUserOutput } from '../../services/user/dto/getUserOutput'
import CreateOrEditUserModal from './components/create-or-edit-user.modal'
import Stores from '../../stores/storeIdentifier'
import type { TableProps } from 'antd'

const confirm = Modal.confirm
const Search = Input.Search
export interface IUserProps {
  userStore: UserStore
}
const User: React.FC<IUserProps> = (props) => {
  const { userStore } = props
  const formRef = React.useRef<FormInstance>(null)
  const [visible, setVisible] = React.useState(false)
  const [maxResultCount, setMaxResultCount] = React.useState<number>(10)
  const [skipCount, setSkipCount] = React.useState<number>(1)
  const [userId, setUserId] = React.useState<number | undefined>(0)
  const [filter, setFilter] = React.useState<string>('')
  const [dataSource, setDataSource] = React.useState<GetUserOutput[]>([])
  React.useEffect(() => {
    getAll()
  }, [maxResultCount, skipCount, filter])

  const getAll = async () => {
    await userStore.getAll({
      maxResultCount: maxResultCount,
      skipCount: skipCount - 1,
      keyword: filter,
    })
    setDataSource(userStore.users === undefined ? [] : userStore.users.items)
  }

  const handleTableChange = (pagination: any) => {
    setSkipCount(pagination.current - 1)
    setMaxResultCount(10)
  }

  const createOrUpdateModalOpen = async (entityDto: EntityDto) => {
    if (entityDto.id === 0) {
      await userStore.createUser()
      await userStore.getRoles()
    } else {
      await userStore.get(entityDto)
      await userStore.getRoles()
    }
    setUserId(entityDto.id)
    setVisible(true)

    setTimeout(() => {
      formRef.current?.setFieldsValue({ ...userStore.editUser })
    }, 100)
  }

  const deleteUser = (input: EntityDto) => {
    confirm({
      title: 'Do you Want to delete these items?',
      onOk() {
        userStore.delete(input)
      },
      onCancel() {
        console.log('Cancel')
      },
    })
  }

  const handleCreate = () => {
    const form = formRef.current

    form!.validateFields().then(async (values: any) => {
      if (userId === 0) {
        await userStore.create(values)
      } else {
        await userStore.update({ ...values, id: userId })
      }
      await getAll()
      setVisible(false)
      form!.resetFields()
    })
  }

  const handleSearch = (value: string) => {
    setFilter(value)
  }
  const columns: TableProps<GetUserOutput>['columns'] = [
    {
      title: L('UserName'),
      dataIndex: 'userName',
      key: 'userName',
      width: 150,
      render: (text: string) => <div>{text}</div>,
    },
    {
      title: L('FullName'),
      dataIndex: 'name',
      key: 'name',
      width: 150,
      render: (text: string) => <div>{text}</div>,
    },
    {
      title: L('EmailAddress'),
      dataIndex: 'emailAddress',
      key: 'emailAddress',
      width: 150,
      render: (text: string) => <div>{text}</div>,
    },
    {
      title: L('IsActive'),
      dataIndex: 'isActive',
      key: 'isActive',
      width: 150,
      render: (text: boolean) =>
        text === true ? <Tag color='#2db7f5'>{L('Yes')}</Tag> : <Tag color='red'>{L('No')}</Tag>,
    },
    {
      title: L('Actions'),
      width: 150,
      render: (text: string, item: any) => (
        <div>
          <Dropdown
            trigger={['click']}
            menu={{
              items: [
                {
                  key: L('Edit'),
                  label: L('Edit'),
                  onClick: () => createOrUpdateModalOpen({ id: item.id }),
                },
                {
                  key: L('Delete'),
                  label: L('Delete'),
                  onClick: () => deleteUser({ id: item.id }),
                },
              ],
            }}
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
      <Flex justify='space-between' align='center'>
        <h2>{L('Users')}</h2>
        <Button
          type='primary'
          shape='circle'
          icon={<PlusOutlined />}
          onClick={() => createOrUpdateModalOpen({ id: 0 })}
        />
      </Flex>
      <Row>
        <Col xs={{ span: 24 }} sm={{ span: 10, offset: 0 }}>
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
            rowKey={(record) => record.id.toString()}
            bordered={true}
            columns={columns}
            pagination={{
              pageSize: 10,
              total: userStore.users === undefined ? 0 : userStore.users.totalCount,
              defaultCurrent: 1,
            }}
            loading={dataSource.length === 0 ? true : false}
            dataSource={dataSource}
            onChange={handleTableChange}
          />
        </Col>
      </Row>
      <CreateOrEditUserModal
        formRef={formRef}
        visible={visible}
        onCancel={() => {
          setVisible(false)
          formRef.current?.resetFields()
        }}
        modalType={userId === 0 ? 'edit' : 'create'}
        onCreate={handleCreate}
        roles={userStore.roles}
      />
    </Card>
  )
}

export default inject(Stores.UserStore)(observer(User))
