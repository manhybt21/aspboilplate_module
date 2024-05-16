import { Button, Flex, Result } from 'antd'
import { FC } from 'react'
import { Link, useParams } from 'react-router-dom'
const Exception: FC = () => {
  const exception = [
    {
      errorCode: '404',
      errorDescription: 'Sorry, the page you visited does not exist',
      to: '/',
    },
    {
      errorCode: '403',
      errorDescription: 'Sorry, you dont have access to this page',
      to: '/',
    },
    {
      errorCode: '500',
      errorDescription: 'Sorry, the server is reporting an error',
      to: '/',
    },
  ]
  const { type } = useParams()
  let error = exception.find((x) => x.errorCode === type)

  if (!error) {
    error = exception[0]
  }

  return (
    <Flex justify='center' align='center'>
      <Result
        status={error.errorCode as any}
        title={`Error ${error.errorCode}`}
        subTitle={error.errorDescription}
        extra={
          <Button type='primary'>
            <Link to={error.to as string}>Back to Home</Link>
          </Button>
        }
      ></Result>
    </Flex>
  )
}

export default Exception
