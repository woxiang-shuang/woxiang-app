import React, { Component } from 'react';
import { Tabs, Toast } from '@ant-design/react-native';
import cstyle from '../../styles/common';
import theme from '../../styles/theme';
import AppActions from '../../store/actions';
import { connect } from 'react-redux';
import DeviceInfo from 'react-native-device-info';
import {
  StyleSheet,// 样式对象
  View,
  Text,// 文本文件
  TextInput,
  ImageBackground,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  DeviceEventEmitter,
  AppState,

} from 'react-native';
import { px } from '../../utils/adapter';
import { loginApi, getinit, sendCodeApi, loginCodeApi } from '../../http/APIs';
import { enptyFn } from '../../utils/common';

const mapState = (state) => ({
  state
});

const mapDispatch = {
  updateFooterTabBar: AppActions.updateFooterTabBar,
  updateLogin: AppActions.updateLogin
};
function showToast(text) {
  Toast.info(text, 1, enptyFn, false);
}
function loadingToast() {
  Toast.loading('登录中...', 1, () => {
  }, false);
}
function fomatFloat(src, pos) {
  return Math.round(src * Math.pow(10, pos)) / Math.pow(10, pos);
}
let timerR;

class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isActive: false,
      isActiveLine: false,
      passShow: false,
      mobile: '',// 手机号
      pass: '',// 密码
      code: '',// 验证码
      codeActive: false,
      btnCode: false,
      btnMobile: false,
      isPass: false,// 哪种方式登录
      isTimer: false,// 是不是倒计时
      second: 60,
      timerTitle: '获取验证码',
      page: 0,
      initPage: 0,
      navs: [
        { title: '手机登录' },
        { title: '账号登录' },
      ],
      showTabs: true,
      appState: AppState.currentState,//

    };
    this.backgroundTime = 0;
    this.count = false;
    const { changeLogin } = props;
    this.listener = null;
  }
  componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChange);
    this.listener = DeviceEventEmitter.addListener('state', (message) => {
      if (message.mobile != undefined && message.pass != undefined) {
        this.updateState('mobile', message.mobile);
        this.updateState('pass', message.pass);
        this.updateState('passShow', true);// 密码明文状态
        this.updateState('btnMobile', true);// 登录按钮启动状态条件1
        this.updateState('isPass', true);// 登录按钮启动状态条件2
        this.updateState('page', 1);// 跳转到账号登录
      }
    });
    if (this.props.navigation.isFocused()) {
      this.focusSubscription = this.props.navigation.addListener('focus', () => {
        this.setState({ showTabs: true });
        this.props.updateFooterTabBar({ show: false });
      });
      this.blurSubscription = this.props.navigation.addListener('blur', () => {
        this.props.updateFooterTabBar({ show: true });
        this.setState({ showTabs: false });
      });
    }
  }
  // 监听是否在app应用内
  handleAppStateChange = (nextAppState) => {
    if (this.state.appState === 'active' && nextAppState.match(/inactive|background/)) {
      this.backgroundTime = new Date().getTime() / 1000;
      // console.log(this.state.appState, nextAppState, this.backgroundTime);
    }
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      if(this.state.second == 60) {
        this.backgroundTime = 0;
      }else{
        this.backgroundTime = fomatFloat(new Date().getTime() / 1000 - this.backgroundTime, 0);
      }
      // console.log('应用已经来到前台');
      // console.log(this.state.appState, nextAppState, this.backgroundTime);
    }
    this.setState({ appState: nextAppState });
  }
  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
    DeviceEventEmitter.removeSubscription(this.listener);
    clearInterval(timerR);
    //  this.focusSubscription.remove();
    //  this.blurSubscription.remove();
  }
  updateState(key, val) {
    let state = this.state;
    state[key] = val;
    this.setState(state);
  }
  // 输入框下划线激活
  updataLine() {
    this.setState({
      isActiveLine: true
    });
  }
  closeLine() {
    this.setState({
      isActiveLine: false
    });
  }
  // 密码显示处理
  passHandle() {
    if (this.state.passShow) {
      this.updateState('passShow', false);
    } else {
      this.updateState('passShow', true);
    }
  }
  // 验证手机号(
  updateMobile(text) {
    this.updateState('mobile', text);
    //  let phoneRe = /^1(3|4|5|6|7|8|9)\d{9}$/;
    if (this.state.mobile.length == 11) {
      this.updateState('codeActive', true);// 验证码登录控制验证码
      this.updateState('btnMobile', true);// 密码登录控制登录按钮
    } else {
      this.updateState('codeActive', false);
      this.updateState('btnMobile', false);
    }
  }
  // 验证 验证码(验证码登录)
  updateCode(text) {
    this.updateState('code', text);
    //  let codeRe = /^\d{6}$/
    if (text.length == 6) {
      this.updateState('btnCode', true);
    } else {
      this.updateState('btnCode', false);
    }
  }
  // 密码值绑定
  updateText(text) {
    //  let rule = new RegExp(/^[A-Za-z0-9]{6,12}$/)
    this.updateState('pass', text);
    if (text.length >= 6 && text.length <= 12) {
      this.updateState('isPass', true);
    } else {
      this.updateState('isPass', false);
    }
  }
  getDown() {
    return this.state.second;
  }
  // 获取验证码
  getCode() {
    console.log(timerR, this.count);
    if (this.count) {
      return false;
    }
    let query = {
      phone: this.state.mobile,
      type: 2
    };
    if (!this.state.codeActive) {
      this.count = false;
    } else {
      this.count = true;
    }
    if (this.state.codeActive) {
      timerR && clearInterval(timerR);
      getinit([sendCodeApi, query]).then(res => {
        if (res.statusCode == '000') {
          showToast('已发送');
          timerR = setInterval(
            () => {
              if (this.state.second == 0) {
                clearInterval(timerR);
                this.count = false;
                console.log(timerR, '定时器是否存在');
                this.updateState('isTimer', false);
                if (this.state.mobile.length == 11) {
                  this.updateState('codeActive', true);
                }
                this.updateState('second', 60);
              } else {
                // 退出app应用时定时器的操作
                if (this.backgroundTime > 0 && this.backgroundTime < this.getDown()) {
                  this.updateState('second', this.state.second - this.backgroundTime);
                  this.backgroundTime = 0;
                }
                this.updateState('isTimer', true);
                this.updateState('codeActive', false);
                let time = this.state.second;
                this.setState({
                  second: time - 1
                });
              }
            },
            1000
          );
        } else {
          this.count = false;
          showToast(res.message);
        }
      },
      err => {
        this.count = false;
        showToast('网络异常，请稍后再试');
      }
      );
    }
  }
  clearData() {
    this.updateState('mobile', '');
    this.updateState('codeActive', false);
    this.updateState('code', '');
    this.updateState('pass', '');
  }
  // 登录
  handleLogin(api, params) {
    getinit([api, params]).then(res => {
      if (res.statusCode == '000') {
        showToast(res.message);    
        this.props.updateLogin(res);// REUDX
        if (this.props.route?.params?.params?.from === 'my') {
          this.props.navigation.navigate('My');
        }
        this.clearData();
        this.props.updateFooterTabBar({ show: true });
        this.props.navigation.navigate('Competition');
      } else {
        showToast(res.message);
      }
    },
    err => {
      // console.log("连接粗偶",err)
      showToast('网络异常，请稍后再试');
    }
    );
  }
  // 账号密码登录
  doLoginBypass() {
    let query = {
      phone: this.state.mobile,
      password: this.state.pass,
      deviceId: DeviceInfo.getUniqueId()
    };
    if (this.state.btnMobile && this.state.isPass) {
      this.handleLogin(loginApi, query);
    }
  }
  // 短信验证码登录
  doLogin() {
    let query = {
      phone: this.state.mobile,
      code: this.state.code,
      deviceId: DeviceInfo.getUniqueId()
    };
    if (this.state.btnMobile && this.state.btnCode) {
      this.handleLogin(loginCodeApi, query);
    }
  }
  doReg() {
    this.props.navigation.navigate('Register');
  }
  findAccount() {
    this.props.navigation.navigate('FindPassPhoneNumber');
  }
  goback() {
    this.props.navigation.goBack();
  }
  render() {
    const style = {
      alignItems: 'center',
      justifyContent: 'center',
      height: px(600),
    };
    return (
      <ImageBackground style={cstyle.flex1, styles.loginBc} source={require('../../assets/images/bg.png')}>
        <View style={[styles.loginPage, cstyle.flexDirecC, cstyle.flexJcF, cstyle.flex1]}>
          <TouchableOpacity onPress={() => { this.goback(); }}>
            <View style={[styles.header, cstyle.flexDirecR, cstyle.flexJcF, cstyle.flexAiC]}>
              <Image source={require('../../assets/images/left-arrow.png')} style={styles.headerIcon}></Image>
              <Text style={styles.headerT}>登录</Text>
            </View>
          </TouchableOpacity>
          <Image source={require('../../assets/images/LOGO2.png')} style={styles.loginLogo}></Image>
          {this.state.showTabs &&
            <Tabs tabs={this.state.navs}
              tabBarActiveTextColor='#3B7CEC'
              initialPage={this.state.page}
              page={this.state.page}
              animated={true}
              tabBarInactiveTextColor='#3D4C63'
              tabBarUnderlineStyle={styles.linea}
              tabBarBackgroundColor='transparent'
            //  onChange={this.tabHandler}
            //  onTabClick={() => {this.clearData()}}
            >
              <View style={style}>
                <View style={styles.regLine}>
                  <Image source={require('../../assets/images/login-phone.png')} style={styles.regIcon}></Image>
                  <TextInput placeholder='请输入11位手机号码' style={styles.regText}
                    keyboardType={'numeric'}
                    autoCapitalize={'none'}
                    maxLength={11}
                    onChangeText={(text) => { this.updateMobile(text); }}
                    onFocus={() => { this.updataLine(); }}
                    onBlur={() => { this.closeLine(); }}
                    defaultValue={this.state.mobile}
                  />
                </View>
                <Text style={[styles.line, this.state.isActiveLine ? styles.lineactive : '']} >
                </Text>
                <View style={styles.regLine}>
                  <Image source={require('../../assets/images/login-key.png')} style={styles.regIcon1}></Image>
                  <TextInput placeholder='请输入6位验证码' style={styles.regText}
                    keyboardType={'numeric'}
                    autoCapitalize={'none'}
                    maxLength={6}
                    onChangeText={(text) => { this.updateCode(text); }}
                    defaultValue={this.state.code}
                  />
                  <TouchableOpacity style={[styles.code, this.state.codeActive && !this.state.isTimer ? styles.codeActive : '']} onPress={() => { this.getCode(); }}>
                    <Text style={[styles.codeText, this.state.codeActive && !this.state.isTimer ? styles.codeActive : '']}>
                      {this.state.isTimer ? '重发' + this.state.second + 's' : this.state.timerTitle}
                    </Text>
                  </TouchableOpacity>

                </View>
                <Text style={styles.line}></Text>
                <View style={[styles.wrap, cstyle.flexDirecR, cstyle.flexJcC]}>
                  <TouchableOpacity onPress={() => this.doLogin()} style={[styles.btn, this.state.btnMobile && this.state.btnCode ? styles.loginInputB : styles.loginInputD, styles.mgt45]}>
                    <Text
                      style={styles.loginInput}
                    >登录</Text>
                  </TouchableOpacity>
                </View>
                <View style={[styles.wrap, cstyle.flexDirecR, cstyle.flexJcC]}>
                  <TouchableOpacity onPress={() => { this.doReg(); }} style={[styles.btn, styles.loginInputC, styles.mgt45]}>
                    <Text style={styles.loginInput}>注册</Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={() => { this.findAccount(); }}>
                  <Text style={[styles.subButtonText, cstyle.flexDirecR, cstyle.flexJcC]}>找回密码</Text>
                </TouchableOpacity>
              </View>
              {/* 账号登录 */}
              <View style={style}>
                <View style={styles.regLine}>
                  <Image source={require('../../assets/images/login-phone.png')} style={styles.regIcon}></Image>
                  <TextInput placeholder='请输入11位手机号码' style={styles.regText}
                    keyboardType={'numeric'}
                    autoCapitalize={'none'}
                    maxLength={11}
                    defaultValue={this.state.mobile}
                    onFocus={() => { this.updataLine(); }}
                    onBlur={() => { this.closeLine(); }}
                    onChangeText={(text) => this.updateMobile(text)} />
                </View>
                <Text style={[styles.line, this.state.isActiveLine ? styles.lineactive : '']} sss></Text>
                <View style={styles.regLine}>
                  <Image source={require('../../assets/images/login-password.png')} style={styles.iconPass}></Image>
                  <TextInput placeholder='请输入密码(6-12位字母和数字组成)' style={styles.regText}
                    secureTextEntry={this.state.passShow ? false : true}
                    keyboardType={'default'}
                    enablesReturnKeyAutomatically={true}
                    autoCapitalize={'none'}
                    maxLength={12}
                    onChangeText={(text) => this.updateText(text)}
                    defaultValue={this.state.pass}
                  //  onEndEditing={() => { this.checkText(this.state.pass) }}
                  />
                  <TouchableOpacity onPress={() => this.passHandle()} style={styles.hotArea} >
                    <Image source={this.state.passShow ? require('../../assets/images/login-Eye.png') : require('../../assets/images/login-Eye-closed.png')}
                      style={[styles.regIcon2, this.state.passShow ? styles.eyeOpen : '']}></Image>
                  </TouchableOpacity >
                </View>
                <Text style={styles.line}></Text>
                <View style={[styles.wrap, cstyle.flexDirecR, cstyle.flexJcC]}>
                  <TouchableOpacity onPress={() => this.doLoginBypass()} style={[styles.btn, this.state.btnMobile && this.state.isPass ? styles.loginInputB : styles.loginInputD, styles.mgt45]}>
                    <Text
                      style={styles.loginInput}
                    >登录</Text>
                  </TouchableOpacity>
                </View>
                <View style={[styles.wrap, cstyle.flexDirecR, cstyle.flexJcC]}>
                  <TouchableOpacity onPress={() => { this.doReg(); }} style={[styles.btn, styles.loginInputC, styles.mgt45]}>
                    <Text style={styles.loginInput}>注册</Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={() => { this.findAccount(); }}>
                  <Text style={[styles.subButtonText, cstyle.flexDirecR, cstyle.flexJcC]}>找回密码</Text>
                </TouchableOpacity>
              </View>
            </Tabs>
          }
        </View>
      </ImageBackground>
    );
  }
}
const styles = StyleSheet.create({
  loginPage: {
    //  borderStyle: 'solid',
    //  borderWidth: 1,
  },
  loginBc: {
    width: '100%', height: '100%'
  },
  linea: {
    width: px(160),
    marginLeft: px(109)
  },
  header: {
    marginTop: px(20)
  },
  headerIcon: {
    width: px(19),
    height: px(35),
    marginLeft: px(21)
  },
  headerT: {
    color: theme.text.color15,
    marginLeft: px(21)
  },
  loginLogo: {
    width: px(450),
    height: px(150),
    marginLeft: px(140),
    marginTop: px(133),
    marginBottom: px(80)
  },
  tab: {
    color: theme.text.color9,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: px(32)
  },
  tabactive: {
    color: theme.text.color6
  },
  regLine: {
    height: px(100),
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: px(50),
    width: px(750),
  },
  hotArea: {
    width: px(100),
    height: px(50),
    justifyContent: 'center',
    position: 'absolute',
    right: px(50),
    bottom: px(20),
  },
  regIcon: {
    width: px(24),
    height: px(30),
    marginLeft: px(90),
  },
  regIcon1: {
    width: px(30),
    height: px(30),
    marginLeft: px(90),
  },
  iconPass: {
    width: px(30),
    height: px(32),
    marginLeft: px(90),
  },
  regIcon2: {
    width: px(32),
    height: px(12),
  },
  eyeOpen: {
    height: px(16),
  },
  regText: {
    minWidth: px(300),
    fontSize: px(24),
    color: theme.text.color15,
    marginLeft: px(27),
  },
  line: {
    width: px(610),
    height: px(2),
    backgroundColor: theme.border.color3,
    borderRadius: px(4),
    marginLeft: px(20),
    flexDirection: 'row',
    justifyContent: 'center',
  },
  lineactive: {
    backgroundColor: theme.background.color12
  },
  code: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: theme.text.color27,
    borderRadius: px(26),
    width: px(152),
    marginLeft: px(180),
    position: 'absolute',
    right: px(88),
    bottom: px(12)
  },

  codeText: {
    color: theme.text.color27,
    fontSize: 12,
    textAlign: 'center',
    height: px(56),
    lineHeight: px(56),
  },
  codeActive: {
    color: theme.text.color6,
    borderColor: theme.text.color6
  },
  mgt45: {
    marginTop: px(45),
  },
  loginInput: {
    color: theme.text.colorWhite,
    width: px(600),
    fontSize: px(32),
    textAlign: 'center',
    borderRadius: px(44),
  },
  btn: {
    width: px(600),
    height: px(88),
    borderRadius: px(44),
    justifyContent: 'center'
  },
  loginInputB: {
    backgroundColor: theme.backgroundColor.login
  },
  loginInputD: {
    backgroundColor: theme.disable.bgColor1,
  },
  loginInputC: {
    backgroundColor: theme.background.color12
  },
  loginInputL: {
    marginBottom: 8,
    marginTop: 10,
    width: px(600),
    height: px(88),
    borderRadius: px(44),
    borderColor: theme.backgroundColor.loginL,
    backgroundColor: theme.backgroundColor.loginL,
  },
  subButtonText: {
    fontSize: 14,
    marginTop: px(24),
    textAlign: 'center',
  },
});

export default connect(mapState, mapDispatch)(LoginPage);

