import * as React from 'react';
import { GameTypes } from '../../utils/constant';
import CheckedNav from '../../components/checked-nav';

const navBarTabsConfig = [
  {name: GameTypes.FOOTBALL, title: '足球', active: true},
  {name: GameTypes.BASTKETBALL, title: '篮球', active: false},
];

export default function CompetetionHeader(props) {
  return (
    <CheckedNav {...props} navBarTabsConfig={navBarTabsConfig} />
  );
}
