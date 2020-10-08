import * as React from 'react';
import PortalContext from './context';
import PortalProvider from './provider';
import PortalGate from './gate';

const withWrapTeleport = WrappedComponent => props => (
  <PortalContext.Consumer>
    {({ teleport }) => <WrappedComponent teleport={teleport} {...props} /> }
  </PortalContext.Consumer>
);

export {
  PortalContext,
  PortalProvider,
  PortalGate,
  withWrapTeleport
};

export default PortalProvider;
