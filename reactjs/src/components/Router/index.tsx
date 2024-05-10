import * as React from 'react';

import { Route, Routes } from 'react-router-dom';

// import ProtectedRoute from './ProtectedRoute';
// import utils from '../../utils/utils';
import Login from '../../scenes/Login';
import UserLayout from '../Layout/UserLayout';

const Router = () => {
  // const UserLayout = utils.getRoute('/user').component;
  // const AppLayout = utils.getRoute('/').component;

  return (
    <Routes>
      <Route path="/user" Component={UserLayout}>
        <Route path="/user/login" Component={Login}></Route>
      </Route>
      {/* //<ProtectedRoute path="/" render={(props: any) => <AppLayout {...props} exact />} /> */}
    </Routes>
  );
};

export default Router;
