import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function Row(props) {
  return (
    <View style={[styles.container, props.style || {}]}>{props?.children}</View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row'
  }
});
