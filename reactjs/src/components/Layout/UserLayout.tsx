import './UserLayout.less';

import * as React from 'react';

import { Link, Route, Routes } from 'react-router-dom';

import { Col } from 'antd';
import DocumentTitle from 'react-document-title';
import Footer from '../Footer';
import LanguageSelect from '../LanguageSelect';
import { userRouter } from '../Router/router.config';
import utils from '../../utils/utils';

class UserLayout extends React.Component<any> {
  render() {
    // const {
    //   location: { pathname },
    // } = this.props;

    return (
      <DocumentTitle title={utils.getPageTitle('jajjaj')}>
        <Col className="container">
          <div style={{ height: 'calc(100vh - 55px)' }}>
            <div className={'lang'}>
              <LanguageSelect />
            </div>
            <Routes>
              {userRouter
                .filter((item: any) => !item.isLayout)
                .map((item: any, index: number) => (
                  <Route key={index} path={item.path} Component={item.component} />
                ))}

              <Link to="/user/login" />
            </Routes>
          </div>
          <Footer />
        </Col>
      </DocumentTitle>
    );
  }
}

export default UserLayout;
