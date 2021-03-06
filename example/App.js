import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import {
  demoApi as demoApiAction,
  queryClient as queryClientAction,
  userApi as userApiAction,
  loginApi as loginApiAction,
  profileApi as profileApiAction,
  queryCountry as queryCountryAction,
} from './actions';
import { convertApiState, convertAuthenState, convertRestListState } from '../src';

class App extends PureComponent {
  componentWillMount() {
    this.props.demoApi('Hello_world');
  }

  handleLogin = () => {
    this.props.loginApi('admin', 'Abc123!');
  };

  handleProfile = () => {
    this.props.profileApi();
  };

  handleApi = () => {
    this.props.userApi();
  };

  handleClients = () => {
    this.props.queryClient();
    this.props.queryCountry();
  };

  render() {
    const { data, clients, authen } = this.props;

    const isLogin = authen && authen.status === 'LOGGED_IN';

    return (
      <div>
        {JSON.stringify(data)} <br />
        {JSON.stringify(clients)} <br />
        {!isLogin && <button onClick={this.handleLogin}>Login</button>}
        <button onClick={this.handleProfile}>Profile</button>
        <button onClick={this.handleApi}>Recall</button>
        <button onClick={this.handleClients}>Fetch clients</button>
      </div>
    );
  }
}

App.propTypes = {};

App.defaultProps = {};

function mapStateToProps(state, props) {
  const res = convertApiState(state, 'users');
  const clients = convertRestListState(state, 'clients');
  const authen = convertAuthenState(state);
  return {
    data: res.response,
    loading: res.isLoading,
    error: res.error,
    authen,
    clients,
  };
}

const enhance = compose(
  connect(
    mapStateToProps,
    {
      demoApi: demoApiAction,
      queryClient: queryClientAction,
      userApi: userApiAction,
      loginApi: loginApiAction,
      profileApi: profileApiAction,
      queryCountry: queryCountryAction,
    },
  )
);

export default enhance(App);
