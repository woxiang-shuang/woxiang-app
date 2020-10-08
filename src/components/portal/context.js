import * as React from 'react';

let PortalContext = React.createContext({
  gates: {},
  teleport: (gateName, element) => {
    return ;
  }
});

export default PortalContext;
