import * as React from 'react';
import Context from './context';

class Provider extends React.Component {
  state = {
    gates: {}
  }
  teleport = (gateName, element) => {
    this.setState({ gates: { ...this.state.gates, [gateName]: element } });
  }
  render() {
    const { children } = this.props;
    return (
      <Context.Provider value={{ gates: this.state.gates, teleport: this.teleport }}>
        {children}
      </Context.Provider>
    );
  }
}

export default Provider;
