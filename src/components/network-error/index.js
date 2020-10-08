// 包含刷新按钮组件
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Button } from '@ant-design/react-native';
import { cstyle, theme, px } from '../../styles';

export default function NetWorkError(props) {
  let { content = '当前网络信号较差 请稍候刷新试试', style } = props;
  function refresh() {
    props.onPress && props.onPress();
  }
  return (<View style={[styles.container, style]}>
    <View style={cstyle.flexAiC}>
      <Image source={require('../../assets/images/other-Receiver.png')} style={styles.icon} />
    </View>
    <View style={cstyle.flexAiC}><Text style={[styles.content, props.contentStyle]}>{content}</Text></View>
    <View style={[cstyle.flexDirecR, cstyle.flexJcC]}>
      <Button type="primary" size="small" activeStyle={styles.activeStyle} onPress={refresh} style={styles.refresh}><Text>刷新</Text></Button>
    </View>
  </View>);
}

const styles = StyleSheet.create({
  container: {
    borderRadius: px(6),
    minHeight: px(600),
    alignItems: 'center',
    justifyContent: 'center'
    // backgroundColor: theme.background.colorWhite
  },
  icon: {
    width: px(190),
    height: px(104)
  },
  content: {
    color: theme.text.color8,
    marginTop: px(20)
  },
  refresh: {
    width: px(170),
    height: px(60),
    marginTop: px(30),
    backgroundColor: theme.button.bgColor,
    borderWidth: 0
  },
  activeStyle: {
    color: theme.text.colorWhite,
    backgroundColor: theme.button.bgColor,
    borderWidth: 0
  }
});
