import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  DeviceEventEmitter
} from 'react-native';
import { Toast } from '@ant-design/react-native';
import { px } from '../../utils/adapter';
import APIs from '../../http/APIs';
import AppActions from '../../store/actions';
import { connect } from 'react-redux';
import { enptyFn } from '../../utils/common';
import theme from '../../styles/theme';
function showToast(text, duration = 1) {
  Toast.info(text, duration, enptyFn, false);
}
const mapState = (state) => {
  return {
    userInfo: state.login.loginInfo,
  };
};

const mapDispatch = {
  updateLogin: AppActions.updateLogin
};

class Modify extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShow: false,
      response: '修改成功',
      title: '',
      len: 0,
      nickName: '',
      sign: '',
      isUsername: false,
      input: '',
      id: 0,
      isEmpty: true
    };
  }
  componentDidMount() {
    // console.log('变化2222', this.props.route.params.params)
    let { title, len } = this.props.route.params.params;
    this.props.navigation.setOptions({
      title: title == '昵称' ? '修改昵称' : '修改个性签名',
    });
    this.setState({
      nickName: this.props.userInfo.nickName == null ? '' : this.props.userInfo.nickName,
      sign: this.props.userInfo.sign == null ? '' : this.props.userInfo.sign,
    });
    this.setState({ title: title, len: len, isUsername: title == '昵称' ? true : false });
    //  判断初次进来昵称或者个签为不为空
    if (this.props.route.params.params.title == '昵称' && this.props.userInfo.nickName == null) {
      this.setState({
        isEmpty: true,
      });
    } else if (!this.props.route.params.params.title == '昵称' && this.props.userInfo.sign == null) {
      this.setState({
        isEmpty: true,
      });
      // console.log('变化sign', this.state.isEmpty)
    } else {
      // console.log('变化else', this.state.isEmpty)
      this.setState({
        isEmpty: false,
      });
    }
  }
  // 右上角保存变换颜色
  UNSAFE_componentWillUpdate() {
    // console.log('变化', this.state.isEmpty)
    this.props.navigation.setOptions({
      headerRight: () => {
        return (
          <TouchableOpacity onPress={() => {
            if (this.state.isUsername && !this.state.nickName == '' && !this.state.isEmpty) {
              this.save();
            } else {
              if (!this.state.sign == '' && !this.state.isEmpty) {
                this.save();
              }
            }
            //  if(this.state.isUsername){
            //    this.state.nickName==''?this.setState({isShow:true,response:'昵称不能为空'},()=>{setTimeout(()=>{
            //      this.setState({isShow:false})
            //    },1000)}):this.save()
            //  }else{
            //    this.state.nickName==''?this.setState({isShow:true,response:'个签不能为空'},()=>{setTimeout(()=>{
            //      this.setState({isShow:false})
            //    },1000)}):this.save()
            //  }
          }}>
            <View style={styles.save}>
              <Text style={this.state.isEmpty ? styles.saveEmpty : styles.saveNoEmpty}>保存</Text>
            </View>
          </TouchableOpacity>
        );
      },
    });
  }
  render() {
    return (
      <ScrollView style={commonstyle.flex}>
        <View style={styles.box}>
          <Text style={styles.label}>{this.state.title}</Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => {
              //  let reg = /^[\u4e00-\u9fa5]+$/;
              if (text == '') {
                this.setState(this.state.isUsername ? { nickName: text } : { sign: text });
                this.setState({
                  isEmpty: true
                });
                return false;
              }
              if (!text == '') {
                this.setState({
                  isEmpty: false
                });
              }
              this.setState(this.state.isUsername ? { nickName: text } : { sign: text });
              // 去掉之前边输入边校验的规则
              // if (reg.test(text)) {
              //   this.setState(this.state.isUsername ? { nickName: text } : { sign: text });
              // } else {
              //   this.waring('禁止包含特殊符号');
              //   //  this.throttle(this.setState({isShow:true,response:'禁止包含特殊符号'},()=>{
              //   //    setTimeout(()=>{
              //   //      this.setState({isShow:false,response:''})
              //   //    },1000)
              //   //  }),1000)
              // }
            }
            }
            placeholder={'请输入' + this.state.title}
            maxLength={this.state.len}
            value={this.state.isUsername ? this.state.nickName : this.state.sign}
          />
          <Text style={styles.number}>
            {this.state.isUsername ? this.state.nickName.length : this.state.sign.length} / {this.state.len}
          </Text>
        </View>
        <Text style={styles.textcheck}>
          不允许出现字母/数字，最长{this.state.len}个字符
        </Text>
        <Modal
          visible={this.state.isShow}
          animationType={'fade'}
          // 是否透明默认是不透明 false
          transparent={true}
          // 关闭时调用
          onRequestClose={() => { }}
        >
          <View style={styles.container}>
            <Text style={styles.suc}>{this.state.response}</Text>
          </View>
        </Modal>
      </ScrollView>
    );
  }

  goback() {
    this.props.navigator.pop();
  }
  validate() {
    let reg = /^[\u4e00-\u9fa5]+$/;
    let text = this.state.isUsername ? this.state.nickName : this.state.sign;
    if (!reg.test(text)) {
      this.waring('您的输入不合法');
      return false;
    }
    return true;
  }
  save() {
    if (!this.validate()) return;
    let params = {
      id: this.props.userInfo.id,
      AuthUserId:this.props.userInfo.id,
      AuthToken:this.props.userInfo.token,
    };
    if (this.state.isUsername) {
      params.nickName = this.state.nickName;
    } else {
      params.sign = this.state.sign;
    }
    // console.log('更改信息params',params);
    APIs.updataUserInfo(params).then((res) => {
      // this.setState(() => {
      //   return {
      //     isShow: true,
      //     response: '修改成功',
      //   };
      // });
      // console.log('更改信息',res);
      showToast('修改成功');
      setTimeout(() => {
        this.setState(() => {
          return { isShow: false };
        });
      }, 2000);
      DeviceEventEmitter.emit('refresh_my', { dosth: '修改资料_my' });
      this.props.navigation.navigate('My');
    }).catch(err => {

      showToast('网络异常，请稍后再试');
    });
  }
  waringTime = Date.now();
  waring = (msg) => {
    if (Date.now() - this.waringTime < 3000) return;
    this.waringTime = Date.now();
    showToast(msg);
  }
  throttle = function (fn, delay) {
    let timer = null;
    return function () {
      clearTimeout(timer);
      timer = setTimeout(function () {
        console.log('多次点击触发一次');
        fn();
      }, 10000 || delay);
    };
  };
}

export default connect(mapState, mapDispatch)(Modify);

const styles = StyleSheet.create({
  box: {
    flex: 1,
    height: px(106),
    flexDirection: 'row',
    paddingLeft: px(50),
    paddingRight: px(50),
    marginTop: px(39),
    backgroundColor: theme.backgroundColor.white,
    alignItems: 'center',
  },
  label: {
    //  width: px(120),
    height: px(36),
    color: theme.text.color13,
    //  borderStyle: 'dashed',
    //  borderWidth: 1,
  },
  textcheck: {
    color: theme.text.color30,
    marginLeft: px(50),
    marginTop: 14
  },
  input: {
    flex: 1,
    textAlign: 'right',
    color: theme.text.color14,
  },
  number: {
    color: theme.text.color27,
    marginLeft: px(30),
  },
  container: {
    top: '50%',
    left: '50%',
    marginLeft: px(-85),
    marginTop: px(-30),
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.text.color14,
    borderRadius: px(6),
    paddingLeft: px(20),
    paddingRight: px(20),
    height: px(60),
    borderWidth: 1,
    borderColor: theme.text.color14
  },
  suc: {
    color: theme.text.colorWhite,
  },
  save: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: px(100),
  },
  saveEmpty: {
    color: theme.text.color27
  },
  saveNoEmpty: {
    color: theme.text.color14
  }
});
const commonstyle = StyleSheet.create({
  flex1: {
    flex: 1,
    backgroundColor: theme.backgroundColor.color8,
  },

  usertopstyle: {
    borderBottomWidth: 1,
    borderColor: theme.border.color15,
    flex: 1,
    flexDirection: 'row',
  },
});
