import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
  Dimensions,
  TouchableWithoutFeedback,
  BackHandler,
  DeviceEventEmitter
} from 'react-native';
import Picker from 'react-native-picker';
import ImagePicker from 'react-native-image-picker';
import APIs from '../../http/APIs';
import { px } from '../../utils/adapter';
import AppActions from '../../store/actions';
import { connect } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import { Toast } from '@ant-design/react-native';
import { enptyFn } from '../../utils/common';
import { theme } from '../../styles';

const screenWidth = Dimensions.get('window').width;
const screenheight = Dimensions.get('window').height;

const mapState = (state) => {
  // console.log('state-----------', state);
  return {
    userInfo: state.login.loginInfo == undefined ? {} : state.login.loginInfo,
  };
};

const mapDispatch = {
  updateLogin: AppActions.updateLogin
};

class Edit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      age: '请选择',
      gender: '请选择',
      personal: '',
      profileimg: '',
      showMask: false,
      showChoice: false,
      pickermask: false,
      userInfo: {},
      isShow: false,
      responsetext: '',
      id: 0,
    };
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', function () {
      Picker.hide();
    });
    this.subscription = DeviceEventEmitter.addListener('refresh', (v) => {
      this.getUserinfo();
    });
  }
  componentWillUnmount() {
    this.subscription.remove();
    this.closepicker();
  }
  render() {
    return (
      <LinearGradient colors={['#FBFDFF', '#FBFCFC']} locations={[0.1, 1]}>
        <View style={styles.page}>
          {/* 修改资料list开始 */}
          <View style={styles.mr20}>
            <TouchableOpacity onPress={this.choose.bind(this)}>
              <View style={styles.list}>
                <View style={styles.listitembox}>
                  <View style={styles.listitem}>
                    <Text style={styles.font}>头</Text>
                    <Text style={styles.font}>像</Text>
                  </View>
                </View>
                <View>
                  {this.props.userInfo.img == null ? (
                    <Image
                      source={require('../../assets/images/p-Contacts.png')}
                      style={styles.profile}
                    />
                  ) : (
                    <Image
                      source={{ uri: this.props.userInfo.img }}
                      style={styles.profile}
                    />
                  )}
                </View>
                <Image
                  style={styles.rarrow}
                  source={require('../../assets/images/right-arrow2.png')}
                ></Image>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.goTo.bind(this, 'Modify', 'name')}>
              <View style={[styles.list, styles.last]}>
                <View style={styles.listitembox}>
                  <View style={styles.listitem}>
                    <Text style={styles.font}>昵</Text>
                    <Text style={styles.font}>称</Text>
                  </View>
                </View>
                <Text style={styles.rightFont}>{this.props.userInfo.nickName == null ? '请输入' : this.props.userInfo.nickName}</Text>
                <Image
                  style={styles.rarrow}
                  source={require('../../assets/images/right-arrow2.png')}
                />
              </View>
            </TouchableOpacity>
          </View>
          <View style={theme.backgroundColor.white}>
            <TouchableOpacity onPress={this.topiker.bind(this, 'age')}>
              <View style={styles.list}>
                <View style={styles.listitembox}>
                  <View style={styles.listitem}>
                    <Text style={styles.font}>年</Text>
                    <Text style={styles.font}>龄</Text>
                  </View>
                </View>
                <Text style={styles.rightFont}>{this.props.userInfo.age == null ? '请选择' : this.props.userInfo.age}</Text>
                <Image
                  style={styles.rarrow}
                  source={require('../../assets/images/right-arrow2.png')}
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.topiker.bind(this, 'gender')}>
              <View style={styles.list}>
                <View style={styles.listitembox}>
                  <View style={styles.listitem}>
                    <Text style={styles.font}>性</Text>
                    <Text style={styles.font}>别</Text>
                  </View>
                </View>
                <Text style={styles.rightFont}>{this.props.userInfo.gender == null ? '请选择' : this.props.userInfo.gender == 1 ? '男' : '女'}</Text>
                <Image
                  style={styles.rarrow}
                  source={require('../../assets/images/right-arrow2.png')}
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={this.goTo.bind(this, 'Modify', 'personal')}
            >
              <View style={[styles.list, styles.last]}>
                <View style={styles.listitembox}>
                  <View style={styles.listitem}>
                    <Text style={styles.font}>个</Text>
                    <Text style={styles.font}>性</Text>
                    <Text style={styles.font}>签</Text>
                    <Text style={styles.font}>名</Text>
                  </View>
                </View>
                <Text style={styles.rightFont}>
                  {this.props.userInfo.sign == null ? '点击设置签名' :
                    this.props.userInfo.sign ? (this.props.userInfo.sign.length > 10 ? this.props.userInfo.sign.substr(0, 10) + '...' : this.props.userInfo.sign) : ''}
                </Text>
                <Image
                  style={styles.rarrow}
                  source={require('../../assets/images/right-arrow2.png')}
                />
              </View>
            </TouchableOpacity>
            {/* 下方空白处 关闭弹窗 */}
            <TouchableOpacity onPress={() => { this.closepicker(); }}>
              <View style={styles.empty}></View>
            </TouchableOpacity>
          </View>
          {/* 修改资料list开始 */}
          {/* 选择照片的弹窗 */}
          {/* 照片上传成功后弹窗 */}
          <Modal
            visible={this.state.isShow}
            animationType={'fade'}
            // 是否透明默认是不透明 false
            transparent={true}
            // 关闭时调用
            onRequestClose={() => { }}
          >
            <View style={styles.containersuc}>
              <Text style={styles.suc}>{this.state.responsetext}</Text>
            </View>
          </Modal>
          <Modal
            visible={this.state.showMask}
            animationType={'fade'}
            // 是否透明默认是不透明 false
            transparent={true}
            // 关闭时调用
            onRequestClose={() => {
              this.setState({ showMask: false });
            }}
          >
            <View style={styles.bg}>
              <TouchableWithoutFeedback
                onPress={() => this.setState({ showMask: false })}
              >
                <View
                  style={styles.bgstyle}
                />
              </TouchableWithoutFeedback>
              <View style={[styles.container, styles.center]}>
                <View style={[styles.both, styles.center, styles.uppart]}>
                  <TouchableOpacity onPress={this.takePhoto.bind(this)}>
                    <View
                      style={[styles.cancel, styles.center, styles.borderbottom]}
                    >
                      <Text style={styles.photo}>拍照</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={this.onClickChoosePicture.bind(this)}
                  >
                    <View style={[styles.cancel, styles.center, styles.both]}>
                      <Text style={styles.photo}>进入相册</Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({ showMask: false });
                  }}
                >
                  <View style={[styles.both, styles.center, styles.cancel]}>
                    <Text style={styles.photo}>取消</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          {/* 选择照片的弹窗 */}
          {/* 修改成功 */}
        </View>
      </LinearGradient>
    );
  }

  getUserinfo() {
    let query = {
      AuthUserId: this.props.userInfo.id,
      AuthToken: this.props.userInfo.token,
    };
    APIs.getUserInfo(query).then((res) => {
      // console.log('getUserInfoedit------', res)
      this.setState({ userInfo: res });
    });
  }
  // 点击保存按钮
  toSave() {
    console.log('toSave',this.props.userInfo);
    this.save({
      id: this.props.userInfo.id,
      img: this.props.userInfo.img,
      age: this.props.userInfo.age,
      gender: this.props.userInfo.gender,
      AuthUserId: this.props.userInfo.id,
      AuthToken: this.props.userInfo.token,
    });
  }
  // 保存
  save(data = {}) {
  
    APIs.updataUserInfo(data)
      .then((res) => {
        this.setState({ isShow: false });
        //  this.setState({ responsetext: '修改成功', isShow: true });
        this.waring('修改成功');
        DeviceEventEmitter.emit('refresh_my', { dosth: '修改资料_my' });
        //  setTimeout(() => {
        //    this.setState({ isShow: false });
        //  }, 2000);
        console.log('保存后打印', res);
        this.props.updateLogin(this.props.userInfo);
      })
      .catch((err) => {
        this.setState({ isShow: false });
        //  this.setState({ responsetext: '发生错误', isShow: true });
        this.waring('发生错误');
        //  setTimeout(() => {
        //    this.setState({ isShow: false });
        //  }, 2000);
      });
  }
  // 跳转页面
  goTo(param, type) {
    this.closepicker();
    this.props.navigation.navigate(param, {
      params: {
        title: type == 'name' ? '昵称' : '个性签名',
        len: type == 'name' ? 10 : 20,
      },
    });
  }
  // 点击头像选择
  choose() {
    this.closepicker();
    this.setState({ showMask: true }, () => { });
  }
  // 选择相机
  takePhoto() {
    const options = {
      cameraType: 'back', // 前置摄像头
      mediaType: 'photo', // 进行拍照
      maxWidth: 300,
      maxHeight: 300,
    };
    ImagePicker.launchCamera(options, (response) => {
      this.uploadimg(response);
    });
  }
  // 选择相册
  onClickChoosePicture = async () => {
    ImagePicker.launchImageLibrary({
      maxWidth: 300,
      maxHeight: 300,
    }, (response) => {
      this.uploadimg(response);
    });
  };
  // 上传图片
  uploadimg(response) {
    if (response.didCancel) {
      this.setState(
        {
          isShow: true,
          responsetext: '取消操作',
          showMask: false,
        }
      );
      setTimeout(() => {
        this.setState({ isShow: false });
      }, 2000);
    } else {
      this.setState(
        {
          isShow: true,
          responsetext: '上传中',
          showMask: false,
          userInfo: Object.assign({}, this.state.userInfo, { img: 'data:image/png;base64,' + response.data })
        },
        () => {
          this.save({
            id: this.props.route.params.params.id, AuthUserId: this.props.userInfo.id,
            AuthToken: this.props.userInfo.token, img: 'data:image/png;base64,' + response.data
          });
        }
      );
    }
  }
  // 滚轮选择
  topiker(arg) {
    this.setState({ pickermask: true });
    //  let a = render(<Image
    //    source={require('../../assets/images/p-Contacts.png')}
    //    style={styles.profile}
    //  />)
    Picker.init({
      pickerTitleText: arg == 'gender' ? '选择性别' : '选择年龄',
      pickerConfirmBtnText: '确定',
      pickerCancelBtnText: '取消',
      pickerConfirmBtnColor: [71, 95, 123, 1],
      pickerCancelBtnColor: [71, 95, 123, 1],
      pickerBg: [255, 255, 255, 1],
      pickerToolBarBg: [255, 255, 255, 1],
      pickerData:
        arg == 'gender'
          ? ['男', '女']
          : [
            '<18岁',
            '18-23岁',
            '24-28岁',
            '29-33岁',
            '34-38岁',
            '39-43岁',
            '43-48岁',
            '48-53岁',
            '>53岁',
          ],
      selectedValue: arg == 'gender' ? [this.props.userInfo.gender === 1 ? '男' : '女'] : [this.props.userInfo.age],
      onPickerConfirm: (data) => {
        if (arg == 'age') {
          this.props.updateLogin(Object.assign({}, this.props.userInfo, { age: data[0] }));
        } else {
          this.props.updateLogin(Object.assign({}, this.props.userInfo, { gender: data[0] == '男' ? 1 : 2 }));
        }
        this.toSave();
      },
    });
    Picker.show();
  }
  // 关闭选择框
  closepicker() {
    this.setState({ pickermask: false });
    Picker.hide();
  }
  showToast(text, duration = 2) {
    Toast.info(text, duration, enptyFn, false);
  }
  waringTime = Date.now();
  waring = (msg) => {
    if (Date.now() - this.waringTime < 3000) return;
    this.waringTime = Date.now();
    this.showToast(msg);
  }
}

export default connect(mapState, mapDispatch)(Edit);

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: theme.backgroundColor.edit,
  },
  container: {
    position: 'absolute',
    bottom: px(58),
    width: screenWidth,
  },
  page: {
    marginTop: px(38),
    height: screenheight,
  },
  m10: { marginBottom: 10 },
  bgstyle: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    backgroundColor: theme.backgroundColor.edit2,
  },
  uppart: {
    height: px(232),
    marginBottom: px(16),
    width: px(709),
  },
  both: {
    backgroundColor: theme.backgroundColor.white,
    borderRadius: px(20),
    width: px(709),
  },
  cancel: {
    height: px(116),
  },
  list: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomColor: theme.border.color13,
    borderBottomWidth: px(4),
    borderStyle: 'solid',
    paddingTop: px(14),
    paddingBottom: px(14),
    paddingRight: px(57),
    paddingLeft: px(50),
    height: px(105),
    alignItems: 'center',
  },
  last: { borderBottomWidth: 0 },
  profile: {
    width: px(71),
    height: px(71),
    borderRadius: 40,
  },
  listitembox: {
    flex: 1,
  },
  listitem: {
    width: px(120),
    justifyContent: 'space-between',
    flexDirection: 'row'
  },
  font: {
    fontSize: px(24),
    color: theme.text.color13,
  },
  rightFont: {
    color: theme.text.color14,
    fontSize: px(24)
  },
  rarrow: {
    width: px(16),
    height: px(26),
    marginLeft: px(29),
  },
  mr20: {
    marginBottom: px(35),
    backgroundColor: theme.backgroundColor.white,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  borderbottom: {
    width: px(709),
    borderBottomColor: theme.border.color14,
    borderBottomWidth: px(1),
  },
  save: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: px(100),
  },
  containersuc: {
    top: '50%',
    left: '50%',
    marginLeft: px(-85),
    marginTop: px(-30),
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.text.color14,
    borderRadius: px(6),
    width: px(170),
    height: px(60),
  },
  suc: {
    color: theme.text.colorWhite,
  },
  photo: {
    fontSize: px(40),
    color: theme.text.color6
  },
  empty: {
    height: px(753),
    borderColor: theme.text.color35,
    borderStyle: 'solid'
  },
});