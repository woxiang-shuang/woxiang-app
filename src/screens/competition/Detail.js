import * as React from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ImageBackground,
  ScrollView,
  Animated,
  Easing,
  AppState,
} from 'react-native';
import { Tabs, Toast, Portal } from '@ant-design/react-native';
import { connect } from 'react-redux';
import { WebView } from 'react-native-webview';

import AppActions from '../../store/actions';
import { px, winWidth } from '../../utils/adapter';
import cstyle from '../../styles/common';
import theme from '../../styles/theme';
import DetailLive from './DetailLive';
import Chat from './Chat';
import Team from './Team';
import Exponent from './Exponent';
import Infos from './Infos';
import Datas from './Datas';
import APIs from '../../http/APIs';
import NetWorkError from '../../components/network-error'; // 数据接口加载失败
import NoInternet from '../../components/no-internet'; // 没有网络
import {
  getMatchStatus,
  MatchStaus,
  isHalftime,
} from '../../utils/matchCommon';
import { dateFormat, fmtOverTime } from '../../utils/date';
import EventBus from '../../utils/eventBus';
import { enptyFn, isUdf } from '../../utils/common';
import { getUniqueId } from 'react-native-device-info';
import store from '../../store';
import { SocketDataMsgType } from '../../utils/constant';
import { socketDataArrayToObject, objectsOfPropToObjectsOfArray } from '../../utils/socketDataMapping';

const IMAGE_BASE_DIR = '../../assets/images/';
const dashboardBgImage = require(IMAGE_BASE_DIR + 'stadium.png');
const iconFootball = require(IMAGE_BASE_DIR + 'icon-football.png');

const devideId = getUniqueId();

const mapState = (state) => ({
  state,
  netStatus: state.netInfoModel.netStatus,
  dataError: state.netInfoModel.dataError
});

const mapDispatch = {
  updateFooterTabBar: AppActions.updateFooterTabBar,
  updataDataError: AppActions.updataDataError
};

const TabTypes = {
  LIVE: 0,
  CHAT: 1,
  TEAM: 2,
  INFOS: 3,
  EXPONENT: 4,
  DATA: 5,
};

const imageFavourite = require(IMAGE_BASE_DIR + 'icon-star3.png');
const imageOnFavourite = require(IMAGE_BASE_DIR + 'icon-star2.png');
const imageShare = require(IMAGE_BASE_DIR + 'icon-link.png');

function HeaderLeft(props) {
  return (
    <View style={[cstyle.flexJcC, cstyle.flexAiC, cstyle.flex1]}>
      <TouchableOpacity
        activeOpacity={theme.activeOpacity}
        onPress={props.onPress}
        style={[cstyle.w100, cstyle.flex1]}
      >
        <View style={theme.iconBack}></View>
      </TouchableOpacity>
    </View>
  );
}

function HeaderRight(props) {
  let { fav } = props;
  function updateFavourite() {
    props.updateFavourite && props.updateFavourite(fav);
  }
  function share() {}
  return (
    <View
      style={[cstyle.flexDirecR, cstyle.flexJcC, cstyle.flexAiC, cstyle.flex1]}
    >
      <TouchableOpacity
        activeOpacity={theme.activeOpacity}
        onPress={updateFavourite}
        style={cstyle.mgR20}
      >
        <Image
          source={fav === 'y' ? imageOnFavourite : imageFavourite}
          style={styles.headerRightIcon}
        />
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={theme.activeOpacity}
        onPress={share}
        style={cstyle.mgR20}
      >
        <Image source={imageShare} style={styles.headerRightIcon} />
      </TouchableOpacity>
    </View>
  );
}

class CompetitionDetail extends React.Component {
  socket;
  goBackClickStartTime = Date.now();
  state = {
    id: '',
    matchId: '',
    typeTabs: [
      { title: '现场', index: TabTypes.LIVE },
      { title: '聊天', index: TabTypes.CHAT },
      { title: '阵容', index: TabTypes.TEAM },
      { title: '情报', index: TabTypes.INFOS },
      { title: '指数', index: TabTypes.EXPONENT },
      { title: '往绩', index: TabTypes.DATA },
    ],
    initialPage: 0,
    page: 0,
    playingVideo: false,
    tabsConfig: {
      swipeable: true,
      useOnPan: true,
      usePaged: true,
    },
    detail: {},
    video: [],
    activeTab: 1,
    aniBlink: new Animated.Value(0),
    playingTime: 0,
    data:{},
    socketTextAlive: {},
    socketEvents: {},
    socketOdds: {},
    VideoWebViewUrl: '' 
  };
  componentDidMount() {
    this.props.updateFooterTabBar({ show: false });
    this.props.navigation.setOptions({
      headerLeft: (props) => <HeaderLeft onPress={this.backHandler} />,
    });
    this.setHeaderRight();
    this.init();
    AppState.addEventListener('change', this.handleAppStateChange);
  }
  init = () => {
    const { netStatus, updataDataError, route } = this.props;
    updataDataError(false);
    if (netStatus) {
      EventBus.emit('evtNofityToMatchDetailPageSend', 
        `A003;;;${route.params.id}`);
      EventBus.emit('evtNofityToMatchDetailPageSend', 
        `A004;;;${route.params.id}`);
      if (!EventBus.has('evtNofityToMatchDetailPage')) {
        EventBus.addListenser('evtNofityToMatchDetailPage', (data) => {
          this.socketMessageHandler(data);
        });
      }
    }
    // this.setState({
    //   data: this.props.route.params
    // });
    this.getWeatherById(route.params);
    this.getMatchDetail(route.params).then((data) => {
      const status = getMatchStatus(data?.matchStatus);
      if (status === MatchStaus.IN_PLAY) {
        this.startBlinkAni();
        let inPlayTime = Math.ceil((this.state.detail.nowTime - data.teeTime) / 60 + 1);
        if (2 === data?.matchStatus) {// 上半场  目前后端没给出除这两种状态外的公式，暂不处理
          inPlayTime = Math.ceil((this.state.detail.nowTime - data.teeTime) / 60 + 1);
        } else if (4 === data?.matchStatus) {// 下半场
          inPlayTime = Math.ceil((this.state.detail.nowTime - data.teeTime) / 60 + 45 + 1);
        }
        if (inPlayTime < 0) inPlayTime = 0;
        this.setState({
          playingTime: inPlayTime,
        });
        this.startTimer();
      }
      // this.setState({playingTime: secondsToMinutes(1590469382308 - 1590469375908)});
      // this.startTimer();
    });
  }
  UNSAFE_componentWillMount() {
    // console.log('info componentWillMount route.params=', this.props.route.params)
    this.setState({
      matchId: this.props.route.params?.match_id,
      id: this.props.route.params?.id,
    });
  }
  setHeaderRight() {
    this.props.navigation.setOptions({
      headerRight: (props) => (
        <HeaderRight
          onPress={() => {}}
          fav={this.state.detail?.fav}
          updateFavourite={this.updateFavourite}
        />
      ),
    });
  }
  handleAppStateChange = (state = {}) => {
    if (state === 'active') {
      this.init();
    }
  };
  backHandler = () => {
    if (Date.now() - this.goBackClickStartTime < 300) return;
    this.goBackClickStartTime = Date.now();
    if (this.state.playingVideo) {
      this.setState(() => ({
        playingVideo: false
      }));
      return false;
    }
    if (this.props.navigation.canGoBack()) {
      this.props.navigation.navigate('CompetitionIndex');
    }
  };
  updateFavourite = (fav) => {
    let mId = store.getState().login.loginInfo.id
      ? store.getState().login.loginInfo.id
      : '';
    let obj = mId
      ? { matchId: this.state.detail.id, memberId: mId, deviceId: devideId }
      : { matchId: this.state.detail.id, deviceId: devideId };
    let pfav;
    let data = this.state.detail;
    if ('y' === fav) {
      APIs.cancelFavourite(obj).then((res) => {
        if('000' === res.statusCode) {
          pfav = 'n';
          data.fav = pfav;
          this.setState({data: data}, this.setHeaderRight);
        }
      })
        .catch(() => {
        // Toast.info('网络异常，请稍后再试', 3, enptyFn, false);
          console.log('捕获错误');
        });
    }else{
      APIs.updateFavourite(obj).then((res) => {
        if ('000' === res.statusCode) {
          pfav = 'y';
          data.fav = pfav;
          this.setState({data: data}, this.setHeaderRight);
        }
      })
        .catch(() => {
        // Toast.info('网络异常，请稍后再试', 3, enptyFn, false);
        });
    }
  };
  tabHandler = (tab, index) => {
    this.setState({ page: index });
  };
  // 假定数据返回视频数组第一项是视频直播路径，第二项是动画直播路径
  liveHandler = (type) => {
    const { detail } = this.state;
    if(type === 'video') {
      this.setState(() => ({
        VideoWebViewUrl: detail.video[0],
        playingVideo: true
      }));
    } else if (type === 'animation') {
      this.setState(() => ({
        VideoWebViewUrl: detail.video[1],
        playingVideo: true
      }));
    }
  };
  componentWillUnmount() {
    EventBus.removeListenser('evtNofityToMatchDetailPage');
    this.setState = enptyFn;
    if (this.playingTimer !== undefined) clearInterval(this.playingTimer);
    if (this.aniBlink) this.aniBlink.stop();
    EventBus.emit('evtMatchIndexFromGoBack', {
      id: this.state.id,
      fav: this.state.detail?.fav,
    });
    this.props.updateFooterTabBar({ show: true });
  }
  getMatchDetail = (params) => {
    let key = Toast.loading('加载数据中...', 5, enptyFn, false);
    return APIs.getMatchDetailById({matchId:params.id})
      .then((data) => {
        // console.log('-------', data);
        if (data) {
          data.video = data.playUrl ? JSON.parse(data.playUrl) : [];
          const { detail } = this.state;
          this.setState({detail: {...this.props.route.params, ...data, ...detail}, video: data.video}, this.setHeaderRight);
        }
        return data;
      })
      .catch((err) => {
        // Toast.info('网络异常，请稍后再试', 3, enptyFn, false);
        const { updataDataError } = this.props;
        updataDataError(true);
        // console.log('赛事详情----接口错误', err);
      })
      .finally((data) => {  
        Portal.remove(key);
      });
  };
  /* 
  * 获取天气详情
  */
  getWeatherById = (params) => {
    return APIs.getWeatherById({matchId:params.id, matchTypeId:params.matchTypeId})
      .then(({ data }) => {
        if(data) {
          this.setState({detail: {...data, ...this.state.detail}});
        }
        return data;
      })
      .catch((err) => {
        // Toast.info('网络异常，请稍后再试', 3, enptyFn, false);
        console.log('接口错误', err);
      });
  };
  updateMatchDetail(data, msgType) {
    let detail = this.state.detail;
    let id = this.state.id;
    if (msgType === SocketDataMsgType.SHORT_EVENTDATA) {
      data = socketDataArrayToObject(data, SocketDataMsgType.SHORT_EVENTDATA);
      let goalsIn = objectsOfPropToObjectsOfArray(data.goal);
      let halfScores = data.halfScore;

      // 进球比分
      for (let m = 0; m < goalsIn.length; m++) {
        if (id === goalsIn[m].matchId) {
          detail.homeScore = goalsIn[m].homeScore;
          detail.awayScore = goalsIn[m].awayScore;
          detail.position = goalsIn[m].position;
          break;
        }
      }
      // 半场比分
      for (let o = 0; o < halfScores.length; o++) {
        if (id === halfScores[o].matchId) {
          detail.halfHomeSoce = halfScores[o].halfHomeSoce;
          detail.halfAwaySoce = halfScores[o].halfAwaySoce;
          break;
        }
      }
    } else if (msgType === SocketDataMsgType.SHORT_REALTIMEDATA) {
      // 比赛状态
      data = socketDataArrayToObject(data, SocketDataMsgType.SHORT_REALTIMEDATA);
      for (let i = 0; i < data.length; i++) {
        if (id === data[i].matchId) {
          detail.matchStatus = data[i].oddState;
          break;
        }
      }
    } else if (msgType === SocketDataMsgType.ALLMATCHSTATE) {
      for (let i = 0; i < data.length; i++) {
        if (id === data[i].matchId) {
          detail.matchStatus = data[i].matchStatus;
          // detail.matchTime = data[i].teeTime;
          this.init();
          break;
        }
      }
    }
    // console.log('info detail update=', detail);
    this.setState({ detail });
  }
  socketMessageHandler = (data = {}) => {
    // console.log('detail的 socket data=', data);
    let msg = JSON.parse(data.msg);
    let type = data.msgType;
    switch (type) {
    case SocketDataMsgType.FOOTBALL_TEXT_ALIVE:
      this.updateSocketTextAlive(msg);
      break;
    case SocketDataMsgType.FOOTBALL_EVENTS:
      this.updateSocketEvents(msg);
      break;
    case SocketDataMsgType.FOOTBALL_ODDS:
      this.updateSocketOdds(msg);
      break;
    case SocketDataMsgType.FOOTBALL_TECHNICAL_STATISTICS:
      this.updateSocketTechStatEvent(msg);
      break;  
    case SocketDataMsgType.SHORT_EVENTDATA:
    case SocketDataMsgType.SHORT_REALTIMEDATA:
    case SocketDataMsgType.ALLMATCHSTATE:
      this.updateMatchDetail(msg, type);
      break;
    default:
      break;
    }
  };
  /* 
  * 更新socket文字直播数据
  */
  updateSocketTextAlive = (data) => {
    // console.log('文字直播', data);
    this.setState((state) => ({
      socketTextAlive: data
    }));
  };
  /* 
  * 更新socket重要事件数据
  */
  updateSocketEvents = (data) => {
    // console.log('重要内容', data);
    this.setState((state) => ({
      socketEvents: data
    }));
  };
  /* 
  * 更新socket指数数据
  */
  updateSocketOdds = (data) => {
    // console.log('指数', data);
    this.setState(() => ({
      socketOdds: data
    }));
  };
  /**
   * 更新socket推送的技术统计
   */
  updateSocketTechStatEvent(data) {
    this.setState({eventStatData: data});
  }
  startBlinkAni() {
    this.aniBlink = Animated.loop(
      Animated.timing(this.state.aniBlink, {
        toValue: 1,
        duration: 1000,
        easing: Easing.inOut(Easing.linear),
        useNativeDriver: true,
      }
      )
    ).start();
  }
  startTimer() {
    this.playingTimer = setInterval(() => {
      this.setState({ playingTime: this.state.playingTime + 1 });
    }, 60000);
  }
  notUdfAndZero(v) {
    return !isUdf(v) && v !== null;
  }
  fullScore = (status) => {
    if ((status === MatchStaus.DELAY || status === MatchStaus.WAITING_BEGIN)) {
      return (
        <View style={[cstyle.flexDirecR, cstyle.flexJcC]}>
          <Text style={[styles.pdlr10, styles.scoreTxt]}>{status === MatchStaus.WAITING_BEGIN ? 'vs' : '-'}</Text>
        </View>
      );
    } else {
      return (
        <View style={[cstyle.flexDirecR, cstyle.flexJcC]}>
          <Text style={styles.scoreTxt}>{this.state.detail.homeScore}</Text>
          <Text style={[styles.pdlr10, styles.scoreTxt]}>-</Text>
          <Text style={styles.scoreTxt}>{this.state.detail.awayScore}</Text>
        </View>
      );
    }
  }
  halfScore = () => {
    if (this.notUdfAndZero(this.state.detail.halfHomeSoce) || this.notUdfAndZero(this.state.detail.halfAwaySoce)) {
      return <View style={[cstyle.flexDirecR, cstyle.flexJcC]}>
        <Text style={styles.halfScoreTxt}>
          ({this.state.detail.halfHomeSoce}
        </Text>
        <Text style={[styles.pdlr10, styles.halfScoreTxt]}>-</Text>
        <Text style={styles.halfScoreTxt}>
          {this.state.detail.halfAwaySoce})
        </Text>
      </View>;
    } else {
      return <></>;
    }
  }
  render() {
    let detail = this.state.detail;
    // console.log('detaildetail -----------', detail);
    const matchTime = (detail.matchTime && dateFormat(new Date(detail.matchTime * 1000), 'MM-dd hh : mm')) || '';
    const status = getMatchStatus(detail.matchStatus);
    const statusHalftime = isHalftime(detail.matchStatus);
    // console.log('data', this.state.data);
    const { id: matchId, awayId, homeId, homeLogo, homeNameZh, awayLogo, awayNameZh } = this.state.detail;
    const { socketTextAlive, socketEvents, socketOdds, eventStatData, VideoWebViewUrl, video } = this.state;
    const dateExponent = this.state.detail.date ? this.state.detail.date : false;
    let { dataError, netStatus } = this.props;
    return (
      dataError ? netStatus ? <NetWorkError onPress={this.init} /> : <NoInternet /> : <View style={styles.container}>
        <View style={[cstyle.pd20, this.state.playingVideo ? cstyle.hide : {}]}>
          <ImageBackground
            source={dashboardBgImage}
            style={(styles.bgImage, styles.header)}
          >
            <View style={[cstyle.flexAiC, styles.mgT16]}>
              <Text style={[cstyle.txtColorWhite, cstyle.fz24]}>
                {detail.matchEventNameZh}
              </Text>
            </View>
            <View style={cstyle.flexAiC}>
              <Text style={[cstyle.txtColorWhite, cstyle.fz18]}>
                {matchTime}
              </Text>
            </View>
            <View style={[cstyle.flexDirecR, styles.headerTeamWp]}>
              <View style={[cstyle.flex1, cstyle.flexAiC]}>
                <View style={styles.teamLogin}>
                  {!!detail.homeLogo && <Image source={{ uri: detail.homeLogo }} style={styles.teamLogin} />}
                </View>
                <View style={[cstyle.mgT4, styles.teamName]}>
                  <Text style={[cstyle.txtColorWhite, cstyle.fz26, cstyle.txtC]}>
                    {detail.homeNameZh}
                  </Text>
                </View>
              </View>
              <View style={[styles.headerMid, cstyle.flexAiC]}>
                <View
                  style={[
                    cstyle.flexDirecR,
                    cstyle.flexAiC,
                    cstyle.flexJcC,
                    styles.matchStatus,
                    cstyle.mgT10,
                  ]}
                >
                  {/* <Text style={[cstyle.txtColorWhite, cstyle.fz20]}>{fmtOverTime(this.state.playingTime)}</Text> */}
                  {status === MatchStaus.DELAY && (
                    <Text style={styles.headerStateText}>推</Text>
                  )}
                  {/* {status === MatchStaus.WAITING_BEGIN && (
                    <Text style={[cstyle.txtColorWhite, cstyle.fz20]}>未</Text>
                  )} */}
                  {status === MatchStaus.ENDS && (
                    <Text style={styles.headerStateText}>完</Text>
                  )}
                  {status === MatchStaus.IN_PLAY && (
                    <View style={[cstyle.flexDirecR, cstyle.flexAiC]}>
                      {statusHalftime ? (
                        <Text style={styles.headerStateText}>
                          中
                        </Text>
                      ) : (
                        <>
                          <Text style={styles.headerStateText}>
                            {fmtOverTime(this.state.playingTime)}
                          </Text>
                          <Animated.Text
                            style={{
                              height: px(30),
                              color: theme.text.colorWhite,
                              opacity: this.state.aniBlink.interpolate({
                                inputRange: [0, 0.5, 1],
                                outputRange: [0, 0, 1],
                              }),
                            }}
                          >
                            <Text>&apos;</Text>
                          </Animated.Text>
                          <Image
                            source={iconFootball}
                            style={styles.iconFootball}
                          />
                        </>
                      )}
                    </View>
                  )}
                </View>
                {this.fullScore(status)}
                {this.halfScore()}
              </View>
              <View style={[cstyle.flex1, cstyle.flexAiC]}>
                <View style={styles.teamLogin}>
                  {!!detail.awayLogo && <Image source={{ uri: detail.awayLogo }} style={styles.teamLogin} />}
                </View>
                <View style={[cstyle.mgT4, styles.teamName]}>
                  <Text
                    style={[cstyle.txtColorWhite, cstyle.fz26, cstyle.txtC]}
                  >
                    {detail.awayNameZh}
                  </Text>
                </View>
              </View>
            </View>
            <View style={cstyle.flexAiC}>
              {/* {video.length > 0 && (
                <View style={[cstyle.flexDirecR, styles.videoBtnWp]}>
                  <View style={[styles.videoType,styles.bdRidsL, video.length === 1 ? styles.bdRidsR : {}]}>
                    <TouchableOpacity
                      activeOpacity={theme.clickOpacity}
                      onPress={() => this.liveHandler('video')}
                    >
                      <Text style={styles.videoTxt}>视频直播</Text>
                    </TouchableOpacity>
                  </View>
                  {video.length > 1 && (
                    <View style={[cstyle.flexAiC, cstyle.flexJcC, styles.midLineWp]}>
                      <Text style={styles.midLine}>|</Text>
                    </View>
                  )}
                  {video.length > 1 && (
                    <View style={[styles.videoType,styles.bdRidsR]}>
                      <TouchableOpacity
                        activeOpacity={theme.clickOpacity}
                        onPress={() => this.liveHandler('animation')}
                      >
                        <Text style={styles.videoTxt}>动画直播</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View> 
              )} */}
            </View>
            <View
              style={[
                cstyle.flexDirecR,
                cstyle.flexJcSb,
                styles.weatherWp,
                cstyle.mgT12,
              ]}
            >
              {detail.weather &&
              <View style={[cstyle.flexDirecR, cstyle.flexAiC]}>
                <Image
                  source={require(IMAGE_BASE_DIR + 'weather-1.png')}
                  style={[styles.weatherIcon, { width: px(30) }]}
                />
                <Text style={styles.weatherTxt}>天气:{detail.weather}</Text>
              </View>
              }
              {detail.humidity && 
              <View style={[cstyle.flexDirecR, cstyle.flexAiC]}>
                <Image
                  source={require(IMAGE_BASE_DIR + 'weather-humidity.png')}
                  style={[styles.weatherIcon, { width: px(10) }]}
                />
                <Text style={styles.weatherTxt}>湿度:{detail.humidity}</Text>
              </View>
              }
              {detail.temperature && 
              <View style={[cstyle.flexDirecR, cstyle.flexAiC]}>
                <Image
                  source={require(IMAGE_BASE_DIR + 'weather-thermometer.png')}
                  style={[styles.weatherIcon, { width: px(10) }]}
                />
                <Text style={styles.weatherTxt}>
                  温度: {detail.temperature}
                </Text>
              </View>
              }
              {detail.wind && 
              <View style={[cstyle.flexDirecR, cstyle.flexAiC]}>
                <Image
                  source={require(IMAGE_BASE_DIR + 'weather-wind.png')}
                  style={[styles.weatherIcon, { width: px(34) }]}
                />
                <Text style={styles.weatherTxt}>风速:{detail.wind}</Text>
              </View>
              }
              {detail.pressure && 
              <View style={[cstyle.flexDirecR, cstyle.flexAiC]}>
                <Image
                  source={require(IMAGE_BASE_DIR + 'weather-barometric.png')}
                  style={[styles.weatherIcon, { width: px(24) }]}
                />
                <Text style={styles.weatherTxt}>气压:{detail.pressure}</Text>
              </View>
              }
            </View>
          </ImageBackground>
        </View>
        {this.state.playingVideo && (
          <View style={styles.videoWp}>
            <WebView 
              style={styles.webViewStyle} 
              source={{ uri: VideoWebViewUrl }} 
            />
          </View>
        )}
        <View style={cstyle.flex1}>
          <Tabs
            tabs={this.state.typeTabs}
            tabBarBackgroundColor={theme.header.backgroundColor}
            tabBarInactiveTextColor={theme.text.color9}
            tabBarActiveTextColor={theme.background.color12}
            tabBarTextStyle={styles.tabBarTextStyle}
            tabBarUnderlineStyle={styles.tabBarUnderlineStyle}
            // page={this.state.page}
            swipeable={this.state.tabsConfig.swipeable}
            useOnPan={this.state.tabsConfig.useOnPan}
            usePaged={this.state.tabsConfig.usePaged}
            onChange={this.tabHandler}
          >
            <View style={styles.tabContent}>
              {this.state.page === TabTypes.LIVE && (
                <DetailLive
                  homeTeam={{ name: detail.homeNameZh }}
                  awayTeam={{ name: detail.awayNameZh }}
                  id={this.state.id}
                  eventStatData={eventStatData}
                  socketTextAlive={socketTextAlive}
                  socketEvents={socketEvents}
                />
              )}
            </View>
            <View style={styles.tabContent}>
              {this.state.page === TabTypes.CHAT && (
                <Chat matchId={this.state.matchId} />
              )}
            </View>
            <View style={styles.tabContent}>
              {this.state.page === TabTypes.TEAM && (
                <Team matchId={this.state.id} matchTypeId ={1} mydata={Object.assign({}, this.state.detail)}/>
              )}
            </View>
            <View style={styles.tabContent}>
              {this.state.page === TabTypes.INFOS && (
                <Infos matchId={this.state.matchId} />
              )}
            </View>
            <View style={styles.tabContent}>
              {this.state.page === TabTypes.EXPONENT && (
                <Exponent matchId={matchId} socketOdds={socketOdds} dateExponent={dateExponent} />
              )}
            </View>
            <View style={styles.tabContent}>
              {this.state.page === TabTypes.DATA && (
                <Datas 
                  awayId={awayId}
                  homeId={homeId}
                  homeLogo={homeLogo}
                  homeNameZh={homeNameZh}
                  awayLogo={awayLogo}
                  awayNameZh={awayNameZh}
                />
              )}
            </View>
          </Tabs>
        </View>
      </View>
    );
  }
}

export default connect(mapState, mapDispatch)(CompetitionDetail);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.screenBgColor,
  },
  header: {
    height: px(300),
  },
  headerTeamWp: {
    minHeight: px(152),
    paddingLeft: px(20),
    paddingRight: px(20),
  },
  headerRightIcon: {
    width: px(40),
    height: px(40),
  },
  headerMid: {
    width: px(144),
  },
  scoreWp: {
    height: px(60),
  },
  scoreTxt: {
    fontSize: px(50),
    fontWeight: 'bold',
    color: theme.text.colorWhite,
  },
  halfScoreTxt: {
    fontSize: px(20),
    color: theme.text.colorWhite,
  },
  pdlr10: {
    paddingLeft: px(10),
    paddingRight: px(10),
  },
  bgImage: {
    flex: 1,
  },
  teamLogin: {
    width: px(80),
    height: px(80),
  },
  teamName: {
    width: px(240),
  },
  mgT16: {
    marginTop: px(16),
  },
  videoBtnWp: {
    height: px(40),
    marginTop: px(-10),
  },
  bdRidsL: {
    borderTopLeftRadius: px(20),
    borderBottomLeftRadius: px(20),
  },
  bdRidsR: {
    borderTopRightRadius: px(20),
    borderBottomRightRadius: px(20),
  },
  midLineWp: {
    width: px(2),
    height: px(40),
    backgroundColor: theme.competition.detail.videoTypeBgColor,
  },
  midLine: {
    height: px(34),
    borderRightWidth: px(2),
    borderColor: theme.competition.detail.midLineColor,
  },
  videoTxt: {
    color: theme.text.colorShallowWhite,
    fontSize: theme.text.size20,
  },
  videoType: {
    width: px(110),
    height: px(40),
    backgroundColor: theme.competition.detail.videoTypeBgColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  weatherWp: {
    paddingLeft: px(22),
    paddingRight: px(22),
    // marginTop: px(4)
  },
  weatherIcon: {
    height: px(20),
    marginRight: px(4),
  },
  weatherTxt: {
    color: theme.text.colorWhite,
    fontSize: theme.text.size18,
  },
  tabBarTextStyle: {
    fontSize: px(26)
  },
  tabBarBackgroundColor: {
    backgroundColor: theme.header.backgroundColor,
  },
  tabBarUnderlineStyle: {
    borderColor: theme.background.color12,
    backgroundColor: theme.background.color12,
  },
  videoWp: {
    padding: px(20),
    height: px(340),
  },
  tabContent: {
    flex: 1,
  },
  iconFootball: {
    width: px(14),
    height: px(14),
    marginLeft: px(4),
  },
  mgT12: {
    marginTop: px(12),
  },
  matchStatus: {
    width: '100%',
    height: px(22),
  },
  bd: {
    borderWidth: 1,
  },
  webViewStyle: {
    width: winWidth - 20,
    height: px(340)
  },
  headerStateText: {
    fontSize: px(20),
    color: theme.text.colorShallowWhite
  }
});
