import * as React from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View, ImageBackground, ScrollView } from 'react-native';
import { px } from '../../utils/adapter';
import cstyle from '../../styles/common';
import theme from '../../styles/theme';

export default function Chat() {
  return (<View style={styles.container}>
    <View style={[cstyle.flexAiC, { marginTop: px(200) }]}>
      <Image source={require('../../assets/images/other-Done.png')} style={{ width: px(216), height: px(130) }} />
      <Text style={styles.textStyle}>程序员小哥哥正在奋力赶工中...</Text>
    </View>
  </View>);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.screenBgColor,
  },
  textStyle: {
    color: theme.text.color8,
    marginTop: px(20)
  }
});
