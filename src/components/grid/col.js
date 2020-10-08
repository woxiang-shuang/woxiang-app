import React from 'react';
import { StyleSheet, View } from 'react-native';

const PRE_FIX = 'col_';

export default function Col(props) {
  let { span, style = {} } = props;
  return (<View style={[styles[PRE_FIX + span], style]} >{props?.children}</View>);
}

const unum = 100 / 24;

function wp(n) {
  return (unum * n) + '%';
}

const cols = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 16, 18, 20, 22, 24];
const colsStyleObj = {};
cols.forEach(n => {
  colsStyleObj[PRE_FIX + n] = { width: wp(n) };
});

const styles = StyleSheet.create(Object.assign({}, colsStyleObj));
