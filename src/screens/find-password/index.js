import React, { Component } from 'react';
import { Button, Toast, Provider, } from '@ant-design/react-native';
import cstyle from '../../styles/common';
import theme from '../../styles/theme';
import {
  StyleSheet,// 样式对象
  View,
  Text,// 文本文件
  TextInput,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  DeviceEventEmitter,
  AppState
} from 'react-native';
import { px } from '../../utils/adapter';
import { updatePassApi, getinit, sendCodeApi, sendMailCode, updatePasswordByPhone } from '../../http/APIs';
import AppActions from '../../store/actions';
import { connect } from 'react-redux';
import { enptyFn } from '../../utils/common';
import { fomatFloat } from '../../utils/timer';
function showToast(text) {
  Toast.info(text, 3, enptyFn, false);
}

const mapState = (state) => ({
  state
});

const mapDispatch = {
  updateFooterTabBar: AppActions.updateFooterTabBar,
  updateLogin: AppActions.updateLogin
};
let timerR;
class SetNumber extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isActive: false,// 密码眼睛开关
      isActiveAgin: false,
      mobile: '',
      pass: '',
      passAgin: '',
      code: '',
      isTimer: false,
      second: 60,
      timerTitle: '获取验证码',
      codeCondition1: false,// 密码
      codeCondition2: false,// 再次验证密码
      codeCondition3: false,// 邮箱
      codeCondition4: false,// 验证码
      isEmail: false,
      email: '',
      appState: AppState.currentState,//
    };
    this.backgroundTime = 0;
    this.count = false;
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
      c = this.state.codeCondition3,
      query = {
        phone: this.state.mobile,
        type: 3
      },
      query2 = {
        email: this.state.email,
        type: 3
      };
    if (this.state.isEmail ? a && b && c : a && b) {
      this.count = true;
    } else {
      this.count = false;
    }

    if (this.state.isEmail ? a && b && c : a && b) {
      timerR && clearInterval(timerR);
      getinit([this.state.isEmail ? sendMailCode : sendCodeApi, this.state.isEmail ? query2 : query]).then(res => {
        console.log(res);
        if (res.statusCode == '000') {
          showToast('已发送');
          timerR = setInterval(
            () => {
              if (this.state.second == 0) {
                clearInterval(timerR);
                this.count = false;
                console.log(timerR, '清除器清零aaa');
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
                  this.updateState('second', this.state.second - 1);
                }
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
  // 邮箱 手机转换
  findEmail() {
    if (this.state.isEmail) {
      this.updateState('isEmail', false);
      this.updateState('second', 60);
      this.updateState('isTimer', false);
      this.clearData();
      clearInterval(timerR);
      this.count = false;
    } else {
      this.updateState('isEmail', true);
      this.updateState('second', 60);
      this.updateState('isTimer', false);
      clearInterval(timerR);
      this.clearData();
      this.count = false;
    }
  }
  UNSAFE_componentWillMount() {
    this.clearData();
  }
  componentDidMount() {
    // this.listenerMobile = DeviceEventEmitter.addListener('mobile', (message) => {
    //   if (message) {
    //     this.setState({
    //       mobile: message.mobile
    //     });
    //   }
    // });
    AppState.addEventListener('change', this.handleAppStateChange);
    if (this.props.route.params.mobile) {
      this.setState({
        mobile: this.props.route.params.mobile
      });
      this.count = false;
    }

    if (this.props.navigation.isFocused()) {
      this.props.navigation.addListener('focus', () => {
        this.props.updateFooterTabBar({ show: false });
      });
      this.props.navigation.addListener('blur', () => {
        this.props.updateFooterTabBar({ show: true });
      });
    }
  }
  // 监听是否在app应用内
  handleAppStateChange = (nextAppState) => {
    if (this.state.appState === 'active' && nextAppState.match(/inactive|background/)) {
      this.backgroundTime = new Date().getTime() / 1000;
      console.log(this.state.appState, nextAppState, this.backgroundTime);
    }
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      this.backgroundTime = fomatFloat(new Date().getTime() / 1000 - this.backgroundTime, 0);
      console.log('应用已经来到前台');
      console.log(this.state.appState, nextAppState, this.backgroundTime);
    }
    this.setState({ appState: nextAppState });
  }
  componentWillUnmount() {
    clearInterval(timerR);
    AppState.removeEventListener('change', this.handleAppStateChange);
    // DeviceEventEmitter.removeSubscription(this.listenerMobile);
  }
  clearData() {
    //  this.updateState('isEmail', false);
    this.updateState('code', '');
    this.updateState('pass', '');
    this.updateState('passAgin', '');
    this.updateState('codeCondition1', false);// 密码
    this.updateState('codeCondition2', false);// 再次密码
    this.updateState('codeCondition3', false);// 邮箱
    this.updateState('codeCondition4', false);// 验证码
  }
  // 密码显示处理
  passHandle() {
    if (this.state.isActive) {
      this.updateStatus(false);
    } else {
      this.updateStatus(true);
    }
  }
  passHandleAgin() {
    if (this.state.isActiveAgin) {
      this.updateStatusAgin(false);
    } else {
      this.updateStatusAgin(true);
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
  checkText() {
    alert(this.state.passAgin == this.state.pass);
  }
  updateEmail(text) {
    this.updateState('email', text);
    let emailRe = /^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
    if (emailRe.test(text)) {
      this.setState({
        codeCondition3: true
      });
    } else {
      this.setState({
        codeCondition3: false
      });
    }
  }
  updateCode(text) {
    this.updateState('code', text);
    //  let codeRe = /^\d{6}$/
    if (text.length == 6) {
      this.setState({
        codeCondition4: true
      });
    } else {
      this.setState({
        codeCondition4: false
      });
    }
  }
  updateState(key, val) {
    let state = this.state;
    state[key] = val;
    this.setState(state);
  }
  // 密码眼睛状态
  updateStatus(status) {
    this.setState(() => {
      return {
        isActive: status
      };
    });
  }
  updateStatusAgin(status) {
    this.setState({
      isActiveAgin: status
    });
  }
  // 下一步
  go() {
    let a = this.state.codeCondition1,// 密码
      b = this.state.codeCondition2,// 再次密码
      c = this.state.codeCondition3,// 邮箱
      d = this.state.codeCondition4;// 验证码   
    if (this.state.isEmail) {
      if (a && b && c && d) {
        this.check();
      }
    } else {
      if (a && b && d) {
        this.check();
      }
    }
  }
  // 执行时检查
  check() {
    let rule = new RegExp(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,12}$/);
    let query;
    if (this.state.isEmail) {
      query = {
        email: this.state.email,
        password: this.state.pass,
        code: this.state.code,
        type: 2
      };
    } else {
      query = {
        phone: this.state.mobile,
        password: this.state.pass,
        code: this.state.code,
        type: 1
      };
    }
    if (!rule.test(this.state.pass)) {
      showToast('密码格式有误');
    } else if (this.state.passAgin != this.state.pass) {
      showToast('两次密码不一致');
    } else {
      getinit([this.state.isEmail ? updatePassApi : updatePasswordByPhone, query]).then(
        res => {
          if (res.statusCode == '000') {
            showToast('设置成功');
            DeviceEventEmitter.emit('state', { mobile: this.state.mobile, pass: this.state.pass });
            this.props.navigation.navigate('Login', { mobile: this.state.mobile, pass: this.state.pass, from: 'findPwd' });
          } else {
            showToast(res.message);
          }
          console.log(res);
        }, err => {
          showToast('网络异常，请稍后再试');
        }
      );

    }
  }
  render() {
    let a = this.state.codeCondition1,
      b = this.state.codeCondition2,
      c = this.state.codeCondition3,
      d = this.state.codeCondition4;
    return (
      <View style={[styles.page, cstyle.flex1]}>
        {/* <View style={[styles.header, cstyle.flexDirecR, cstyle.flexJcF, cstyle.flexAiC]}>
                    <Image source={require('../../assets/images/left-arrow.png')} style={styles.headerIcon}></Image>
                    <Text style={styles.headerT}>设置新密码</Text>
                </View> */}
        <Text style={styles.lineTop}></Text>
        {this.state.isEmail ? <View style={styles.title}>
          <Text style={styles.titleNumber}>邮箱</Text>
          <Text style={styles.titleTip}>验证码会发送至该邮箱</Text>
        </View> : <View style={styles.title}>
          <Text style={styles.titleNumber}>手机号</Text>
          <Text style={styles.titleTip}>验证码会发送至该手机号</Text>
        </View>}
        {this.state.isEmail ? <View style={styles.regLine}>
          <Image source={require('../../assets/images/login-email.png')} style={styles.iconEmail}></Image>
          <TextInput placeholder='请输入邮箱地址' style={styles.regText}
            autoCapitalize={'none'}
            onChangeText={(text) => this.updateEmail(text)}
            maxLength={20}
            defaultValue={this.state.email}
          />
        </View> : <View style={styles.regLine}>
          <Image source={require('../../assets/images/login-phone.png')} style={styles.regIcon}></Image>
          <TextInput placeholder='请输入11位手机号码' style={styles.regText}
            keyboardType={'numeric'}
            autoCapitalize={'none'}
            editable={false}
            maxLength={11}
            value={this.state.mobile}
          />
        </View>
        }
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
              <Image source={this.state.isActive ? require('../../assets/images/login-Eye.png') : require('../../assets/images/login-Eye-closed.png')}
                style={[styles.regIcon2, this.state.isActive ? styles.eyeOpen : '']}></Image>
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
          //  onEndEditing={() => { this.checkText() }}
          />
          <TouchableOpacity onPress={() => this.passHandleAgin()} style={styles.hotArea} >
            <Image source={this.state.isActiveAgin ? require('../../assets/images/login-Eye.png') : require('../../assets/images/login-Eye-closed.png')} style={[styles.regIcon2, styles.IconEye, this.state.isActiveAgin ? styles.eyeOpen : null]}></Image>
          </TouchableOpacity >

        </View>
        <Text style={styles.line}></Text>
        <View style={styles.regLine}>
          <Image source={require('../../assets/images/login-key.png')} style={styles.IconKey}></Image>
          <TextInput placeholder='请输入6位验证码' style={[styles.regText, styles.iptCode]}
            autoCapitalize={'none'}
            keyboardType={'numeric'}
            maxLength={6}
            onChangeText={(text) => this.updateCode(text)}
            defaultValue={this.state.code}
          />
          <TouchableOpacity style={[styles.code, this.state.isEmail ? a && b && c && !this.state.isTimer ? styles.codeActive : '' :
            a && b && !this.state.isTimer ? styles.codeActive : '']} onPress={() => { this.getCode(); }}>
            <Text style={[styles.codeText,
              this.state.isEmail ? a && b && c && !this.state.isTimer ? styles.codeActive : '' :
                a && b && !this.state.isTimer ? styles.codeActive : '']}>
              {this.state.isTimer ? '重发' + this.state.second + 's' : this.state.timerTitle}
            </Text>
          </TouchableOpacity>
          {/* <TouchableWithoutFeedback onPress={() => this.getCode()}>
            <Text style={[styles.code,
            this.state.isEmail ? a && b && c && !this.state.isTimer ? styles.codeActive : '' :
              a && b && !this.state.isTimer ? styles.codeActive : '']}>
              {this.state.isTimer ? '重发' + this.state.second + 's' : this.state.timerTitle}
            </Text>
          </TouchableWithoutFeedback> */}
        </View>
        <Text style={styles.line}></Text>
        <View style={[styles.wrap, cstyle.flexDirecR, cstyle.flexJcC]}>
          <TouchableOpacity onPress={() => this.go()} style={[styles.loginInput, cstyle.flexJcC, cstyle.flexAiC,
            this.state.isEmail ? (a && b && c && d) ? styles.loginInputC : styles.loginInputD
              : (a && b && d) ? styles.loginInputC : styles.loginInputD
          ]}>
            <Text style={cstyle.txtColorWhite}>确定</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.wrap, cstyle.flexDirecR, cstyle.flexJcC]}>
          {this.state.isEmail ? <Text style={styles.subButtonText} onPress={() => this.findEmail()}>无法收到邮件</Text>
            : <Text style={styles.subButtonText} onPress={() => this.findEmail()}>无法收到短信</Text>}

        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  page: {
    backgroundColor: theme.findPassBgColor,
  },
  header: {
    paddingTop: px(20),
    paddingBottom: px(15)
  },
  headerIcon: {
    width: px(19),
    height: px(35),
    marginLeft: px(21)
  },
  headerT: {
    color: theme.text.color14,
    marginLeft: px(276),
    fontSize: px(30)
  },
  lineTop: {

  },
  title: {
    marginTop: px(100),
    marginLeft: px(76),
  },
  titleNumber: {
    fontSize: px(30),
    color: theme.text.color14,
    fontWeight: 'bold'
  },
  titleTip: {
    fontSize: px(28),
    color: theme.text.color27,
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
  iconEmail: {
    width: px(32),
    height: px(24),
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
  IconEye: {
  },
  eyeOpen: {
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
    backgroundColor: theme.skeletonBdB.borderBottomColor,
    borderRadius: px(4),
    marginLeft: px(71),
    flexDirection: 'row',
    justifyContent: 'center',
    //  boxShadow: 0 0 5px 0 rgba(0,0,0,0.02);
  },
  code: {
    color: theme.text.color27,
    fontSize: 12,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: theme.text.color27,
    borderRadius: px(26),
    width: px(152),
    height: px(56),
    textAlign: 'center',
    lineHeight: px(56),
    marginLeft: px(180),
    bottom: px(17)
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
    marginTop: px(45),
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
  iptCode: {
    minWidth: px(160)
  }
});

export default connect(mapState, mapDispatch)(SetNumber);
