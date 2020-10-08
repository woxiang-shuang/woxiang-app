// 包含刷新按钮组件
import React from 'react';
import { Image, StyleSheet, Text, View, Platform, Linking, NativeModules } from 'react-native';
import { Button } from '@ant-design/react-native';
import { cstyle, theme, px } from '../../styles';

class NoInternet extends React.PureComponent {
  _onPress = () => {
    const {onPress} = this.props;
    if (typeof onPress === 'function') {
      onPress();
    } else {
      if (Platform.OS === 'ios') {
        Linking.openURL('app-settings:')
          .catch(err => console.log('error', err));
      } else if (Platform.OS === 'android') {
        NativeModules.OpenSettings.openNetworkSettings(data => {
          console.log('call back data', data);
        });
      }
    }
  };

  render() {
    let {content = '无网络链接 请检查您的网络设置', style, contentStyle} = this.props;
    return (<View style={[styles.container, style]}>
      <View style={cstyle.flexAiC}>
        <Image source={require('../../assets/images/other-Receiver.png')} style={styles.icon} />
      </View>
      <View style={cstyle.flexAiC}><Text style={[styles.content, contentStyle]}>{content}</Text></View>
      <View style={[cstyle.flexDirecR, cstyle.flexJcC]}>
        <Button type="primary" size="small" activeStyle={styles.activeStyle} onPress={this._onPress} style={styles.refresh}><Text>去检查</Text></Button>
      </View>
    </View>);
  }
}

export default NoInternet;

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
