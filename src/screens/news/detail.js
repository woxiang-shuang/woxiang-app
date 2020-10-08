import * as React from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  Button,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ScrollView,
  Modal,
  Dimensions,
  Alert,
  RefreshControl,
} from 'react-native';
import { Tabs, Toast, Portal } from '@ant-design/react-native';
import CameraRoll from '@react-native-community/cameraroll';
import RNFS from 'react-native-fs';
import { ShadowBox } from 'react-native-neomorph-shadows';
import { connect } from 'react-redux';
import AppActions from '../../store/actions';
import theme from '../../styles/theme';
import { px } from '../../utils/adapter';
import CardView from 'react-native-cardview';
import APIs from '../../http/APIs';
import ImageViewer from 'react-native-image-zoom-viewer';
import ContentLoader, { Rect } from 'react-content-loader/native';
import cstyle from '../../styles/common';
import { enptyFn } from '../../utils/common';
import NoDataPlaceHolder from '../../components/no-data-placeholder/indexInfo';
import Article from './Article';
import DeviceInfo from 'react-native-device-info';

const mapState = (state) => {
  return {
    getLogin: state.login.login,
  };
};
function showToast(text) {
  Toast.info(text, 1, enptyFn, false);
}
const device = {};
device.DeviceID = DeviceInfo.getUniqueId();
const mapDispatch = {
  updateFooterTabBar: AppActions.updateFooterTabBar,
};
function TimeFormat(e) {
  // 将字符串转换成时间格式
  var timePublish = new Date(e.props);
  var timeNow = new Date();
  var minute = 1000 * 60;
  var hour = minute * 60;
  var day = hour * 24;
  var month = day * 30;
  var diffValue = timeNow - timePublish;
  var diffMonth = diffValue / month;
  var diffWeek = diffValue / (7 * day);
  var diffDay = diffValue / day;
  var diffHour = diffValue / hour;
  var diffMinute = diffValue / minute;
  let result = '';
  const dateNumFun = (num) => (num < 10 ? `0${num}` : num);
  const [Y, M, D, h, m] = [
    //  es6 解构赋值
    timePublish.getFullYear(),
    dateNumFun(timePublish.getMonth() + 1),
    dateNumFun(timePublish.getDate()),
    dateNumFun(timePublish.getHours()),
    dateNumFun(timePublish.getMinutes()),
  ];
  if (diffValue < 0) {
    result = '';
  } else if (diffDay > 3) {
    result = `${M}-${D} ${h}:${m}`;
  } else if (diffDay > 1 && diffDay < 3) {
    result = parseInt(diffDay) + '天前';
  } else if (diffHour > 1) {
    result = parseInt(diffHour) + '小时前';
  } else if (diffMinute > 1) {
    result = parseInt(diffMinute) + '分钟前';
  } else {
    result = '刚发布';
  }
  return <Text style={styles.tbottomitem}>{'球圣体育-' + result}</Text>;
}

function fmtViewCount(timeDATE) {
  if (timeDATE < 10000) {
    return timeDATE;
  } else {
    if (Math.floor(timeDATE / 10000) == timeDATE / 10000) {
      return (timeDATE = timeDATE / 10000 + '万');
    } else if ((timeDATE / 10000).toFixed(2).split('.')[1] == '00') {
      // 如果小数位 某.00....  的情况
      return (timeDATE = (timeDATE / 10000).toFixed(2).split('.')[0] + '万');
    } else {
      return (timeDATE = (timeDATE / 10000).toFixed(2) + '万');
    }
  }
}

function MyContentLoading(props) {
  return Array.from({ length: 8 }).map((n, i) => (
    <View style={theme.skeletonBdB} key={i}>
      <ContentLoader
        height={80}
        width={px(700)}
        speed={2}
        viewBox={`0 0 ${px(700)} 80`}
        backgroundColor={theme.skeletonItemBgColor}
        foregroundColor={theme.skeletonItemForegroundColor}
        {...props}
      >
        <Rect x="15" y="15" rx="4" ry="4" width="130" height="10" />
        <Rect x="155" y="15" rx="3" ry="3" width="130" height="10" />
        <Rect x="295" y="15" rx="3" ry="3" width="90" height="10" />
        <Rect x="15" y="50" rx="3" ry="3" width="90" height="10" />
        <Rect x="115" y="50" rx="3" ry="3" width="60" height="10" />
        <Rect x="185" y="50" rx="3" ry="3" width="200" height="10" />
        <Rect x="15" y="90" rx="3" ry="3" width="130" height="10" />
        <Rect x="160" y="90" rx="3" ry="3" width="120" height="10" />
        <Rect x="290" y="90" rx="3" ry="3" width="95" height="10" />
      </ContentLoader>
    </View>
  ));
}

// 只取先锋体育的内容
function filterContent(item) {
  return item.split('---')[0];
}

// 下方广告位
function Advert(item) {
  return (
    <View>
      <Image
        source={require('../../assets/images/article.png')}
        style={styles.advImg}
      ></Image>
    </View>
  );
}
class NewsDetails extends React.PureComponent {
  iconUnLike = require('../../assets/images/speech-like.png');
  iconLiked = require('../../assets/images/speech-like2.png');
  showsVerticalScrollIndicator = false;
  constructor(props) {
    super(props);
    this.state = {
      detail: {},
      showImageList: false,
      images: [],
      loading: false,
      callbackMsgBox: false,
      callbackMsg: '',
      isLiked: false,
      contentHeight: 450,
      starActive: false,
      isRefreshing: false, // 刷新指示器
      initialEmpty: false, // 缺省指示图
      loadMore: false, // 下滑距离
      isinfo: true, // 区分评论点赞与资讯点赞
    };
  }
  moreHandle() {
    console.log('功能后期上');
  }
  componentDidMount() {
    this.props.updateFooterTabBar({ show: false });
    let article = this.props.route.params.article;
    this.setState({
      detail: article,
      isLiked: article.digg === 1,
      starActive: article.collect === 1,
    });
    //  console.log('componentDidMount article = this.props.route.params.article')
    this.props.navigation.setOptions({
      headerRight: () => {
        return (
          <TouchableOpacity
            onPress={() => {
              this.moreHandle;
            }}
          >
            <View style={styles.iconDot}>
              <Image
                source={require('../../assets/images/icon-dots.png')}
                style={styles.iconDots}
              />
            </View>
          </TouchableOpacity>
        );
      },
    });
  }
  wvOnMessage = (data) => {
    //  console.log('wvOnMessage', data);
    try {
      data = JSON.parse(data || {});
    } catch (e) {
      data = {};
    }
    // data.hasOwnProperty('height')
    if (data.height) {
      data = data < 300 ? 300 : data;
      this.setState({ contentHeight: data.height + 20 });
    } else if (data && data.type === 'image') {
      //  console.log('wvOnMessage imageUrl', data.imageUrl);
      //  this.saveImg(data.imageUrl)
      //  let images = this.state.images.slice();
      //  images.push(data.imageUrl)
      this.setState({ showImageList: true, images: data.imageUrl });
    }
  };
  goMoreInfo() {
    this.props.navigation.navigate('News');
  }
  componentWillUnmount() {
    this.props.updateFooterTabBar({ show: true });
  }
  render() {
    return (
      <View style={styles.pageBorder}>
        {this.state.loading && <MyContentLoading />}
        {this.state.initialEmpty ? (
          <View style={styles.moreInfopage}>
            <NoDataPlaceHolder msg={'抱歉！该资讯不存在！不妨去看看其它资讯'} />
            <TouchableOpacity
              onPress={() => {
                this.goMoreInfo();
              }}
            >
              <Text style={styles.moreInfo}>更多资讯</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <ScrollView 
              style={styles.contaienr} 
              showsVerticalScrollIndicator={this.showsVerticalScrollIndicator}
              //  刷新
              refreshControl={
                <RefreshControl
                  refreshing={this.state.isRefreshing} // 设置为true显示指示器，false：隐藏。
                  onRefresh={this.onRefresh.bind(this)} // 开始刷新时调用
                  tintColor='#273142'// 指示器颜色
                  title='加载中...'// 指示器下显示的文字
                  titleColor='#00ff00'// 指示器下显示的文字的颜色
                  //  colors={['#ff0000', '#00ff00', '#0000ff']}// 指示器颜色，可以多个，循环显示。
                  progressBackgroundColor='#ffffff'// 指示器背景颜色
                />
              }
              onScroll={this.onScroll.bind(this)}
              scrollEventThrottle={50}
            >

              <View style={{ margin: px(20) }}>
                <View style={styles.titlepart}>
                  <Text style={styles.titlepartT}>{this.state.detail.title}</Text>
                  <View style={styles.tbottom}>
                    <TimeFormat props={this.state.detail.createTime}></TimeFormat>
                    <View style={styles.timeWrap}>
                      <Image source={require('../../assets/images/login-eye3.png')} style={styles.iconEye} />
                      <Text style={styles.tbottomitem}>{this.state.detail.countView == null ? 0 : fmtViewCount(this.state.detail.countView)}</Text>
                    </View>
                  </View>
                </View>
                {/* , { height: this.state.contentHeight } */}
                <View style={[styles.main, this.state.detail.content == '<p><br></p>---<p><br></p>---<p><br></p>' ? '' : styles.contentEmpty]}>
                  {this.state.detail.content && 
                    <Article content={filterContent(this.state.detail.content)} onMessage={this.wvOnMessage} />}
                </View>
                <View style={styles.bottompart}>
                  {!this.state.detail.taggings == [] ?
                    <View style={styles.tags}>
                      <Image source={require('../../assets/images/p-speech.png')} style={{ width: px(32), height: px(32), marginRight: px(8) }} />
                      {
                        this.state.detail.taggings && this.state.detail.taggings.map((el, i) => {
                          return (
                            <View style={styles.tag} key={i}>
                              <Text>{el.name}</Text>
                            </View>
                          );
                        })
                      }
                    </View> : null
                  }
                  <View style={styles.clicks}>
                    <TouchableOpacity onPress={() => { this.giveACollectHan(1); }}>
                      <ShadowBox style={styles.clickbox}>
                        {this.state.starActive ? <Image
                          style={styles.clickicon}
                          source={require('../../assets/images/icon-star-active.png')}
                        /> : <Image
                          style={styles.clickicon}
                          source={require('../../assets/images/icon-star.png')}
                        />}
                      </ShadowBox>
                    </TouchableOpacity>

                    <ShadowBox style={styles.clickbox}>
                      <TouchableWithoutFeedback onPress={() => { this.giveThumbHandler(1); }} style={cstyle.flex1}>
                        <Image style={styles.clickicon} source={this.state.isLiked ? this.iconLiked : this.iconUnLike} />
                      </TouchableWithoutFeedback>
                    </ShadowBox>
                    <ShadowBox style={styles.clickbox}>
                      <Image style={[styles.clickicon, styles.transformimg]} source={require('../../assets/images/icon-link.png')} />
                    </ShadowBox>
                  </View>
                </View>
              </View>
              {/* <Advert></Advert> */}
              {/* 评论项 */}
              {/* <CardView
                cardElevation={2}
                cardMaxElevation={2}
                cornerRadius={5}
                style={styles.comment}
              >
                <View style={{ padding: px(20) }}>
                  <View>
                    <Text style={styles.ctitle}>所有评论:120</Text>
                  </View>
                  <View style={[styles.commentitem, styles.row]}>
                    <Image
                      style={styles.commentitemleft}
                      source={require('../../assets/images/article.png')}
                    />
                    <View style={styles.commentitemright}>
                      <View style={[styles.commentitemrighttop, styles.row]}>
                        <View style={styles.row}>
                          <Text style={{ marginRight: px(20) }}>Flipp Erc</Text>
                          <Text style={styles.tbottomitem}>5分钟前</Text>
                        </View>
                        <View style={styles.row}>
                          <Image style={{ width: px(20), height: px(20), marginRight: px(10) }} source={require('../../assets/images/speech-like.png')} />
                          <Text style={[styles.tbottomitem, styles.mr20]}>52</Text>
                          <Image style={{ width: px(20), height: px(20), marginRight: px(10) }} source={require('../../assets/images/speech-bubble.png')} />
                          <Text style={[styles.tbottomitem, styles.mr20]}>300</Text>
                        </View>
                      </View>
                      <View style={styles.commentitemrightbot}>
                        <Text>
                            this is the video,this is the video,this is the video, this
                            is the video,this is the video,
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </CardView> */}

            </ScrollView>
            {/* 图片弹窗  */}
            <Modal visible={this.state.showImageList} transparent={true}>
              <ImageViewer
                onClick={() => { this.setState({ showImageList: false }); }}
                imageUrls={this.state.images}
                menuContext={{ 'saveToLocal': '保存到相册', 'cancel': '取消' }}
                onSave={(url) => this.saveImg(url)}
                backgroundColor='rgba(0,0,0,0.8)'
                style={styles.zindex1}
              />
              {
                this.state.callbackMsgBox ?
                  <View style={styles.callback}>
                    <View style={styles.callbackinnerbox}><Text style={styles.colorW}>{this.state.callbackMsg}</Text></View>
                  </View> : null
              }
            </Modal>
          </>
        )}
      </View>
    );
  }
  onRefresh = () => {
    this.setState({ isRefreshing: true });
    this.getdetails(this.state.detail.id);
  };
  onScroll(event) {
    if (this.state.loadMore) {
      return;
    }
    let y = event.nativeEvent.contentOffset.y; // 垂直滚动距离
    let height = event.nativeEvent.layoutMeasurement.height;
    let contentHeight = event.nativeEvent.contentSize.height;
    if (y + height >= contentHeight - 20) {
      this.setState({
        loadMore: true,
      });
    }
  }
  getdetails(id) {
    APIs.getArticleDetail({ id })
      .then((res) => {
        console.log('infores', res);
        this.setState({ loading: false });
        this.setState({ isRefreshing: false });
        //  状态 0未审核 1上架 2下架 3删除
        if (res.status === 2 || res.status === 3) {
          this.setState({ initialEmpty: true });
          return;
        }
        // console.log('initialEmpty', this.state.initialEmpty)
        this.setState({ detail: res });
      })
      .catch((err) => {
        this.setState({ isRefreshing: false });
        showToast('网络异常，请稍后再试');
      });
  }
  saveImg(url) {
    //  console.log('saveImg url', url);
    this.DownloadImage(url)
      .then((res) => {
        console.log('DownloadImage res ', res);
        this.setState({ callbackMsg: '保存成功', callbackMsgBox: true }, () => {
          setTimeout(() => {
            this.setState({ callbackMsg: '', callbackMsgBox: false });
          }, 1000);
        });
      })
      .catch((err) => {
        console.log('DownloadImage err ', err);
        let msg = '';
        if (err.toString().match('Permission denied')) {
          msg = '请打开存储权限';
        } else {
          msg = '保存失败';
        }

        this.setState({ callbackMsg: msg, callbackMsgBox: true }, () => {
          setTimeout(() => {
            this.setState({ callbackMsg: '', callbackMsgBox: false });
          }, 1000);
        });
      });
  }
  // 下载图片到本地相册中
  DownloadImage = (uri) => {
    if (!uri) return null;
    return new Promise((resolve, reject) => {
      let timestamp = new Date().getTime(); // 获取当前时间错
      let random = String((Math.random() * 1000000) | 0); // 六位随机数
      let dirs =
        Platform.OS === 'ios'
          ? RNFS.LibraryDirectoryPath
          : RNFS.ExternalDirectoryPath; // 外部文件，共享目录的绝对路径（仅限android）
      const downloadDest = `${dirs}/${timestamp + random}.jpg`;
      const formUrl = uri;
      const options = {
        fromUrl: formUrl,
        toFile: downloadDest,
        background: true,
        begin: (res) => {
          //  console.log('begin', res);
          //  console.log('contentLength:', res.contentLength / 1024 / 1024, 'M');
        },
      };
      try {
        const ret = RNFS.downloadFile(options);
        ret.promise
          .then((res) => {
            var promise = CameraRoll.saveToCameraRoll(downloadDest);
            promise
              .then(function (result) {
                resolve(result);
              })
              .catch(function (error) {
                reject(error);
              });
          })
          .catch((err) => {
            reject(new Error(err));
          });
      } catch (e) {
        reject(new Error(e));
      }
    });
  };
  //  点赞
  giveThumbHandler(type) {
    if (this.state.isLiked) return;
    let query = {
      articleId: this.state.detail.id,
      type: type,
      status: 1,
      memberId:
        this.props.getLogin.id === undefined ? '' : this.props.getLogin.id,
      deviceId: device.DeviceID,
    };
    APIs.giveThumb(query).then(
      (res) => {
        showToast('点赞成功');
        this.setState({ isLiked: true });
      },
      (err) => {
        showToast('网络异常,请稍后再试');
      }
    );
  }
  giveACollectHan(type) {
    let query = {
      articleId: this.state.detail.id,
      type: type,
      status: this.state.starActive ? 2 : 1,
      memberId:
        this.props.getLogin.id === undefined ? '' : this.props.getLogin.id,
      deviceId: device.DeviceID,
    };
    APIs.giveACollect(query).then(
      (res) => {
        this.setState({ starActive: !this.state.starActive });
      },
      (err) => {
        showToast('网络异常,请稍后再试');
      }
    );
  }
}
const styles = StyleSheet.create({
  paragragh: {
    fontSize: px(24),
    color: theme.text.color32,
  },
  pageBorder: {
    borderTopWidth: px(2),
    borderTopColor: theme.border.color3,
  },
  timeWrap: { flexDirection: 'row', alignItems: 'center' },
  zindex1: { zIndex: 1 },
  colorW: { color: theme.text.colorWhite },
  sbox: {
    backgroundColor: theme.backgroundColor.sky,
    borderRadius: px(10),
  },
  comment: {
    margin: px(20),
    borderRadius: px(10),
    backgroundColor: theme.backgroundColor.white,
  },
  commentitem: {
    alignItems: 'center',
    paddingTop: px(20),
    paddingBottom: px(20),
  },
  commentitemleft: {
    width: px(100),
    height: px(100),
    borderRadius: px(50),
    marginRight: px(20),
  },
  commentitemright: {
    flexDirection: 'column',
    width: '80%',
  },
  commentitemrighttop: {
    justifyContent: 'space-between',
    marginBottom: px(8),
  },
  commentitemrighttopleft: {},
  commentitemrighttopright: {},
  contaienr: {
    backgroundColor: theme.screenBgColor
  },
  titlepart: {
    padding: px(20),
  },
  titlepartT: {
    fontWeight: 'bold',
    fontSize: px(32),
    color: theme.background.color20,
  },
  tbottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tbottomitem: {
    color: theme.text.color30,
    fontSize: px(20),
  },
  main: {
    paddingBottom: px(30),
  },
  bottompart: {},
  tags: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: px(20),
  },
  tag: {
    paddingTop: px(5),
    paddingBottom: px(5),
    paddingLeft: px(20),
    paddingRight: px(20),
    borderWidth: px(1),
    borderStyle: 'solid',
    borderColor: theme.text.color33,
    backgroundColor: theme.backgroundColor.tag,
    marginRight: px(8),
    textAlign: 'center',
    borderRadius: px(10),
  },
  clicks: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: px(30),
    marginBottom: px(30),
  },
  clickbox: {
    shadowOpacity: 1,
    shadowColor: theme.text.color34,
    shadowRadius: px(10),
    borderRadius: px(50),
    backgroundColor: theme.backgroundColor.white,
    width: px(60),
    height: px(60),
    shadowOffset: { width: px(10), height: px(10) },
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: px(20),
  },
  clickicon: {
    width: px(39),
    height: px(39),
  },
  transformimg: {
    transform: [{ scaleX: -1 }],
  },

  ctitle: {
    color: theme.text.color18,
    fontSize: px(30),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mr20: { marginRight: px(20) },
  mr10: { marginRight: px(10) },
  videobox: {
    height: px(360),
    borderRadius: px(8),
    overflow: 'hidden',
  },
  imgbox: {
    height: px(360),
    borderRadius: px(8),
    overflow: 'hidden',
    marginTop: px(10),
    marginBottom: px(10),
  },
  img: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  callback: {
    position: 'absolute',
    backgroundColor: theme.backgroundColor.transparent,
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9,
  },
  callbackinnerbox: {
    paddingLeft: px(20),
    paddingRight: px(20),
    backgroundColor: theme.backgroundColor.detailInfo,
    height: px(100),
    borderRadius: px(15),
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconEye: {
    width: px(30),
    height: px(20),
    marginRight: px(10),
  },
  iconSkeleton: {
    marginTop: px(100),
    marginLeft: px(200),
  },
  advImg: {
    width: px(710),
    height: px(140),
    marginBottom: px(35),
    marginLeft: px(20),
  },
  iconDot: {},
  iconDots: {
    width: px(40),
    height: px(8),
    marginRight: px(10),
  },
  contentEmpty: {
    minHeight: px(135),
  },
  moreInfopage: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreInfo: {
    width: px(170),
    height: px(60),
    marginTop: px(70),
    textAlign: 'center',
    backgroundColor: theme.button.color,
    color: theme.text.colorWhite,
    lineHeight: px(60),
    borderRadius: px(6),
  },
  noDataBtn: {
    width: px(170),
    height: px(60),
    marginTop: px(30),
    backgroundColor: theme.button.color,
  },
});
export default connect(mapState, mapDispatch)(NewsDetails);
