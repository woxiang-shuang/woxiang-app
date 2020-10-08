import * as React from 'react';
import { GameTypes } from '../../utils/constant';
import CheckedNav from '../../components/checked-nav';

const navBarTabsConfig = [
  {name: GameTypes.FOOTBALL, title: '足球', active: true,type:1},
  {name: GameTypes.BASTKETBALL, title: '篮球', active: false,type:2},
];

export default function CompetetionHeader(props) {
  return (
    <CheckedNav {...props} navBarTabsConfig={navBarTabsConfig} />
  );
}
