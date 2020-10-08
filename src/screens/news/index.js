import * as React from 'react';
import {
  Platform,
  Image,
  StyleSheet,
  Text,
  View,
  ScrollView,
  DeviceEventEmitter,
  Dimensions,
  RefreshControl
} from 'react-native';
import { Tabs, Toast, Portal } from '@ant-design/react-native';
import ContentLoader, { Rect } from 'react-content-loader/native';
import { connect } from 'react-redux';
import CardView from 'react-native-cardview';
import LinearGradient from 'react-native-linear-gradient';
import Orientation from 'react-native-orientation';
import DeviceInfo from 'react-native-device-info';

import AppActions from '../../store/actions';
import {SetHandWatch} from '../../components/handWatch';
import Header from './header';
import theme from '../../styles/theme';
import { px, winHeight, winWidth } from '../../utils/adapter';
import APIs from '../../http/APIs';
import BackTop from '../../components/back-top';
import NoDataPlaceHolder from '../../components/no-data-placeholder';
import NetWorkError from '../../components/network-error'; // 数据接口加载失败
import NoInternet from '../../components/no-internet'; // 没有网络
import { cstyle } from '../../styles';
import { enptyFn } from '../../utils/common';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import {OffOutNews} from '../../utils/constant';
import SwiperView from './SwiperView';
// import dynamicImport from '../../utils/dynamicImport';
function showToast(text) {
  Toast.info(text, 1, enptyFn, false);
}
const mapState = (state) => {
  return {
    getLogin: state.login.login,
    netStatus: state.netInfoModel.netStatus,
    dataError: state.netInfoModel.dataError
  };
};
const viewShow = (thisId,nowId)=>{
  if(nowId - thisId  < 30 && nowId - thisId > -30) {
    return true;
  }
  return false;
};
const device = {};
device.DeviceID = DeviceInfo.getUniqueId();
const screenHeight = Dimensions.get('window').height;
const mapDispatch = {
  updataDataError: AppActions.updataDataError
};
class Types extends React.PureComponent {
  imageArticle = require('../../assets/images/article.png');
  presentState = true;
  state = {
    urls: null
  };
  onPressPlayButton = (urls) => {
    this.props.navigation.navigate('VideoPlayer', { urls });
  };
  cpt = {
    component:this,
    onPanResponderRelease:(_,gestureState)=>{
      if (gestureState.dx < 5 && gestureState.dx > -5 && gestureState.dy < 5 && gestureState.dy > -5) {
        let {urls} = this.state;
        this.onPressPlayButton(urls);
      }
    }
  };

  render() {
    let tempArray = this.props.props.filter((cur) => {
      return cur.clientSide == 1;
    });
    if (tempArray.length == 0) {
      return <Text></Text>;
    }
    for (let i = 0; i < tempArray.length; i++) {
      let urls = {
        mp4url: tempArray[i].coverNrl,
        coverimg:
          tempArray[i].firstPicture == null ? '' : tempArray[i].firstPicture,
        id: tempArray[i].id,
      };
      if (tempArray[i].format == 1) {
        // 视频
        return (
          <View style={styles.imgbox}>
            <Image
              style={styles.coverImg}
              resizeMode={'cover'}
              source={urls.coverimg === '' ? this.imageArticle : {uri: urls.coverimg}}
            />
            <View style={styles.palyBox} >
              <TouchableWithoutFeedback onPressIn={()=>{
                this.setState({
                  urls: urls
                });
              }} onPress={()=>{
                this.onPressPlayButton(urls);
              }}>
                <View {...SetHandWatch(this.cpt)}>
                  <Image
                    style={styles.playButton}
                    source={require('../../assets/images/icon-play.png')}
                  />
                </View>
              </TouchableWithoutFeedback>
            </View>
          </View>
        );
      } else {
        if (tempArray.length == 3) {
          return (
            <View style={styles.timgbox}>
              <Image
                style={styles.threeimg}
                source={{ uri: tempArray[0].coverNrl }}
              ></Image>
              <Image
                style={styles.threeimg}
                source={{ uri: tempArray[1].coverNrl }}
              ></Image>
              <Image
                style={styles.threeimg}
                source={{ uri: tempArray[2].coverNrl }}
              ></Image>
            </View>
          );
        } else {
          return (
            <View style={styles.timgbox}>
              <Image
                style={styles.timg}
                source={{ uri: tempArray[0].coverNrl }}
              ></Image>
              <Image
                style={styles.timg}
                source={{ uri: tempArray[1].coverNrl }}
              ></Image>
            </View>
          );
        }
      }
    }
  }
}
function TimeFormat(e) {
  // 将字符串转换成时间格式
  let timePublish = new Date(e.props);
  let timeNow = new Date();
  let minute = 1000 * 60;
  let hour = minute * 60;
  let day = hour * 24;
  let month = day * 30;
  let diffValue = timeNow - timePublish;
  let diffDay = diffValue / day;
  let diffHour = diffValue / hour;
  let diffMinute = diffValue / minute;
  let result = '';
  const dateNumFun = (num) => num < 10 ? `0${num}` : num;
  const [Y, M, D, h, m] = [    //  es6 解构赋值
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
  return (
    <Text style={[styles.lbleft, styles.lbcolor]}>{'球圣体育-' + result}</Text>
  );
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
        height={110}
        width={px(700)}
        speed={2}
        viewBox={`0 0 ${px(700)} 110`}
        backgroundColor={theme.skeletonItemBgColor}
        foregroundColor={theme.skeletonItemForegroundColor}
        {...props}
      >
        <Rect x="5" y="15" rx="4" ry="4" width="160" height="10" />
        <Rect x="195" y="15" rx="4" ry="4" width="140" height="80" />
        <Rect x="5" y="35" rx="4" ry="4" width="160" height="10" />
        <Rect x="5" y="55" rx="4" ry="4" width="160" height="10" />
        {/* 第四行 */}
        <Rect x="5" y="75" rx="4" ry="4" width="50" height="10" />
        <Rect x="65" y="75" rx="4" ry="4" width="50" height="10" />
        {/* <Svg width='100' height='100'> */}
        {/* <Image x='75' y='75' source={require('../../assets/images/login-eye3.png') } style={[styles.iconEye,styles.iconSkeleton]} /> */}
        {/* </Svg> */}
        <Rect x="135" y="75" rx="4" ry="4" width="30" height="10" />
      </ContentLoader>
    </View>
  ));
}
//  提取轮播数据
function concatArray(arr) {
  let newArr = [];
  for (let i = 0; i < arr.length; i++) {
    newArr = newArr.concat(arr[i]);
  }
  return newArr.filter((item) => {
    return item.clientSide == 1;
  });
}
class News extends React.Component {
  state;
  scrollview;
  showsVerticalScrollIndicator = false;
  presentState = true; // 判断是否是滑动
  statusTabsIndex = null;
  cpt = {
    component:this,
    onPanResponderRelease:(_,gestureState)=>{
      if (gestureState.dx < 5 && gestureState.dx > -5 && gestureState.dy < 5 && gestureState.dy > -5) {
        this.gotoDetail(this.state.gotoDetailID);
      }
    }
  };
  constructor(props) {
    super(props);
    this.state = {
      page: 0,
      statusTabs: [],// tab栏
      loading: false,
      datalist: [],
      paused: false,
      modalVisible: true,
      loadMore: false,
      curPageInfo: {},// 当前tab信息
      curpage: 0,
      showBackTop: false,
      initialEmpty: false, // 初始状态发现没有数据
      canShowNoMoreData: true,
      dataSwiper: [],// 轮播数据
      bannerFlag: true,
      timeout: false,// 是否网络信号差
      isLandscape: false,// 是否横屏
      isHot: true,// 是否显示假的热门 字 
      showTab: false, // 是否渲染出了tab栏
      isRefreshing: false, // 刷新指示器
      paramsData: {},// 存储刷新数据,
      gotoDetailID:null,
      thisIndex:1,
      listDataError: false // 列表数据错误控制器，默认是不错误
    };
  }

  componentDidMount() {
    // Orientation.addOrientationListener(this._orientationDidChange);
    this.subscription = DeviceEventEmitter.addListener(
      'thisIdStopPlaying',
      (v) => {
        if(v === OffOutNews.OFF_OUT_NEWS) {
          this.init();
          return ;
        }
        this.spreadId(v);
      }
    );
    if (this.props.navigation.isFocused()) {
      this.props.navigation.addListener('focus', (e) => {
        if (this.state.statusTabs.length === 0) {
          this.navBarTabsHandler();
        } else if (this.state.datalist.length === 0 && !this.initialEmpty) {
          this.onRefresh();
        }
      });
    }
  }
  // _orientationDidChange = (orientation) => {
  //   if (orientation === 'LANDSCAPE') {
  //     console.log('横屏');
  //   } else {
  //     console.log('竖屏');
  //   }
  // }
  componentWillUnmount() {
    this.subscription.remove();
  }
  init=async ()=>{
    const initData = {
      loading : false,
      statusTabs : [],
    };
    await this.setState({
      ...initData
    });
  }
  spreadId(v) {
    DeviceEventEmitter.emit('getThisId', v);
  }
  screenHeight = winHeight;
  scrollViewLayoutHandler = (event) => {
    this.screenHeight = event?.nativeEvent?.layout?.height || winHeight;
    //  console.log('scrollViewLayoutHandler=', event?.nativeEvent?.layout)
  }
  viewLayoutHandler = (event) => {
    // let { width, height } = Dimensions.get('window');
    // if (height > width) {
    //   this.isLandscape = false;
    //   this.setState({ isLandscape: false });
    //   console.log('资讯列表不横屏',width,height);
    // } else {
    //   this.isLandscape = true;
    //   this.setState({ isLandscape: true });
    //   console.log('资讯列表横屏',width,height);
    // }
    // console.log('viewLayoutHandler=', event?.nativeEvent?.layout?.height,)
    // this.setState({ canShowNoMoreData: event?.nativeEvent?.layout?.height > this.screenHeight });
  }
  onRefresh = () => {
    this.setState({ isRefreshing: true, timeout: false });
    this.getByCatsgoryId(this.state.paramsData, 'fresh');
  };
  
  render() {
    const { thisIndex, listDataError } = this.state;
    const { dataError, netStatus } = this.props;
    return (
      <View style={[styles.container, cstyle.flex1, styles.pageBorder]}>
        {dataError ? netStatus ? <NetWorkError onPress={this.onFresh} /> : <NoInternet /> : <>
          {/* {this.state.showTab ? <TouchableWithoutFeedback onPress={() => { this.fakeHot({ title: '热门', index: 0 }); }} >
            <Text style={[styles.cover, this.state.isHot ? styles.coverActive : styles.coverNoActive]} >热门</Text>
          </TouchableWithoutFeedback> : null} */}
          {this.state.statusTabs && this.state.statusTabs.length > 0 &&
            <Tabs
              tabs={this.state.statusTabs}
              tabBarBackgroundColor={theme.header.backgroundColor}
              tabBarInactiveTextColor={theme.text.color9}
              tabBarActiveTextColor={theme.text.color36}
              tabBarUnderlineStyle={theme.text.color36}
              onChange={this.tabHandler}
              page={this.state.page} 
              animated={Platform.OS === 'android' ? false : true}
            >
            
              {this.state.statusTabs && this.state.statusTabs.map((tab, index) => (
                tab.index === this.state.page ?
                  <LinearGradient colors={['#FBFDFF', '#E8EFFC']} locations={[0.1, 1]} style={cstyle.flex1} key={tab.index}>
                    <ScrollView style={cstyle.flex1}
                      //  刷新
                      refreshControl={
                        <RefreshControl
                          refreshing={false} // 设置为true显示指示器，false：隐藏。
                          onRefresh={this.onRefresh.bind(this)} // 开始刷新时调用
                          tintColor='#273142'// 指示器颜色
                          title='加载中...'// 指示器下显示的文字
                          // titleColor='#00ff00'// 指示器下显示的文字的颜色
                          //  colors={['#ff0000', '#00ff00', '#0000ff']}// 指示器颜色，可以多个，循环显示。
                          progressBackgroundColor='#ffffff'// 指示器背景颜色
                        />
                      }
                      onScroll={this._onScroll.bind(this)}
                      scrollEventThrottle={50}
                      ref={(r) => (this.scrollview = r)}
                      showsVerticalScrollIndicator={this.showsVerticalScrollIndicator}
                      onLayout={this.scrollViewLayoutHandler}
                      onMomentumScrollBegin={this.scrollStart}
                      onMomentumScrollEnd={this.scrollEnd}
                    >
                      <View onLayout={this.viewLayoutHandler}>
                        {this.state.loading && <MyContentLoading />}
                        
                        {this.state.initialEmpty ? (
                          <NoDataPlaceHolder msg={'暂无相关资讯'} />
                        ) : (
                          listDataError ? netStatus ? <NetWorkError onPress={this.onFresh} /> : <NoInternet /> : <>
                            {this.state.bannerFlag ? 
                              <SwiperView data={this.state.dataSwiper} gotoDetail={this.gotoDetail} />
                              : null}
                            
                            {
                              this.state.datalist && this.state.datalist.map((item, index) => {

                                let covers = item.covers.filter((el) => {
                                  return parseInt(el.clientSide, 10) == 1;
                                });

                                // 如果是视频或者图片超过一张
                                if (covers.length != 1 || covers[0].format == 1) {
                                  return (
                                    <View key={item.id} >
                                      <CardView
                                        cardElevation={2}
                                        cardMaxElevation={2}
                                        cornerRadius={5}
                                        cornerOverlap={true}
                                        style={styles.cardViewStyle}
                                        key={item.id}
                                      >
                                        <TouchableWithoutFeedback onPressIn={()=>{
                                          this.setState({
                                            gotoDetailID:item.id,
                                            thisIndex:index
                                          });
                                        }} onPress={()=>{
                                          this.gotoDetail(item.id);
                                        }}>
                                          <View style={styles.listitem} {...SetHandWatch(this.cpt)}>
                                            <Text style={[styles.listtitle, item.isTop === 1 ? styles.pdl40 : {}]} numberOfLines={3}>{item.title}</Text>
                                            <Types props={item.covers} navigation={this.props.navigation}></Types>
                                            <View style={styles.listbottom}>
                                              <TimeFormat props={item.createTime}></TimeFormat>
                                              <View style={styles.see}>
                                                {viewShow(thisIndex,index) && <Image source={require('../../assets/images/login-eye3.png')} style={styles.iconEye} />}
                                                <Text style={[styles.lbright, styles.lbcolor]}>{fmtViewCount(item.countView)}</Text>
                                              </View>
                                            </View>
                                          </View>
                                        </TouchableWithoutFeedback>
                                      </CardView>
                                    </View>
                                  );
                                } else {
                                  // 图片为1张的时候
                                  return (
                                    <View key={item.id}>
                                      <CardView
                                        cardElevation={2}
                                        cardMaxElevation={2}
                                        cornerRadius={5}
                                        style={styles.cardViewStyle}
                                        key={item.id}
                                      >
                                        <TouchableWithoutFeedback onPressIn={()=>{
                                          this.setState({
                                            gotoDetailID:item.id,
                                            thisIndex:index
                                          });
                                        }} onPress={()=>{
                                          this.gotoDetail(item.id);
                                        }}>
                                          <View style={[styles.listitem, styles.lrpart]} {...SetHandWatch(this.cpt)}>
                                            <View style={styles.left}>
                                              <Text style={[styles.ltitle, item.isTop === 1 ? styles.pdl40 : {}]} numberOfLines={3}>{item.title}</Text>
                                              <View style={styles.lbottom}>
                                                <TimeFormat props={item.createTime}></TimeFormat>
                                                <View style={styles.see}>
                                                  {viewShow(thisIndex,index) && <Image source={require('../../assets/images/login-eye3.png')} style={styles.iconEye} /> }
                                                  <Text style={[styles.lbright, styles.lbcolor]}> {fmtViewCount(item.countView)}</Text>
                                                </View>
                                              </View>
                                            </View>
                                            <View style={styles.right}>
                                              {viewShow(thisIndex,index) && <Image style={styles.imgStyle} source={{ uri: covers[0].coverNrl }} />}
                                            </View>
                                          </View>
                                        </TouchableWithoutFeedback>
                                      </CardView>
                                    </View>
                                  );
                                }
                              })
                            }
                          </>
                        )}
                        <Text style={styles.loadmore}>
                          { !this.state.canShowNoMoreData ? '没有更多数据了...' : ''}
                        </Text>
                        {/* <Text style={styles.seat} ></Text> */}
                      </View>
                    </ScrollView>
                  </LinearGradient>
                  : <View key={tab.index}></View>
              ))}
            </Tabs>
          }
          <BackTop
            style={styles.backToTopStyle}
            show={this.state.showBackTop}
            onPress={this.goBackToTop.bind(this)}
          />
        </>}
      </View>
    );
  }
  getByCatsgoryIdLoadKey = null;

  //  tab栏切换
  tabHandler = (tabs, type) => {
    if (this.statusTabsIndex === tabs.index) return;
    this.statusTabsIndex = tabs.index;
    this.setState({ canShowNoMoreData: true });
    if (tabs.title == '热门') {
      this.setState({
        isHot: true
      });
    } else {
      this.setState({
        isHot: false
      });
    }
    if (!tabs || (type && tabs.index === this.state.page)) return;// 加载更多的时候
    this.setState({
      curpage: 0,
      page: tabs.index,
      loading: type !== 'loadmore',
      showBackTop: false,
      curPageInfo: tabs,
      paramsData: tabs,
      thisIndex:1,
      listDataError: false
    }, () => {
      this.getByCatsgoryId(tabs, type);
    });
  }
  
  // 加载更多
  moreTabHandler(tabs, type) {
    if (!tabs) return;
    const {
      netStatus
    } = this.props;
    if(!netStatus) {
      Toast.offline('网络异常，请稍后再试');
      return false;
    }
    this.setState({
      curpage: this.state.curpage + 1
    }, () => {
      this.getByCatsgoryId(tabs, type);
    });
  }
  // 断网重连
  onFresh = () => {
    this.setState({ loading: true, timeout: false });
    const {updataDataError} = this.props;
    updataDataError(false);
    if(this.state.statusTabs.length === 0) {
      this.navBarTabsHandler();
    } else {
      this.getByCatsgoryId(this.state.paramsData, 'fresh');
    }
  }
  // 假热门事件
  fakeHot(tabs, type) {
    this.setState({
      page: 0
    });
    this.getByCatsgoryId(tabs, type);
  }
  getByCatsgoryId(tabs, type) {
    Portal.remove(this.getByCatsgoryIdLoadKey);
    // 防止加载更多的时候 出现骨架屏
    if (type == 'loadmore') {
      this.setState({ loading: false });
    }
    if (!(type == 'fresh')) {
      this.getByCatsgoryIdLoadKey = Toast.loading('加载数据中...', 5);
    }
    // console.log('type',type);
    //  如果并没有id字段，代表请求热门
    let params = tabs.id != undefined
      ? { 'clientSide': 1, 'articleCatsgoryId': tabs.id, 'size': 15, 'page': this.state.curpage, }
      : { 'clientSide': 1, 'isOffHot': 1, 'size': 15, 'page': this.state.curpage, };
    // 存储刷新数据
    APIs.getByCatsgoryId(params).then((res) => {
      // console.log('params-----', params, res);
      this.setState({ isRefreshing: false });// 隐藏刷新显示器
      this.getByCatsgoryIdLoadKey && Portal.remove(this.getByCatsgoryIdLoadKey);
      this.setState({ loading: false });// 隐藏骨架屏
      if (tabs.index !== this.state.page) return;
      //  过虑下架、删除
      if (res.content && res.content.length > 0) {
        res.content = res.content.filter(item => item.status !== 2 && item.status !== 3);
      }
      //  根据请求类型对数组的数据进行修改
      if (type == 'loadmore') {
        //  console.log('getByCatsgoryId  loadmore res ', res.content);
        let datalist = this.state.datalist.slice(0);
        datalist.push(...res.content);
        this.setState({ datalist, initialEmpty: false });
        if (res.content.length == 15) {
          this.setState({ canShowNoMoreData: true });
        } else {
          this.setState({ canShowNoMoreData: false });
        }
        //   this.setState({ loadMore: false })
      } else {
        if (res.content.length == 0) {
          this.setState({ timeout: false, datalist: [], dataSwiper: [] });
          this.setState({ initialEmpty: true });
        } else {
          //  console.log('res.content',res.content);
          this.setState({ datalist: res.content.slice(res.bannerNumber), initialEmpty: false });
          if (res.bannerNumber == 0) {
            this.setState({ bannerFlag: false });
          } else {
            this.setState({ bannerFlag: true });
            //  截取banner数据,用作轮播
            let dataSwiper = res.content.slice(0, res.bannerNumber).map(item => {
              if (item.covers.length > 0) {
                return item.covers[0];
              }
            });
            dataSwiper = dataSwiper.filter(res => { return res != undefined; });
            // console.log('轮播数据', dataSwiper);
            // 获取轮播数据,如果后端传来的cover为空 bannerNum 却为1的情况
            if (dataSwiper == []) {
              this.setState({ bannerFlag: false });
            } else {
              dataSwiper = concatArray(dataSwiper);
            }

            this.setState({ dataSwiper: dataSwiper });
            // console.log('dataSwiper', dataSwiper, res);
          }

        }
      }
      //  如果数据依旧充足，那么可以继续触发加载更多动作,否则显示没有更多数据
      if (res.content.length >= 15) {
        this.setState({ loadMore: false });
      }
    })
      .catch((err) => {
        const { datalist } = this.state;
        this.getByCatsgoryIdLoadKey && Portal.remove(this.getByCatsgoryIdLoadKey);
        // 网络异常时 清空上次列表残留数据
        this.setState({ loading: false, isRefreshing: false, listDataError: datalist.length === 0 ? true : false });
        // this.setState({ loading: false, timeout: true, datalist: [], dataSwiper: [] });
        // console.log('err', err);
        showToast('网络异常，请稍后再试');
      });
  }


  // 获取tab栏
  navBarTabsHandler() {
    // let key = Toast.loading('加载数据中...', 5, enptyFn, false);
    APIs.getTypesById()
      .then((res) => {
        let propt = [{ title: '热门', index: 0, }];
        res.content.forEach((element, index) => {
          propt.push({ title: element.name, index: index + 1, id: element.id });
        });
        this.setState({
          showTab: true,
          statusTabs: propt,
          curPageInfo: Object.assign({}, this.state.curPageInfo, propt[0]),
          // curPageInfo: Object.assign({}, this.state.curPageInfo),
        });
      })
      .catch((err) => {
        const {updataDataError} = this.props;
        updataDataError(true);
        this.setState({ initialEmpty: true, showTab: false, timeout: true, loading: false });
        // showToast('网络异常，请稍后再试');
      })
      .finally(() => {
        // Portal.remove(key);
      });
  }

  //  下拉加载更多功能
  _onScroll(event) {
    if (event?.nativeEvent) {
      const y = event.nativeEvent.contentOffset?.y;
      const height = event.nativeEvent.layoutMeasurement?.height;
      const contentHeight = event.nativeEvent.contentSize?.height;

      if (event?.nativeEvent) {
        let canShowBackTop = y + height >= height * 3;
        if (this.state.showBackTop && !canShowBackTop) {
          this.setState({ showBackTop: false });
        }
      }
      if (y + height >= contentHeight - 50 && !this.state.loadMore) {
        this.setState({
          loadMore: true,
        });
        this.moreTabHandler(this.state.curPageInfo, 'loadmore');
      }
    }
  }
  // 回到顶部按钮 隐藏
  scrollStart = (e) => {
    if (e?.nativeEvent) {
      if (e.nativeEvent?.velocity?.y >= 3 || e.nativeEvent?.velocity?.y <= -3) {
        this.setState({ showBackTop: false });
      }
    }
  };
  // 回到顶部按钮 显示
  scrollEnd = (e) => {
    if (e?.nativeEvent) {
      let canShowBackTop =
        e.nativeEvent?.contentOffset?.y +
        e.nativeEvent?.layoutMeasurement?.height >=
        e.nativeEvent?.layoutMeasurement?.height * 3;
      if (!this.state.showBackTop && canShowBackTop) {
        this.setState({ showBackTop: true });
      }
    }
  };
  // 回到顶部
  async goBackToTop() {
    await  this.scrollview.scrollTo({ y: 0 });
    await this.setState({
      thisIndex:1
    });
  }
  // 跳转详情页
  gotoDetail = (id) => {
    let query = {
      id,
      memberId: this.props.getLogin.id === undefined ? '' : this.props.getLogin.id,
      deviceId: device.DeviceID
    };
    // console.log('咨询进详情',query);
    APIs.getArticleDetail(query).then(res => {
      // console.log('咨询进详情', query, res);
      if (res) {
        this.updateNewsItem(res);
        //  状态 0未审核 1上架 2下架 3删除
        if (res.status === 2 || res.status === 3) {
          Toast.info('该资讯不存在', 3, null, false);
          return;
        }
      }
      this.props.navigation.navigate('NewsDetails', { id, article: res });
    }, err => {
      console.log(query, err);
      showToast('网络异常，请稍后再试');
    }
    );
  }
  updateNewsItem(data) {
    let datalist = this.state.datalist;
    for (let i = 0; i < datalist.length; i++) {
      if (datalist[i].id === data.id) {
        datalist[i].countView = data.countView;
        break;
      }
    }
    this.setState({ datalist });
  }
}

const styles = StyleSheet.create({
  container: {
    // margin: px(20),
    paddingBottom: theme.screenPaddingBottom,
  },
  pageBorder: {
    borderTopWidth: px(2),
    borderTopColor: theme.border.color3,
  },
  cover: {
    fontSize: px(32),
    width: '20%',
    textAlign: 'center',
    position: 'absolute',
    borderStyle: 'solid',
    zIndex: 999,
    height: px(87),
    lineHeight: px(87),
    backgroundColor: theme.header.backgroundColor,
  },
  coverActive: {
    borderBottomWidth: px(4),
    color: theme.text.color36,
    borderBottomColor: theme.background.color12,
  },
  coverNoActive: {
    borderBottomWidth: px(0.5),
    color: theme.text.color9,
    borderBottomColor: theme.border.color3,
  },
  dN: {
    display: 'none',
    zIndex: 0
  },
  listitem: {
    backgroundColor: theme.backgroundColor.white,
    borderRadius: px(20),
    padding: px(20),
  },
  listtitle: {
    color: theme.text.color31,
    marginBottom: px(10),
  },
  imgbox: {
    borderRadius: px(10),
    overflow: 'hidden',
    height: px(270),
    position: 'relative',
  },
  palyBox: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10
  },
  playButton: {
    width: px(50),
    height: px(50),
  },
  timgbox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timg: {
    width: '49%',
    height: px(190),
    borderRadius: px(10),
  },
  threeimg: {
    width: '32%',
    height: px(150),
    borderRadius: px(10),
  },
  img: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  listbottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: px(14),
  },
  lbcolor: {
    color: theme.text.color30,
  },
  see: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: px(20),
  },
  lrpart: {
    flexDirection: 'row',
  },
  rimg: {
    height: px(200),
  },
  left: {
    width: '49%',
  },
  ltitle: {
    height: px(152),
  },
  lbottom: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    //  borderStyle: 'dashed',
    //  borderWidth: 1,
  },
  right: {
    width: '49%',
    marginLeft: px(8),
    height: px(200),
    borderRadius: px(10),
    overflow: 'hidden',
  },
  lbleft: {
    fontSize: px(20),
  },
  lbright: {
    fontSize: px(20),
    marginLeft: px(-6),
  },
  imgStyle: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  playbtn: {
    width: px(50),
    height: px(50),
  },
  loadmore: {
    marginTop: px(30),
    marginBottom: px(50),
    textAlign: 'center',
    color: theme.text.color8,
  },
  goTop: {
    position: 'absolute',
    bottom: px(screenHeight),
    zIndex: 9999999999,
    right: 0,
  },
  emptyList: {
    marginTop: '40%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconEye: {
    width: px(30),
    height: px(20),
    marginRight: px(10),
  },
  cardViewStyle: {
    marginTop: px(11),
    marginLeft: px(20),
    marginRight: px(20),
  },
  seat: {
    marginTop: px(8),
    marginLeft: px(20),
    marginRight: px(20),
    height: px(30)
  },
  backToTopStyle: {
    bottom: px(150),
  },
  iconTopWp: {
    width: px(44),
    height: px(52),
    position: 'absolute',
    top: px(12),
    left: px(30),
    backgroundColor: theme.backgroundColor.black,
  },
  iconTop: {
    width: px(44),
    height: px(52),
  },
  pdl40: {
    paddingLeft: px(36),
  },
  networkErrStyle: {
    // marginTop: px(140),
    position: 'absolute',
    top: px(140),
    width: winWidth
  },
  coverImg: {
    width: '100%',
    height: '100%'
  }
});

export default connect(mapState, mapDispatch)(News);
