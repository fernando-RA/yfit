import React from 'react';
import Fallback from './Fallback';

export default class ErrorBoundary extends React.Component {
  state = {hasError: false};

  static getDerivedStateFromError(error) {
    return {hasError: true};
  }

  render() {
    return this.state.hasError ? <Fallback /> : this.props.children;
  }
}
