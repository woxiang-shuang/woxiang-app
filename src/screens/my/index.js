import * as React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ImageBackground,
  Modal,
  DeviceEventEmitter,
  ScrollView,
  Dimensions,
} from 'react-native';
import { connect } from 'react-redux';
import Star from '../../assets/images/svg/star';
import CardView from 'react-native-cardview';
import { px } from '../../utils/adapter';
import APIs from '../../http/APIs';
import { getinit, logout } from '../../http/APIs';
import AppActions from '../../store/actions';
import { Toast } from '@ant-design/react-native';
import { curEvn } from '../../../config';
import { cstyle, theme } from '../../styles';

const mapState = (state) => {
  //   console.log('state.login',state.login.loginInfo);
  return {
    getLogin: state.login.login,
    userInfo: state.login.loginInfo == undefined ? {} : state.login.loginInfo,
  };
};

const mapDispatch = {
  updateLogin: AppActions.updateLogin,
  updateLogout: AppActions.updateLogout
};

class My extends React.Component {
  state;
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.subscription = DeviceEventEmitter.addListener('refresh_my', (v) => {
      this.getUserinfo();    
    });
    // console.log('this.props.userInfo', this.props.userInfo);
  }
  componentWillUnmount() {
    this.subscription.remove();
  }
  evnTriggerCount = 0;
  checkEnv() {
    if (this.evnTriggerCount > 20) {
      this.evnTriggerCount = 0;
      Toast.info('当前环境：' + curEvn);
    } else {
      this.evnTriggerCount++;
    }
  }
  aboutUs = () => {
    this.checkEnv();
  }
  render() {
    return (
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ height: px(600) }}>
            <ImageBackground
              source={require('../../assets/images/bg-b.png')}
              style={styles.bgImg}
            >
              <TouchableOpacity
                onPress={this.goTo.bind(this, 'Edit')}
                style={styles.edit}
              >
                <Image
                  source={require('../../assets/images/p-edit.png')}
                  style={{ width: px(35), height: px(35) }}
                />
              </TouchableOpacity>
              <View
                style={styles.wrapper}
              >
                <View style={styles.topbox}>
                  <TouchableOpacity onPress={this.goTo.bind(this, 'Edit')}>
                    {!this.props.getLogin ||
                      this.props.userInfo.img == undefined ? (
                        <Image
                          source={require('../../assets/images/p-Contacts.png')}
                          style={styles.contact}
                        />
                      ) : (
                        <Image
                          source={{ uri: this.props.userInfo.img }}
                          style={styles.contact}
                        />
                      )}
                  </TouchableOpacity>
                  {!this.props.getLogin ? (
                    <TouchableOpacity onPress={this.goTo.bind(this, 'Login')}>
                      <View style={styles.btn}>
                        <Text style={{ color: theme.text.color6 }}>去登录</Text>
                      </View>
                    </TouchableOpacity>
                  ) : (
                    <Text style={styles.username}>
                      {this.props.userInfo.nickName == undefined
                        ? this.props.userInfo.phone
                        : this.props.userInfo.nickName}
                    </Text>
                  )}
                  <Text style={styles.tips}>
                    {!this.props.getLogin
                      ? '登录后获取更多精彩内容'
                      : this.props.userInfo.sign == undefined
                        ? '此人很懒，没有留下任何信息'
                        : this.props.userInfo.sign}
                  </Text>
                </View>
                <View style={styles.boundery}>
                  <View style={styles.icons}>
                    <Star width={20} height={20} style={styles.m10} />
                    <Text style={styles.number}>0</Text>
                  </View>
                  <View style={styles.icons}>
                    <Image
                      style={styles.icon}
                      source={require('../../assets/images/p-Following.png')}
                    />
                    <Text style={styles.number}>0</Text>
                  </View>
                  <View style={styles.icons}>
                    <Image
                      style={styles.icon}
                      source={require('../../assets/images/p-user.png')}
                    />
                    <Text style={styles.number}>0</Text>
                  </View>
                </View>
              </View>

            </ImageBackground>
          </View>
          {/* 主体部分 */}
          <CardView
            cardElevation={2}
            cardMaxElevation={2}
            cornerRadius={5}
            style={body.box}
          >
            <TouchableOpacity>
              <View style={body.items}>
                <View style={body.item}>
                  <Image
                    style={body.img}
                    source={require('../../assets/images/p-01.png')}
                  />
                  <Text style={styles.routeName}>我的足迹</Text>
                </View>
                <Image
                  source={require('../../assets/images/right-arrow2.png')}
                  style={body.rarrow}
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity>
              <View style={[body.items, body.middle]}>
                <View style={body.item}>
                  <Image
                    style={body.img}
                    source={require('../../assets/images/p-02.png')}
                  />
                  <Text style={styles.routeName}>我的信息</Text>
                </View>
                <Image
                  source={require('../../assets/images/right-arrow2.png')}
                  style={body.rarrow}
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity>
              <View style={body.items}>
                <View style={body.item}>
                  <Image
                    style={body.img}
                    source={require('../../assets/images/p-03.png')}
                  />
                  <Text style={styles.routeName}>我的空间</Text>
                </View>
                <Image
                  source={require('../../assets/images/right-arrow2.png')}
                  style={body.rarrow}
                />
              </View>
            </TouchableOpacity>
          </CardView>
          <CardView
            cardElevation={2}
            cardMaxElevation={2}
            cornerRadius={5}
            style={[body.box, styles.mgBottom50]}
          >
            <TouchableOpacity>
              <View style={body.items}>
                <View style={body.item}>
                  <Image
                    style={body.img}
                    source={require('../../assets/images/p-04.png')}
                  />
                  <Text style={styles.routeName}>意见反馈</Text>
                </View>
                <Image
                  source={require('../../assets/images/right-arrow2.png')}
                  style={body.rarrow}
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { }}>
              <View style={[body.items, body.middle]}>
                <View style={body.item}>
                  <Image
                    style={body.img}
                    source={require('../../assets/images/p-05.png')}
                  />
                  <Text style={styles.routeName}>设&emsp;&emsp;置</Text>
                </View>
                <Image
                  source={require('../../assets/images/right-arrow2.png')}
                  style={body.rarrow}
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.aboutUs}>
              <View style={body.items}>
                <View style={body.item}>
                  <Image
                    style={body.img}
                    source={require('../../assets/images/p-06.png')}
                  />
                  <Text style={styles.routeName}>关于我们</Text>
                </View>
                <Image
                  source={require('../../assets/images/right-arrow2.png')}
                  style={body.rarrow}
                />
              </View>
            </TouchableOpacity>
          </CardView>
        </ScrollView>
      </View>
    );
  }

  goTo(param) {
    this.props.navigation.navigate(this.props.getLogin ? param : 'Login', {
      params: {
        id: this.props.userInfo.id,
        from: 'my'
      },
    });
  }
  getUserinfo() {
    console.log('我的页面---获取用户数据');
    let query = {
      AuthUserId:this.props.userInfo.id,
      AuthToken:this.props.userInfo.token,
    };
    APIs.getUserInfo(query).then((res) => {
      console.log('getUserInfomy------', res);
      this.props.updateLogin(res);
    },err =>{
      console.log('my的报错',err);
    });
  }
  // 退出登录
  logout(id) {
    let query = {
      id
    };
    getinit([logout, query]).then(res => {
      Toast.info(res.message);
      this.props.updateLogout({});
    }, err => {
      Toast.info(err.message);
    });
  }
}

const body = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: theme.screenPaddingBottom,
  },
  box: {
    margin: px(20),
    marginTop: 10,
    backgroundColor: theme.backgroundColor.white,
    borderRadius: 10,
  },
  items: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: px(25),
  },
  img: {
    width: px(50),
    height: px(51),
    marginRight: px(22),
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  rarrow: {
    width: px(16),
    height: px(26),
  },
  middle: {
    borderTopColor: theme.border.color13,
    borderTopWidth: px(1),
    borderStyle: 'solid',
    borderBottomColor: theme.border.color13,
    borderBottomWidth: px(1),
  },
});
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.screenBgColor,
    paddingBottom: theme.screenPaddingBottom
  },
  username: {
    height: px(36),
    top: -20,
    fontSize: px(30),
  },
  bgImg: { flex: 1, height: px(500) },

  wrapper: {
    height: px(450),
    margin: px(20),
    marginTop: 54,
    backgroundColor: theme.backgroundColor.white,
    borderRadius: 10,
  },
  edit: {
    width: px(50),
    height: px(50),
    position: 'absolute',
    top: px(20),
    right: px(20),
  },
  topbox: {
    alignItems: 'center',
  },
  contact: {
    width: px(149),
    height: px(149),
    top: px(-60),
    borderRadius: px(500),
  },
  btn: {
    top: -20,
    width: px(172),
    height: px(62),
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: theme.text.color6,
    borderRadius: px(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
  tips: {
    top: -10,
    color: theme.text.color29,
  },
  icons: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: px(40),
    height: px(40),
    resizeMode: 'contain',
    marginBottom: 10,
  },
  boundery: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 15,
    paddingTop: 8,
    borderTopColor: theme.border.color13,
    borderTopWidth: 1,
    alignItems: 'center',
  },
  number: {
    alignItems: 'center',
  },
  alertcontainer: {
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
  mgBottom50: {
    marginBottom: px(50)
  }
});

export default connect(mapState, mapDispatch)(My);
