import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { demoApi as demoApiAction } from './actions';
import { convertApiState } from '../src';

class App extends PureComponent {
  componentWillMount() {
    this.props.demoApi('Hello_world');
  }

  render() {
    const { data } = this.props;

    return (
      <div>
        {JSON.stringify(data)}
      </div>
    );
  }
}

App.propTypes = {};

App.defaultProps = {};

function mapStateToProps(state, props) {
  const res = convertApiState(state, 'pages');
  return {
    data: res.response,
    loading: res.isLoading,
    error: res.error,
  };
}

const enhance = compose(
  connect(
    mapStateToProps,
    {
      demoApi: demoApiAction,
    },
  )
);

export default enhance(App);
