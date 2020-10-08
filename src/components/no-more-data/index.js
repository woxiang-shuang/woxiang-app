import * as React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { cstyle, theme, px } from '../../styles';

export default function NoMoreData(props) {
  let { msg = '没有更多数据了' } = props;
  return (
    <View style={[styles.container, props.style]}><Text style={styles.msg}>{msg}</Text></View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: px(80),
    alignItems: 'center',
    justifyContent: 'center',
  },
  msg: {
    fontSize: px(26),
    color: theme.text.color8
  }
});
