import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme, px } from '../../styles';

export default function Badge(props) {
  let { text, overflowCount = 99 } = props;
  function isHide() {
    return typeof text !== 'number' || !text;
  }
  return (<View style={props.style}>
    {!isHide() && <View style={[styles.badge, props.badgeStyle]}>
      <Text style={[styles.badgeTxt, props.badgeTxtStyle]}>{text}{text >= overflowCount ? '+' : ''}</Text>
    </View>}
    <View>{props.children}</View>
  </View>);
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: px(28),
    minWidth: px(28),
    minHeight: px(28),
    position: 'absolute',
    zIndex: 1,
    top: -px(13),
    right: -px(22),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.badge.backgroundColor
  },
  hide: {
    display: 'none'
  },
  badgeTxt: {
    color: theme.badge.textColor,
    fontSize: px(18)
  },
});
