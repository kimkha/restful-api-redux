import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { demoApi as demoApiAction, userApi as userApiAction, loginApi as loginApiAction } from './actions';
import { convertApiState, isLoginState } from '../src';

class App extends PureComponent {
  componentWillMount() {
    this.props.demoApi('Hello_world');
  }

  handleLogin = () => {
    this.props.loginApi('admin', 'setfil');
  };

  handleApi = () => {
    this.props.userApi();
  };

  render() {
    const { data, isLogin } = this.props;

    return (
      <div>
        {JSON.stringify(data)} <br/>
        {!isLogin && <button onClick={this.handleLogin}>Login</button>}
        <button onClick={this.handleApi}>Recall</button>
      </div>
    );
  }
}

App.propTypes = {};

App.defaultProps = {};

function mapStateToProps(state, props) {
  const res = convertApiState(state, 'users');
  return {
    data: res.response,
    loading: res.isLoading,
    error: res.error,
    isLogin: isLoginState(state),
  };
}

const enhance = compose(
  connect(
    mapStateToProps,
    {
      demoApi: demoApiAction,
      userApi: userApiAction,
      loginApi: loginApiAction,
    },
  )
);

export default enhance(App);
