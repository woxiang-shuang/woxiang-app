import React, { Component } from 'react';
import {
  StyleSheet, // 样式对象
  Button,
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  AppState
} from 'react-native';
import { Toast } from '@ant-design/react-native';
import cstyle from '../../styles/common';
import theme from '../../styles/theme';
import { px } from '../../utils/adapter';
import { regApi, getinit, sendCodeApi, handlePhone, loginApi } from '../../http/APIs';
import AppActions from '../../store/actions';
import { connect } from 'react-redux';
import { enptyFn } from '../../utils/common';
import { fomatFloat } from '../../utils/timer';
import DeviceInfo from 'react-native-device-info';
function showToast(text) {
  Toast.info(text, 3, enptyFn, false);
}
function loadingToast() {
  Toast.loading('提交中...', 1, () => {

  }, false);
}

const mapState = (state) => ({
  state
});

const mapDispatch = {
  updateFooterTabBar: AppActions.updateFooterTabBar,
  updateLogin: AppActions.updateLogin
};
let timerR;  
class RegPage extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      isActive: false,// 密码开关
      isActiveAgin: false,
      mobile: '',
      pass: '',
      passAgin: '',
      code: '',
      codeActive: false,
      codeCondition: false, // 手机
      codeCondition1: false,// 密码 
      codeCondition2: false,// 再次输入密码
      codeCondition4: false,// 验证码
      second: 60,
      timerTitle: '获取验证码',
      isTimer: false,
      appState: AppState.currentState,//
    };
    this.backgroundTime = 0;
    this.count = false;   
  }

  UNSAFE_componentWillMount() {
    this.clearData();
    
  }
  componentDidMount() {
    console.log('count',this.count);
    AppState.addEventListener('change', this.handleAppStateChange);
    if (this.props.navigation.isFocused()) {
      this.props.navigation.addListener('focus', () => {
        this.props.updateFooterTabBar({ show: false });
      });
      this.props.navigation.addListener('blur', () => {
        this.props.updateFooterTabBar({ show: true });
      });
    }
  }
  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
    clearInterval(timerR);
  }
  // 监听是否在app应用内
  handleAppStateChange = (nextAppState) => {
    if (this.state.appState === 'active' && nextAppState.match(/inactive|background/)) {
      this.backgroundTime = new Date().getTime() / 1000;
    }
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      if(this.state.second == 60) {
        this.backgroundTime = 0;
      }else{
        this.backgroundTime = fomatFloat(new Date().getTime() / 1000 - this.backgroundTime, 0);
      }
    
      // console.log('应用已经来到前台')
      console.log(this.state.appState, nextAppState, this.backgroundTime);
    }
    this.setState({ appState: nextAppState });
  }
  // 验证手机号
  updateMobile(text) {
    this.updateState('mobile', text);
    let phoneRe = /^1(3|4|5|6|7|8|9)\d{9}$/;
    if (phoneRe.test(text)) {
      this.updateState('codeCondition', true);
    } else {
      this.updateState('codeCondition', false);
    }
  }
  // 密码显示处理
  passHandle() {
    if (this.state.isActive) {
      this.updateState('isActive', false);
    } else {
      this.updateState('isActive', true);
    }
  }
  passHandleAgin() {
    if (this.state.isActiveAgin) {
      this.updateState('isActiveAgin', false);
    } else {
      this.updateState('isActiveAgin', true);
    }
  }
  // 密码值绑定 验证密码规则
  updatePass(text) {
    this.updateState('pass', text);
    if (text.length >= 6 && text.length <= 12) {
      this.updateState('codeCondition1', true);
    } else {
      this.updateState('codeCondition1', false);
    }
  }
  updatePassAgin(text) {
    this.updateState('passAgin', text);
    if (text.length >= 6 && text.length <= 12) {
      this.updateState('codeCondition2', true);
    } else {
      this.updateState('codeCondition2', false);
    }
  }
  updateCode(text) {
    this.updateState('code', text);
    let codeRe = /^\d{6}$/;
    if (codeRe.test(text)) {
      this.setState({
        codeCondition4: true
      });
    } else {
      this.setState({
        codeCondition4: false
      });
    }
  }
  getDown() {
    return this.state.second;
  }
  // 获取验证码
  getCode() {
    console.log(timerR, this.count);
    if (this.count) {
      return;
    }
    let a = this.state.codeCondition1,
      b = this.state.codeCondition2,
      c = this.state.codeCondition,
      queryType = {
        phone: this.state.mobile,
        type: 1
      };
    if (!a || !b || !c) {
      this.count = false;
    } else {
      this.count = true;
    }
    if (a && b && c && this.state.second == 60) {
      timerR && clearInterval(timerR);
      let query = this.state.mobile;
      handlePhone(query).then(res => {
        if (res.statusCode == '400') {// 400为手机号已注册
          this.count = false; 
          showToast(res.message);
        } else {
          // 获取验证码
          getinit([sendCodeApi, queryType]).then(res => {
            if (res.statusCode == '000') {
              showToast('已发送');
              timerR = setInterval(
                () => {
                  if (this.state.second == 0) {
                    clearInterval(timerR);
                    this.count = false;
                    console.log(timerR, '清除器清零');
                    this.updateState('isTimer', false);
                    if (this.state.mobile.length == 11) {
                      this.updateState('codeActive', true);
                    }
                    this.updateState('second', 60);
                  } else {
                    this.updateState('isTimer', true);
                    this.updateState('codeActive', false);
                    if (this.backgroundTime > 0 && this.backgroundTime < this.getDown()) {
                      this.updateState('second', this.state.second - this.backgroundTime);
                      this.backgroundTime = 0;
                    } else {
                      let time = this.state.second;
                      this.updateState('second', time - 1);
                    }
                  }
                },
                1000
              );
            } else {
              this.count = false ;
              showToast(res.message);
            }
          },
          err => {
            this.count = false ;
           
            showToast('网络异常，请稍后再试');
          }
          );

        }
      }, err => {
        this.count = false ;
        console.log('异常',err);
        showToast('网络异常，请稍后再试');
      });
    }
  }
  updateState(key, val) {
    let state = this.state;
    state[key] = val;
    this.setState(state);
  }
  clearData() {
    this.updateState('mobile', '');
    this.updateState('code', '');
    this.updateState('pass', '');
    this.updateState('passAgin', '');
    this.updateState('codeCondition1', false);// 密码
    this.updateState('codeCondition2', false);// 再次密码
    this.updateState('codeCondition', false);// 手机
    this.updateState('codeCondition4', false);// 验证码
  }
  // 登录
  handleLogin() {
    let query = {
      phone: this.state.mobile,
      password: this.state.pass,
      deviceId: DeviceInfo.getUniqueId()
    };
    // console.log('注册query',query);
    getinit([loginApi, query]).then(res => {
      if (res.statusCode == '000') {
        this.props.updateLogin(res);// REUDX
      }
    },
    err => {
      showToast('网络异常，请稍后再试');
    }
    );
  }
  doReg() {
    let a = this.state.codeCondition1,
      b = this.state.codeCondition2,
      c = this.state.codeCondition,
      d = this.state.codeCondition4,
      query = {
        phone: this.state.mobile,
        password: this.state.pass,
        code: this.state.code
      },
      rule = new RegExp(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,12}$/);
    if (a && b && c && d) {
      if (!rule.test(this.state.pass)) {
        showToast('密码格式有误');
      } else if (this.state.passAgin != this.state.pass) {
        showToast('两次密码不一致');
      } else {
        getinit([regApi, query]).then(
          res => {
            // loadingToast()
            if (res.statusCode == '000') {
              showToast(res.message);
              this.handleLogin();// 注册完即登录           
              this.props.updateFooterTabBar({ show: true });
              this.props.navigation.navigate('My');
              this.props.navigation.navigate('Competition');
            } else {
              showToast(res.message);
            }
          },
          err => {
            console.log(err);
            showToast('网络异常，请稍后再试');
          }
        );
      }
    }
  }
  render() {
    let a = this.state.codeCondition1,
      b = this.state.codeCondition2,
      c = this.state.codeCondition,
      d = this.state.codeCondition4;
    return (
      <View style={styles.Page}>
        <View style={[styles.regLine, styles.reg]}>
          <Image source={require('../../assets/images/login-phone.png')} style={styles.regIcon}></Image>
          <TextInput placeholder='请输入11位手机号码' style={styles.regText}
            keyboardType={'numeric'}
            autoCapitalize={'none'}
            onChangeText={(text) => { this.updateMobile(text); }}
            maxLength={11}
            defaultValue={this.state.mobile}
          />
        </View>
        <Text style={styles.line}></Text>
        <View style={styles.wrap}>
          <View style={styles.regLine}>
            <Image source={require('../../assets/images/login-password.png')} style={styles.regIcon1}></Image>
            <TextInput placeholder='请输入密码(6-12位字母和数字组成)' style={styles.regText}
              secureTextEntry={this.state.isActive ? false : true}
              keyboardType={'default'}
              autoCapitalize={'none'}
              maxLength={12}
              onChangeText={(text) => this.updatePass(text)}
              defaultValue={this.state.pass}
            />
            <TouchableOpacity onPress={() => this.passHandle()} style={styles.hotArea} >
              <Image source={this.state.isActive ?
                require('../../assets/images/login-Eye.png') :
                require('../../assets/images/login-Eye-closed.png')}
              style={[styles.regIcon2,
                this.state.isActive ? styles.eyeOpen : '']}></Image>
            </TouchableOpacity >
          </View>
        </View>
        <Text style={styles.line}></Text>
        <View style={styles.regLine}>
          <Image source={require('../../assets/images/login-password2.png')} style={styles.regIcon1}></Image>
          <TextInput placeholder='请再次输入密码' style={styles.regText}
            secureTextEntry={this.state.isActiveAgin ? false : true}
            autoCapitalize={'none'}
            maxLength={12}
            onChangeText={(text) => this.updatePassAgin(text)}
            defaultValue={this.state.passAgin}
          />
          <TouchableOpacity onPress={() => this.passHandleAgin()} style={styles.hotArea} >
            <Image source={this.state.isActiveAgin ?
              require('../../assets/images/login-Eye.png') :
              require('../../assets/images/login-Eye-closed.png')}
            style={[styles.regIcon2, this.state.isActiveAgin
              ? styles.eyeOpen : '']}></Image>
          </TouchableOpacity >

        </View>
        <Text style={styles.line}></Text>
        <View style={styles.regLine}>
          <Image source={require('../../assets/images/login-key.png')} style={styles.IconKey}></Image>
          <TextInput placeholder='请输入6位验证码' style={styles.regText}
            autoCapitalize={'none'}
            keyboardType={'numeric'}
            maxLength={6}
            onChangeText={(text) => this.updateCode(text)}
            defaultValue={this.state.code}
          />
          {/* <TouchableWithoutFeedback onPress={() => this.getCode()} >
            <Text style={[styles.code, a && b && c && !this.state.isTimer ? styles.codeActive : '']}>
              {this.state.isTimer ? '重发' + this.state.second + 's' : this.state.timerTitle}
            </Text>
          </TouchableWithoutFeedback> */}
          <TouchableOpacity style={[styles.code, a && b && c && !this.state.isTimer ? styles.codeActive : '']} onPress={() => { this.getCode(); }}>
            <Text style={[styles.codeText, a && b && c && !this.state.isTimer ? styles.codeActive : '']}>
              {this.state.isTimer ? '重发' + this.state.second + 's' : this.state.timerTitle}
            </Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.line}></Text>
        <View style={[styles.wrap, cstyle.flexDirecR, cstyle.flexJcC]}>
          <TouchableOpacity onPress={() => this.doReg()} style={[styles.btn, a && b && c && d ? styles.loginInputC : styles.loginInputD, styles.mgt45]}>
            <Text
              style={styles.loginInput}
            >注册</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  Page: {
    flex: 1,
    backgroundColor: theme.findPassBgColor,
  },
  reg: {
    marginTop: px(210),
  },
  regLine: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: px(50),
    width: px(750),
    position: 'relative'
  },
  wrap: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: px(750),
  },
  regIcon: {
    width: px(24),
    height: px(30),
    marginLeft: px(90),
  },
  regIcon1: {
    width: px(30),
    height: px(32),
    marginLeft: px(90),
  },
  IconKey: {
    width: px(30),
    height: px(31),
    marginLeft: px(90),
  },
  regIcon2: {
    width: px(32),
    height: px(12),
  },
  eyeOpen: {
    width: px(32),
    height: px(16),
  },
  hotArea: {
    height: px(50),
    justifyContent: 'center',
    position: 'absolute',
    right: px(100),
    bottom: px(17)
  },
  regText: {
    minWidth: px(300),
    fontSize: px(24),
    color: theme.text.color15,
    marginLeft: px(27),
    padding: px(14),
  },
  line: {
    width: px(610),
    height: px(2),
    backgroundColor: theme.border.color3,
    borderRadius: px(4),
    marginLeft: px(71),
    flexDirection: 'row',
    justifyContent: 'center',
    // boxShadow: 0 0 5px 0 rgba(0,0,0,0.02);
  },
  code: {
    // color: theme.text.color27,
    // fontSize: 12,
    // textAlign: 'center',
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
  loginInput: {
    color: theme.text.colorWhite,
    width: px(600),
    height: px(88),
    fontSize: px(32),
    textAlign: 'center',
    lineHeight: px(88),
    borderRadius: px(44),
  },
  loginInputD: {
    backgroundColor: theme.disable.bgColor1,
  },
  loginInputC: {
    backgroundColor: theme.background.color12
  },
  subButtonText: {
    marginTop: px(24),
    color: theme.text.color28,
    fontSize: px(24)
  },
  mgt45: {
    marginTop: px(45),
  },
  btn: {
    width: px(600),
    height: px(88),
    borderRadius: px(44),
  }
});
// export default (props) => (
//   <Provider>
//     <RegPage {...props} />
//   </Provider>
// );
// export default RegPage
export default connect(mapState, mapDispatch)(RegPage);
