import * as React from 'react';
import { View } from 'react-native';
import Football from './Football';
import { GameTypes } from '../../utils/constant';

export default function Reminder(props) {
  let Component = <View></View>;
  switch(props.type) {
  case GameTypes.FOOTBALL:
    return <Football {...props}>{props?.children}</Football>;
  case GameTypes.BASTKETBALL:
    // Component = <Basketball {...props}>{props.children}</Basketball>;
    return Component;
  default:
    return Component;
  }
}
