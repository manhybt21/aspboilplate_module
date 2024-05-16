import React, { Suspense } from 'react'
import Loading from './../Loading/index'

const LoadableComponent = (componentLoader: any) => {
  const LazyComponent = React.lazy(componentLoader)

  const Loadable = () => {
    return (
      <Suspense fallback={<Loading />}>
        <LazyComponent />
      </Suspense>
    )
  }

  return Loadable
}

export default LoadableComponent
