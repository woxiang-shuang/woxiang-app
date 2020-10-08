import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { cstyle, theme, px } from '../../styles';

export default function CheckBox(props) {
  let { checked } = props;
  function changed() {
    props.change && props.change(!checked);
  }
  let checkStyle = checked ? styles.checked : styles.unchecked;
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={changed} activeOpacity={theme.clickOpacity} style={cstyle.flexDirecR}>
        <View  style={[styles.checkbox, checkStyle]}>{checked && <View style={styles.iconChecked}></View>}</View>
        <Text style={[cstyle.pdLR10, cstyle.fz24]}>{checked ? '取消' : ''}全选</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
  },
  checkbox: {
    width: px(28),
    height: px(28),
    borderRadius: px(4),
  },
  checked: {
    borderWidth: px(2),
    borderColor: theme.border.color2,
    backgroundColor: theme.background.color12
  },
  unchecked: {
    borderWidth: px(2),
    borderColor: theme.border.colorGray4
  },
  iconChecked: {
    width: px(20),
    height: px(10),
    borderLeftWidth: px(2),
    borderBottomWidth: px(2),
    borderColor: theme.border.color7,
    left: px(3),
    top: px(4),
    transform: [
      {rotate: '315deg'}
    ]
  }
});
