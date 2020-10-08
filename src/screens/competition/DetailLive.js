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
  FlatList
} from 'react-native';
import _ from 'lodash';
import { connect } from 'react-redux';

import AppActions from '../../store/actions';
import { px } from '../../utils/adapter';
import cstyle from '../../styles/common';
import theme from '../../styles/theme';
import CheckedNav from '../../components/checked-nav';
import { ShadowBox } from 'react-native-neomorph-shadows';
import TextLiveInfoFlow from '../../components/text-live-info-flow';
import APIs from '../../http/APIs';
import { Toast, Portal } from '@ant-design/react-native';
import { enptyFn } from '../../utils/common';
import { CompetitionFootballEventTypes } from '../../utils/constant';
import NoDataPlaceHolder from '../../components/no-data-placeholder';
import NetWorkError from '../../components/network-error'; // 数据接口加载失败
import NoInternet from '../../components/no-internet'; // 没有网络

const NavTabTypes = {
  TEXT_LIVE: 'textLive',
  IMPORTANT_EVENT: 'importantEvent'
};

const navBarTabsConfig = [
  {name: NavTabTypes.TEXT_LIVE, title: '文字直播', active: true},
  {name: NavTabTypes.IMPORTANT_EVENT, title: '重要事件', active: false},
];

const mapState = (state) => {
  return {
    netStatus: state.netInfoModel.netStatus
  };
};

function EventBar(props) {
  let { name = '', leftRateNum = 0, rightRateNum = 0, formater = v => v} = props;
  const rateUnit = (leftRateNum + rightRateNum) / 100;
  const leftRateWidth = rateUnit > 0 ? leftRateNum / rateUnit : 0;
  const rightRateWidth = rateUnit > 0 ? rightRateNum / rateUnit : 0;
  return (
    <View style={styles.eventItemRow}>
      <View style={cstyle.flexDirecR}>
        <View style={[styles.rateNumWp, styles.flexJcFe]}><Text style={[styles.rateNum, cstyle.txtR]}>{formater(leftRateNum)}</Text></View>
        <View style={[cstyle.flexDirecR, cstyle.flex1, cstyle.flexAiC]}>
          <View style={[styles.rateBar, cstyle.flexDirecR, cstyle.flexJcFe]}><View style={[{width: `${leftRateWidth}%`}, styles.progressBar, styles.bgGreen]}></View></View>
          <View style={[cstyle.flexAiC, styles.eventNameWp]}><Text style={styles.eventName}>{name}</Text></View>
          <View style={styles.rateBar}><View style={[{width: `${rightRateWidth}%`}, styles.progressBar, styles.bgOrange]}></View></View>
        </View>
        <View style={[styles.rateNumWp, styles.flexJcSt]}><Text style={[styles.rateNum, cstyle.txtL]}>{formater(rightRateNum)}</Text></View>
      </View>
    </View>
  );
}

function fmtAddPercentSymbol(value = 0) {
  return `${value}%`;
}

/**
 * 直播
 * @param {*} props 
 */
function DetailLive(props) {

  const DISTANCE_BOTTOM = 100;

  const defaultEventsData = [
    {name: '控球率', type: CompetitionFootballEventTypes.TRAP_RATE, home: 0, away: 0, formater: fmtAddPercentSymbol},
    {name: '射门', type: CompetitionFootballEventTypes.TO_SHOT, home: 0, away: 0},
    {name: '射正', type: CompetitionFootballEventTypes.THE_OBVERSE_SIDE_SHOT, home: 0, away: 0},
    {name: '射偏', type: CompetitionFootballEventTypes.SHOT_ASIDE, home: 0, away: 0},
    {name: '进攻', type: CompetitionFootballEventTypes.ATTACK, home: 0, away: 0},
    {name: '危险进攻', type: CompetitionFootballEventTypes.DANGER_ATTACK, home: 0, away: 0},
    {name: '角球', type: CompetitionFootballEventTypes.CORNER_KICK, home: 0, away: 0},
    {name: '黄牌', type: CompetitionFootballEventTypes.YELLOW_CARD, home: 0, away: 0},
    {name: '红牌', type: CompetitionFootballEventTypes.RED_CARD, home: 0, away: 0}
  ];

  let [textLiveInfos, setTextLiveInfos] = React.useState([]);
  let [importantEventInfos, setImportantEventInfos] = React.useState([]);
  let [curLiveTab, setCurLiveTab] = React.useState(NavTabTypes.TEXT_LIVE);
  let [eventStat, setEventStat] = React.useState(defaultEventsData);
  let [textInfoCurPage, setTextInfoCurPage] = React.useState(1);
  let [importantEventCurPage, setImportantEventCurPage] = React.useState(1);
  let [detailTabsError, setDetailTabsError] = React.useState(false);
  let [textInfoTotalPage, setTextInfoTotalPage] = React.useState(1);
  let [importantEventTotalPage, setImportantEventTotalPage] = React.useState(1);

  let { socketTextAlive, socketEvents, homeTeam = {}, awayTeam = {}, netStatus } = props;

  const eventTypes = [
    CompetitionFootballEventTypes.TRAP_RATE, 
    CompetitionFootballEventTypes.TO_SHOT, 
    CompetitionFootballEventTypes.THE_OBVERSE_SIDE_SHOT, 
    CompetitionFootballEventTypes.SHOT_ASIDE, 
    CompetitionFootballEventTypes.ATTACK, 
    CompetitionFootballEventTypes.DANGER_ATTACK, 
    CompetitionFootballEventTypes.CORNER_KICK, 
    CompetitionFootballEventTypes.YELLOW_CARD, 
    CompetitionFootballEventTypes.RED_CARD
  ];

  /**
   * 文字直播
   */
  function getTextInfosForLive() {
    let key = Toast.loading('加载数据中...', 5, enptyFn, false);
    APIs.getTextInfosForLive({matchId: props.id}).then((res) => {
      // console.log('------文字直播-----', res, props.id);
      if (res?.length > 0) {
        setTextLiveInfos(_.reverse(res));
      }
    })
      .catch((err) => {
      // Toast.info('网络异常，请稍后再试', 3, enptyFn, false);
        console.log('then---后面的catch', err);
        setDetailTabsError(true);
      })
      .finally(() => {
        Portal.remove(key);
      });
  }
  React.useEffect(() => {
    if (socketTextAlive.data) {
      textLiveInfos.unshift(socketTextAlive);
      setTextLiveInfos(textLiveInfos);
    }
  }, [socketTextAlive]);

  /**
   * 重要事件
   */
  function getImportantEventsForLive() {
    let key = Toast.loading('加载数据中...', 5, enptyFn, false);
    APIs.getImportantEventsForLive({
      matchId: props.id
    }).then((res) => {
      // console.log('------重要事件--------', res);
      if (res?.length > 0) {
        setImportantEventInfos(_.reverse(res));
      }
    })
      .catch((err) => {
      // Toast.info('网络异常，请稍后再试', 3, enptyFn, false);
        console.log('错误', err);
        setDetailTabsError(true);
      })
      .finally(() => {
        Portal.remove(key);
      });
  }
  React.useEffect(() => {
    if (socketEvents.data) {
      importantEventInfos.unshift(socketEvents);
      setImportantEventInfos(importantEventInfos);
    }
  }, [socketEvents]);

  /**
   * 对战数据
   */
  function getCompetitionEventStat() {
    let key = Toast.loading('加载数据中...', 5, enptyFn, false);
    APIs.getCompetitionEventStat({matchId: props.id}).then((res) => {
      // console.log('----------对战数据-------', res);
      if (res.code === 0) {
        initEventStat(res.data);
      }
    })
      .catch((err) => {
      // Toast.info('网络异常，请稍后再试', 3, enptyFn, false);
        console.log('错误', err);
        setDetailTabsError(true);
      })
      .finally(() => {
        Portal.remove(key);
      });
  }

  function initEventStat(data) {
    if (data && data.home && data.away) {
      let events = [];
      const home = data.home;
      const away = data.away;
      events.push({name: '控球率', type: CompetitionFootballEventTypes.TRAP_RATE, home: home.trap_rate, away: away.trap_rate, formater: fmtAddPercentSymbol });
      events.push({name: '射门', type: CompetitionFootballEventTypes.TO_SHOT, home: home.to_shot, away: away.to_shot});
      events.push({name: '射正', type: CompetitionFootballEventTypes.THE_OBVERSE_SIDE_SHOT, home: home.the_obverse_side_shot, away: away.the_obverse_side_shot});
      events.push({name: '射偏', type: CompetitionFootballEventTypes.SHOT_ASIDE, home: home.shot_aside, away: away.shot_aside});
      events.push({name: '进攻', type: CompetitionFootballEventTypes.ATTACK, home: home.attack, away: away.attack});
      events.push({name: '危险进攻', type: CompetitionFootballEventTypes.DANGER_ATTACK, home: home.danger_attack, away: away.danger_attack});
      events.push({name: '角球', type: CompetitionFootballEventTypes.CORNER_KICK, home: home.corner_kick, away: away.corner_kick});
      events.push({name: '黄牌', type: CompetitionFootballEventTypes.YELLOW_CARD, home: home.yellow_card, away: away.yellow_card});
      events.push({name: '红牌', type: CompetitionFootballEventTypes.RED_CARD, home: home.red_card, away: away.red_card});
      setEventStat(events);
    }
  }

  /**
   * 更新推送的对战数据(技术统计事件数据)
   * @param {*} data 
   */
  function updateCompetitionEventStat(data = []) {
    let events = eventStat.slice();
    let updateCount = 0;
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < events.length; j++) {
        if (events[j].type === data[i].type) {
          events[j].home = data[i].homeCount;
          events[j].away = data[i].awayCount;
          updateCount = 1;
          break;
        }
      }
    }
    if (updateCount > 0) {
      setEventStat(events);
    }
  }

  function liveTabHanlder(tab) {
    // console.log('info liveTabHanlder tab=', tab, curLiveTab);
    if (tab.name === curLiveTab) return;
    switch(tab.name) {
    case NavTabTypes.TEXT_LIVE:
      setTextInfoCurPage(1);
      break;
    case NavTabTypes.IMPORTANT_EVENT:
      setImportantEventCurPage(1);
      // getImportantEventsForLive(1);
      break;
    default:
      break;
    }
    setCurLiveTab(tab.name);
  }
  function onScrollHandler(e) {
    // console.log('onScrollHandler=', e.nativeEvent)
    if (e?.nativeEvent) {
      // console.log('info == ', e.nativeEvent.contentOffset, e.nativeEvent.layoutMeasurement.height, DISTANCE_BOTTOM, (e.nativeEvent.contentOffset.y + e.nativeEvent.layoutMeasurement.height + DISTANCE_BOTTOM), e.nativeEvent.contentSize.height, textInfoCurPage, textInfoTotalPage, curLiveTab)
      if (e.nativeEvent.contentOffset.y + e.nativeEvent.layoutMeasurement.height + DISTANCE_BOTTOM > e.nativeEvent.contentSize.height) {
        switch(curLiveTab) {
        case NavTabTypes.TEXT_LIVE:
          if (textInfoCurPage < textInfoTotalPage) {
            let page = textInfoCurPage + 1;
            setTextInfoCurPage(page);
            console.log('info TEXT_LIVE page ', page);
            getTextInfosForLive();
          }
          break;
        case NavTabTypes.IMPORTANT_EVENT:
          if (importantEventCurPage < importantEventTotalPage) {
            let page = importantEventCurPage + 1;
            setImportantEventCurPage(page);
            getImportantEventsForLive();
          }
          break;
        default:
          break;
        }
      }
    }
  }
  React.useEffect(() => {
    getCompetitionEventStat();
    getTextInfosForLive();
    getImportantEventsForLive();
    return () => {
      setImportantEventInfos([]);
      // console.log('info unmount ', textLiveInfos.length);
    };
  }, []);
  React.useEffect(() => {
    if (props.eventStatData) {
      updateCompetitionEventStat(props.eventStatData);
    }
  }, [props.eventStatData]);

  const handleNetWorkErrorClick = React.useCallback(() => {
    setDetailTabsError(false);
    getCompetitionEventStat();
    getTextInfosForLive();
    getImportantEventsForLive();
  }, [getCompetitionEventStat, getTextInfosForLive, getImportantEventsForLive, setDetailTabsError]);

  return (
    <View style={styles.container}>
      {detailTabsError ? netStatus ? <NetWorkError onPress={handleNetWorkErrorClick} /> : <NoInternet /> : <ScrollView 
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={15}
        onScroll={onScrollHandler}
      >
        <View>
          <View style={[cstyle.flexDirecR, cstyle.flexJcSb, cstyle.flexAiC, cstyle.pd20]}>
            <View style={[cstyle.flexDirecR, cstyle.flexAiC]}>
              <View style={[styles.iconDot, styles.bgGreen]}></View>
              <View><Text style={styles.footballHomeNameStyle}>{homeTeam.name}</Text></View>
            </View>
            <View style={[cstyle.flexDirecR, cstyle.flexAiC]}>
              <View><Text style={styles.footballAwayNameStyle}>{awayTeam.name}</Text></View>
              <View style={[styles.iconDot, styles.bgOrange]}></View>
            </View>  
          </View>
          <View style={styles.eventsWpBg}>
            <ShadowBox
              // inner // <- enable inner shadow
              useSvg // <- set this prop to use svg on ios
              style={{
                shadowOffset: {width: px(5), height: px(10)},
                shadowOpacity: theme.shadowOpacity,
                shadowColor: theme.shadowColor,
                shadowRadius: px(10),
                borderRadius: px(20),
                backgroundColor: theme.background.colorWhite,
                width: px(710),
                height: px(520),
              }}
            >
              <View style={styles.eventsWp}>
                {eventStat && eventStat.map((item, i) => (
                  <EventBar name={item.name} leftRateNum={item.home} rightRateNum={item.away} formater={item.formater} key={i} />
                ))}
              </View>
            </ShadowBox>
          </View>
          <View style={styles.dynamicEvent} >
            <View style={[cstyle.flexAiC, cstyle.mgT20]}>
              <CheckedNav {...props} navBarTabsConfig={navBarTabsConfig} itemStyle={{width: px(150)}} onPress={liveTabHanlder} />
            </View>
            <View style={styles.textLive}>
              {curLiveTab === NavTabTypes.TEXT_LIVE ? textLiveInfos &&
                textLiveInfos.length === 0 ? <NoDataPlaceHolder msg="暂无相关文字直播信息" /> :
                textLiveInfos.map((item, i) => (
                  <TextLiveInfoFlow 
                    key={i} 
                    type={item.type} 
                    time={item.time} 
                    isFirst={i === 0} 
                    text={item.data} 
                    i={i} 
                  />
                )) : <></>}
              {curLiveTab === NavTabTypes.IMPORTANT_EVENT ? importantEventInfos &&
                importantEventInfos.length === 0 ? <NoDataPlaceHolder msg="暂无相关重要事件信息" /> :
                importantEventInfos.map((item, i) => (
                  <TextLiveInfoFlow 
                    key={i} 
                    type={item.type} 
                    time={item.time} 
                    isFirst={i === 0} 
                    text={item.data}
                  />
                )) : <></>}
            </View>
          </View>
        </View>
      </ScrollView>}
    </View>
  );
}

export default connect(mapState)(React.memo(DetailLive));

const styles = StyleSheet.create({
  container: {
    // padding: px(20),
  },
  iconDot: {
    width: px(20),
    height: px(20),
    borderRadius: px(10)
  },
  bgGreen: {
    backgroundColor: theme.competition.detail.iconDotBgColorGreen
  },
  bgOrange: {
    backgroundColor: theme.competition.detail.iconDotBgColorOrange
  },
  teamNameRow: {
  },
  eventsWpBg: {
    width: '100%',
    paddingLeft: px(20),
    paddingRight: px(20)
  },
  eventsWp: {
    backgroundColor: theme.background.colorWhite,
    borderRadius: px(20),
    paddingTop: px(30),
    // paddingBottom: px(30),
  },
  eventItemRow: {
    width: '100%',
    height: px(54),
    paddingLeft: px(20),
    paddingRight: px(20),
  },
  eventNameWp: {
    flex: 1
  },
  eventName: {
    color: theme.competition.detail.eventNameTxtColor,
    fontSize: px(22)
  },
  eventRowL: {
    width: px(80)
  },
  eventRowR: {
    width: px(80)
  },
  rateBar: {
    width: px(210),
    height: px(12),
    borderRadius: px(6),
    backgroundColor: theme.competition.background.color1
  },
  rateNumWp: {
    width: px(70),
    alignItems: 'center',
    // justifyContent: 'center',
    // borderWidth: 1
  },
  progressBar: {
    height:'100%',
    borderRadius: px(6),
  },
  rateNum: {
    color: theme.competition.detail.eventNameTxtColor,
    fontSize: px(20)
  },
  dynamicEvent: {
    backgroundColor: theme.background.colorWhite,
    marginTop: px(20),
    minHeight: px(400)
  },
  textLive: {
    padding: px(20)
  },
  footballHomeNameStyle: {
    fontSize: px(20),
    marginLeft: px(10),
    color: theme.text.color18
  },
  footballAwayNameStyle: {
    fontSize: px(20),
    marginRight: px(10),
    color: theme.text.color18
  }
});
