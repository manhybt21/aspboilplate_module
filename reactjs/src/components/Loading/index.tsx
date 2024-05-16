import { Flex, Spin } from 'antd'

const Loading = () => {
  return (
    <Flex style={{ height: '100%' }} align='center' justify='center'>
      <Spin tip='Loading' size='large'>
        <div className='content' />
      </Spin>
    </Flex>
  )
}

export default Loading
