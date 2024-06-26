import React, { useState, useRef, useEffect, FC } from 'react'
import {
  Button,
  Card,
  Col,
  Dropdown,
  Input,
  Row,
  Table,
  Tag,
  Modal,
  TableColumnsType,
  TablePaginationConfig,
  Flex,
} from 'antd'
import { inject, observer } from 'mobx-react'
import CreateOrUpdateTenant from './components/createOrUpdateTenant'
import { L } from '../../lib/abpUtility'
import Stores from '../../stores/storeIdentifier'
import { PlusOutlined, SettingOutlined } from '@ant-design/icons'
import { EntityDto } from '../../services/dto/entityDto'
import { FormInstance } from 'antd/lib'
import { GetAllTenantOutput } from '../../services/tenant/dto/getAllTenantOutput'
import TenantStore from '../../stores/tenantStore'
export interface ITenantProps {
  tenantStore: TenantStore
}
const confirm = Modal.confirm
const { Search } = Input

const Tenant: FC<ITenantProps> = (props) => {
  const { tenantStore } = props
  const [modalVisible, setModalVisible] = useState(false)
  const [tenantId, setTenantId] = useState(0)
  const [filter, setFilter] = useState('')
  const [skipCount, setSkipCount] = useState(1)
  const [maxResultCount, setMaxResultCount] = React.useState<number>(10)
  const formRef = useRef<FormInstance>(null)
  const [dataSource, setDataSource] = useState<GetAllTenantOutput[]>([])
  useEffect(() => {
    getAll()
  }, [skipCount, filter, maxResultCount])

  const getAll = async () => {
    await tenantStore.getAll({
      maxResultCount: maxResultCount,
      skipCount: skipCount - 1,
      keyword: filter,
    })
    setDataSource(tenantStore.tenants === undefined ? [] : tenantStore.tenants.items)
  }

  const handleTableChange = async (pagination: TablePaginationConfig) => {
    const skipCount = pagination?.current ?? 1 - 1
    setSkipCount(skipCount)
    setMaxResultCount(10)
  }

  const createOrUpdateModalOpen = async (entityDto: EntityDto) => {
    if (entityDto.id === 0) {
      tenantStore.createTenant()
    } else {
      await tenantStore.get(entityDto)
    }

    setTenantId(entityDto.id)
    setModalVisible(true)

    setTimeout(() => {
      if (entityDto.id !== 0) {
        formRef.current?.setFieldsValue({
          ...tenantStore.tenantModel,
        })
      } else {
        formRef.current?.resetFields()
      }
    }, 100)
  }

  const deleteTenant = (input: EntityDto) => {
    confirm({
      title: 'Do you Want to delete these items?',
      onOk() {
        tenantStore.delete(input)
      },
      onCancel() {},
    })
  }

  const handleCreate = async () => {
    formRef.current?.validateFields().then(async (values) => {
      if (tenantId === 0) {
        await tenantStore.create(values)
      } else {
        await tenantStore.update({ id: tenantId, ...values })
      }

      await getAll()
      setModalVisible(false)
      formRef.current?.resetFields()
    })
  }

  const handleSearch = (value: string) => {
    setFilter(value)
    getAll()
  }

  const { tenants } = tenantStore

  const columns: TableColumnsType<GetAllTenantOutput> = [
    {
      title: L('TenancyName'),
      dataIndex: 'tenancyName',
      key: 'tenancyName',
      width: 150,
      render: (text) => <div>{text}</div>,
    },
    {
      title: L('Name'),
      dataIndex: 'name',
      key: 'name',
      width: 150,
      render: (text) => <div>{text}</div>,
    },
    {
      title: L('IsActive'),
      dataIndex: 'isActive',
      key: 'isActive',
      width: 150,
      render: (text) =>
        text === true ? <Tag color='#2db7f5'>{L('Yes')}</Tag> : <Tag color='red'>{L('No')}</Tag>,
    },
    {
      title: L('Actions'),
      width: 150,
      render: (text, item) => (
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
                  onClick: () => deleteTenant({ id: item.id }),
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
        <h2>{L('Tenants')}</h2>
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
            rowKey='id'
            bordered={true}
            pagination={{
              pageSize: 10,
              total: tenants ? tenants.totalCount : 0,
              defaultCurrent: 1,
            }}
            columns={columns}
            loading={dataSource.length === 0 ? true : false}
            dataSource={dataSource}
            onChange={handleTableChange}
          />
        </Col>
      </Row>
      <CreateOrUpdateTenant
        formRef={formRef}
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        modalType={tenantId === 0 ? 'edit' : 'create'}
        onCreate={handleCreate}
      />
    </Card>
  )
}

export default inject(Stores.TenantStore)(observer(Tenant))
