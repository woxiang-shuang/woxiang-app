import React from 'react';
import { View } from 'react-native';
import Football from './Football';
import Basketball from './Basketball';
import { GameTypes } from '../../utils/constant';

export { Football, Basketball };

export default function CompetitionListItem(props) {
  switch (props.listType) {
  case GameTypes.FOOTBALL:
    return <Football {...props}>{props.children}</Football>;
  case GameTypes.BASTKETBALL:
    return <Basketball {...props}>{props.children}</Basketball>;
  default:
    return <View></View>;
  }
}
