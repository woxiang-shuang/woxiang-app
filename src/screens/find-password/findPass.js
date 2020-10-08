import React, { Component } from 'react';
import { Toast, Provider, WingBlank, } from '@ant-design/react-native';
import cstyle from '../../styles/common';
import theme from '../../styles/theme';
import {
  StyleSheet,// 样式对象
  View,
  Text,// 文本文件
  TextInput,
  Image,
  TouchableOpacity,
  DeviceEventEmitter
} from 'react-native';
import { px } from '../../utils/adapter';
import { handlePhone } from '../../http/APIs';
import AppActions from '../../store/actions';
import { connect } from 'react-redux';
import { enptyFn } from '../../utils/common';

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

class IphoneNumber extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isActive: false,
      mobile: ''
    };
  }
  componentDidMount() {
    if (this.props.navigation.isFocused()) {
      this.props.navigation.addListener('focus', () => {
        this.props.updateFooterTabBar({ show: false });
      });
      this.props.navigation.addListener('blur', () => {
        this.props.updateFooterTabBar({ show: true });
      });
    }

  }
  // 手机号
  updateText(text) {
    this.setState(() => {
      return {
        mobile: text
      };
    });
    let phoneRe = /^1(3|4|5|6|7|8|9)\d{9}$/;
    if (phoneRe.test(text)) {
      this.setState({
        isActive: true
      });
    } else {
      this.setState({
        isActive: false
      });
    }
  }
  // 跳转设置密码
  go() {
    let query = this.state.mobile;
    if (this.state.isActive) {
      handlePhone(query).then(res => {
        if (res.statusCode == '400') {// 400为手机号已注册
          // DeviceEventEmitter.emit('mobile', { mobile: this.state.mobile});
          this.props.navigation.navigate('FindPass',
            { mobile: this.state.mobile });
        }else{
          showToast('手机号未注册');
        }
      }, err => {
        showToast('网络异常，请稍后再试');
      });
    }
  }
  render() {
    return (
      <View style={[styles.page, cstyle.flex1]}>
        <Text style={styles.lineTop}></Text>
        <View style={styles.title}>
          <Text style={styles.titleNumber}>手机号</Text>
          <Text style={styles.titleTip}>输入作为登录账号的手机号</Text>
        </View>
        <View style={styles.regLine}>
          <Image source={require('../../assets/images/login-phone.png')} style={styles.regIcon}></Image>
          <TextInput placeholder='请输入11位手机号码' style={styles.regText}
            keyboardType={'numeric'}
            autoCapitalize={'none'}
            maxLength={11}
            onChangeText={(text) => { this.updateText(text); }}
          />
        </View>
        <Text style={styles.line}></Text>
        <View style={[styles.wrap, cstyle.flexDirecR, cstyle.flexJcC]}>
          <TouchableOpacity onPress={() => { this.go(); }} style={[styles.btn, styles.mgt45, this.state.isActive ? styles.loginInputC : styles.loginInputD]}>
            <Text
              style={styles.loginInput}
            >下一步</Text>
          </TouchableOpacity>
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
    marginTop: px(203),
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
    
  },
  regIcon: {
    width: px(24),
    height: px(30),
    marginLeft: px(90),
  },
  regText: {
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
  wrap: {
    width: px(750),
  },
  loginInput: {
    //  marginTop: px(45),
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
  mgt45: {
    marginTop: px(45),
  },
  btn: {
    width: px(600),
    height: px(88),
    borderRadius: px(44),
  }
});
export default connect(mapState, mapDispatch)(IphoneNumber);