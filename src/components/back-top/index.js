import * as React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import cstyle from '../../styles/common';
import theme from '../../styles/theme';
import { px } from '../../utils/adapter';


/**
 * 回到顶部
 * @param props 
 */
export default function BackTop(props) {
  let { show = true, onPress = () => {}, style = {} } = props;
  let elements = show && (
    <View style={[styles.container, style ? style : {}]} >
      <TouchableOpacity activeOpacity={theme.clickOpacity} onPress={onPress} style={cstyle.flex1}>
        <View style={styles.arrowUp}></View>
      </TouchableOpacity>
    </View>
  );
  return elements;
}

const styles = StyleSheet.create({
  container: {
    width: px(62),
    height: px(62),
    backgroundColor: theme.background.color13,
    borderRadius: px(32),
    opacity: 0.75,
    position: 'absolute',
    right: px(20),
    bottom: px(40)
  },
  arrowUp: {
    width: px(22),
    height: px(22),
    borderLeftWidth: px(2),
    borderTopWidth: px(2),
    borderColor: theme.border.color7,
    transform: [
      {rotate: '45deg'}
    ],
    marginTop: px(24),
    marginLeft: px(20),
  }
});
