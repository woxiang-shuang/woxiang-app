import * as React from 'react';
import PortalContext from './context';

function PortalGate(props) {
  const { gateName } = props;
  return (
    <PortalContext.Consumer>
      {value => {
        return (
          <React.Fragment>
            {value.gates[gateName]}
          </React.Fragment>
        );
      }}
    </PortalContext.Consumer>
  );
}

export default PortalGate;
