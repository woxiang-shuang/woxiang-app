import * as React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View, ImageBackground, Animated, Easing } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { CompetitionListItemTypes } from '../../utils/constant';
import { cstyle, theme, px, txtEllipsis } from '../../styles';
import { dateFormat } from '../../utils/date';
import { getMatchStatus, MatchStaus, isHalftime } from '../../utils/matchCommon';
import { secondsToMinutes, fmtOverTime } from '../../utils/date';
import { getValue, isUdf } from '../../utils/common';
import usePrevious from '../../hooks/UsePrevious';
import EventBus from '../../utils/eventBus';
import {SetHandWatch} from '../../components/handWatch';
const IMAGE_BASE_DIR = '../../assets/images/';
const imageSkewRedBg = require(IMAGE_BASE_DIR + 'icon-sent-sr.png');
const imageSkewYellowBg = require(IMAGE_BASE_DIR + 'icon-sent-sy.png');
const imageAddFavourite = require(IMAGE_BASE_DIR + 'icon-star.png');
const imageOnFavourite = require(IMAGE_BASE_DIR + 'icon-star-active.png');
const imageVideoTypeLive = require(IMAGE_BASE_DIR + 'icon-live.png');
const imageVideoTypeAni = require(IMAGE_BASE_DIR + 'icon-sp3.png');
const iconFootball = require(IMAGE_BASE_DIR + 'icon-football.png');
const iconCornerKick = require(IMAGE_BASE_DIR + 'icon-sp2-1.png');

function Football(props) {
  const {
    component,
    data,
    date
  } = props;
  const cpt = {
    component,
    onPanResponderRelease:(_, gestureState) => {
      if (gestureState.dx < 5 && gestureState.dx > -5) {
        goto();
      }
    }
  };
  SetHandWatch({...cpt});
  
  // console.log('info Football props=', props)
  // data.fav = 'y';
  // data.video = 1;
  // data.match_time = Date.now() + 100030;
  let [aniBlink] = React.useState(new Animated.Value(0));
  let [aniBlinkObj, setAniBlinkObj] = React.useState(null);
  let [playingTime, setPlayingTime] = React.useState(0);
  let [timerObj, setTimerObj] = React.useState({});
  const HALF_TIME = 45;
  const prevTeeTime = usePrevious(data.teeTime);
  function updateFavourite() {
    props.updateFavourite && props.updateFavourite(data.id, data.fav);
  }
  const navigation = useNavigation();
  function goto() {
    data.matchTypeId = 1;
    EventBus.removeListenser('evtNofityToMatchListPage');
    navigation.navigate('CompetitionDetail', {...data, date});
  }
  function getOddChangedStyle(change) {
    return change === 1 ? styles.txtRed1 : (change === -1 ? styles.txtGreen : styles.txtBlack);
  }
  function startBlinkAni() {
    // console.log('aniBlinkObj?.stop', aniBlinkObj?.stop, Animated.stop, aniBlink.stop, aniBlink.stopAnimation)
    if (aniBlink.setValue) {
      aniBlink.setValue(0);
    }
    Animated.loop(
      Animated.timing(
        aniBlink,
        {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.linear),
          useNativeDriver: true
        }
      )
    ).start();
  }
  React.useEffect(() => {
    if (status === MatchStaus.IN_PLAY) {
      // console.log('info prevTeeTime=', prevTeeTime, data.teeTime)
      if (prevTeeTime !== data.teeTime) {
        startBlinkAni();
        let inPlayTime = Math.ceil((data.nowTime - data.teeTime) / 60 + 1);
        if (2 === data?.matchStatus) {// 上半场
          inPlayTime = Math.ceil((data.nowTime - data.teeTime) / 60 + 1);
        } else if (4 === data?.matchStatus) {// 下半场
          inPlayTime = Math.ceil((data.nowTime - data.teeTime) / 60 + 45 + 1);
        }
        if (inPlayTime < 0) inPlayTime = 0;
        setPlayingTime(inPlayTime);
        // console.log(`这场比赛${data.matchEventNameZh}的时间是${inPlayTime}`);
        clearInterval(timerObj.intever);
        timerObj.intever = setInterval(() => {
          setPlayingTime((playingTime) => playingTime + 1);
        }, 60000);
      }
    }
    return () => {
      if (aniBlink.setValue) {
        aniBlink.setValue(0);
      }
      // clearTimeout(timer);
      clearInterval(timerObj.intever);
    };
  }, [data.teeTime]);

  function noDataOnBottomRow() {
    return isUdf(data.asiaHomeEndOdds) && isUdf(data.asiaTieEndOdds) && isUdf(data.asiaAwayEndOdds) && isUdf(data.halfHomeSoce)
      && isUdf(data.halfAwaySoce) && isUdf(data.bsHomeEndOdds) && isUdf(data.bsTieEndOdds) && isUdf(data.bsAwayEndOdds);
  }

  function hasDelayCause(status) {
    return status === MatchStaus.DELAY && data.match_detail;
  }

  function showDelayCauseOnThePlace(status) {
    return hasDelayCause(status) && noDataOnBottomRow();
  }

  let elements = <></>;
  const firstItemStyle = props.isFirstItem ? styles.firstItem : undefined;
  const lastItemStyle = (props.isLastItem || (props.isLastItem && props.isFirstItem)) ? styles.lastItem : undefined;
  // console.log(`比赛id===${data.id}, 比赛名字===${data.matchEventNameZh}, 第一个===${ props.isFirstItem}, 最后一个===${props.isLastItem}`)
  const hasVideo = data.video === 1 || data.animation === 1;
  const imageVideoIcon = data.video === 1 ? imageVideoTypeLive : data.animation === 1 ? imageVideoTypeAni : undefined;
  const imageFavourite = data.fav === 'y' ? imageOnFavourite : imageAddFavourite;
  const homeHasActiveEvent = data.homeHasActiveEvent;
  const awayHasActiveEvent = data.awayHasActiveEvent;
  const matchTime = dateFormat(new Date(data.matchTime * 1000), 'hh : mm');
  const status = getMatchStatus(data?.matchStatus);
  // status = MatchStaus.DELAY;
  // data.match_detail = '因疫情推迟 因疫情推迟 因疫情推迟 因疫情推迟 因疫情推迟 因疫情推迟';
  // const containerBd = (status === MatchStaus.DELAY && data.match_detail || props.isLastItem) ? {} : styles.borderBottom;
  const containerBd = styles.borderBottom;
  const containDelayStyle = (status === MatchStaus.DELAY && data.match_detail) ? { paddingBottom: px(12) } : {};

  function notUdfAndZero(v) {
    return !isUdf(v) && v !== null;
  }

  function InPlayView() {
    if (isHalftime(data?.matchStatus)) {
      return <Text style={[styles.txtRed, styles.size20, styles.layoutMidWp]}>中</Text>;
    } else if (5 === data?.matchStatus) {
      return <Text style={[styles.txtRed, styles.size20, styles.layoutMidWp]}>加</Text>;
    } else {
      return (
        <View style={[cstyle.flexDirecR, cstyle.flexAiC, cstyle.flexJcC, styles.layoutMidWp]}>
          <Text style={[styles.txtRed, styles.size20,]}>{fmtOverTime(playingTime)}</Text>
          <Animated.Text style={[styles.txtRed, {
            height: px(30), opacity: aniBlink.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [0, 0, 1]
            })
          }]}><Text>&apos;</Text></Animated.Text>
        </View>
      );
    }
  }

  function isHalfOver() {
    return status === MatchStaus.IN_PLAY && playingTime > HALF_TIME && !isHalftime(data?.matchStatus);
  }

  function HalfScore() {
    // 半场结束，赛果 无需校验
    return <Text style={[styles.txtHarlf, styles.size20, styles.layoutMidWp]}>{notUdfAndZero(data.halfHomeSoce) || notUdfAndZero(data.halfAwaySoce) ? `(${getValue(data.halfHomeSoce)}-${getValue(data.halfAwaySoce)})` : ''} </Text>;
  }

  // -{props.index}-{data.id}
  if (props.itemType === CompetitionListItemTypes.AGENDA || status === MatchStaus.WAITING_BEGIN) {
    elements = (
      <View style={[styles.container, containerBd, firstItemStyle, lastItemStyle]}>
        <TouchableOpacity activeOpacity={theme.clickOpacity}  style={cstyle.flex1}>
          <View {...SetHandWatch(cpt)}>
            <View style={[cstyle.flexDirecR, cstyle.flexAiC, cstyle.flexJcC]}>
              <View style={[styles.lsL, styles.matchName]}><Text style={styles.size20}>{txtEllipsis(data.matchEventNameZh, 8)}</Text></View>
              <View style={[cstyle.flexDirecR, cstyle.flexAiC, cstyle.flexJcC, { width: px(222) }]}>
                {status === MatchStaus.DELAY && <Text style={styles.size20}>推迟</Text>}
                {/* {status === MatchStaus.WAITING_BEGIN && <Text style={styles.size20}>未</Text>} */}
              </View>
              <View style={[styles.lsR, cstyle.flex1]}><Text style={[cstyle.txtC, styles.planInfo, styles.size20]}>计划3</Text></View>
            </View>
            <View style={[cstyle.flexDirecR, cstyle.flexAiC, cstyle.flexJcSb, cstyle.mgT10]}>
              <Text style={[styles.txtGray, styles.lsL, styles.size20]}>{matchTime}</Text>
              <View style={[cstyle.flexDirecR, cstyle.flexAiC, cstyle.flexJcC, cstyle.flex1]}>
                <View style={[cstyle.flexDirecR, cstyle.flex1, cstyle.flexJcFe]}><Text style={[cstyle.fwB, styles.txtBlack, styles.teamName]}>{txtEllipsis(data.homeNameZh)}</Text></View>
                <Text style={[cstyle.fwB, cstyle.pdL20, cstyle.pdR20]}>{status === MatchStaus.WAITING_BEGIN ? 'vs' : '-'}</Text>
                <View style={[cstyle.flexDirecR, cstyle.flex1]}><Text style={[cstyle.fwB, styles.txtBlack, styles.teamName]}>{txtEllipsis(data.awayNameZh)}</Text></View>
              </View>
              <View style={[styles.lsR, cstyle.flexDirecR, cstyle.flexJcC]}>
                <View style={[styles.videoType, styles.videoWp]}>
                  {hasVideo && <Image source={imageVideoIcon} style={styles.video} />}
                </View>
              </View>
            </View>
          </View>
          <View style={cstyle.flexDirecR}>
            <View style={styles.lsL}>
              <TouchableOpacity style={styles.favourite} onPress={updateFavourite}>
                <Image source={imageFavourite} style={styles.favouriteImage} />
              </TouchableOpacity>
            </View>
            <View style={[cstyle.flexDirecR, cstyle.flexAiC, cstyle.flexJcC, cstyle.flex1, styles.listTip]} {...SetHandWatch(cpt)}>
              {status === MatchStaus.DELAY && data.match_detail && <Text style={styles.listTipTxt}>{txtEllipsis(data.match_detail, 25)}</Text>}
            </View>
            <View style={styles.lsR}></View>
          </View>
        </TouchableOpacity>
      </View>
    );
  } else {
    elements = (
      <>
        <View style={[styles.container, containerBd, firstItemStyle, lastItemStyle, containDelayStyle]}>
          <TouchableOpacity activeOpacity={theme.clickOpacity} style={cstyle.flex1}>
            <View style={[cstyle.flexDirecR, cstyle.flexAiC, cstyle.flexJcC]} {...SetHandWatch(cpt)}>
              <View style={[styles.lsL, styles.matchName]}><Text style={styles.size20}>{txtEllipsis(data.matchEventNameZh, 8)}</Text></View>
              {/* <View style={[styles.lsL, styles.matchName]}><Text style={styles.size20}>{data.id}</Text></View> */}
              <View style={[cstyle.flexDirecR, cstyle.flexAiC, cstyle.flexJcC, cstyle.flex1]}>
                <Text style={[styles.txtGray, styles.size20, cstyle.mgL10, { minWidth: px(66) }]}>{data.tieDishOdds}</Text>
                <View style={[cstyle.flexDirecR, cstyle.flexAiC, cstyle.flexJcC, styles.matchStatus]}>
                  {/* <Text style={[styles.txtRed, styles.size20]}>{fmtOverTime(playingTime)}</Text> */}
                  {status === MatchStaus.DELAY && <Text style={[styles.size20, styles.layoutMidWp]}>推迟</Text>}
                  {/* {status === MatchStaus.WAITING_BEGIN && <Text style={[styles.size20, styles.layoutMidWp]}>未</Text>} */}
                  {status === MatchStaus.ENDS && <Text style={[styles.txtRed, styles.size20, styles.layoutMidWp]}>完</Text>}
                  {status === MatchStaus.IN_PLAY && <View style={[cstyle.flexDirecR, cstyle.flexAiC]} >
                    <InPlayView />
                  </View>}
                </View>
                <View style={[cstyle.flexDirecR, cstyle.flexAiC, cstyle.flex1, cstyle.mgL10]}>
                  {<>
                    {/* <Image source={iconFootball} style={styles.iconFootball} /> */}
                    <Text style={[styles.txtGray, styles.size20, cstyle.mgR20, { minWidth: px(40) }]}>{getValue(data.bsDishTieOdds)}</Text>
                  </>
                  }
                  {(notUdfAndZero(data.cornerHomeCount) || notUdfAndZero(data.cornerAwayCount)) ? <Image source={iconCornerKick} style={styles.iconFootball} /> : <></>}
                  {(notUdfAndZero(data.cornerHomeCount) || notUdfAndZero(data.cornerAwayCount)) && <Text style={[styles.txtGray, styles.size20]}>{data.cornerHomeCount}-{data.cornerAwayCount}</Text>}
                </View>
              </View>
              <View style={styles.lsR}><Text style={[cstyle.txtC, styles.planInfo, styles.size20]}>计划3</Text></View>
            </View>
            <View style={[cstyle.flexDirecR, cstyle.flexAiC, cstyle.flexJcSb, cstyle.mgT10]} {...SetHandWatch(cpt)}>
              <Text style={[styles.txtGray, styles.lsL, styles.size20, styles.blsL]}>{matchTime}</Text>
              <View style={[cstyle.flexDirecR, cstyle.flexAiC, cstyle.flexJcC, cstyle.flex1]} onClick={() => goto()}>
                <View style={[cstyle.flexDirecR, cstyle.flex1, cstyle.flexJcFe, cstyle.flexAiC]}>
                  {data.redHomeCount > 0 && <View style={[cstyle.mgR10, styles.redCard]}>
                    <ImageBackground source={imageSkewRedBg} style={styles.cardBgImage}>
                      <Text style={[cstyle.txtC, styles.size20, styles.cardTxt, styles.txtWhite]}>{data.redHomeCount}</Text>
                    </ImageBackground>
                  </View>}
                  {data.yellowHomeCount > 0 &&
                    <View style={[cstyle.mgR10, styles.yellowCard]}>
                      <ImageBackground source={imageSkewYellowBg} style={styles.cardBgImage}>
                        <Text style={[cstyle.txtC, styles.size20, styles.cardTxt, styles.txtGray1]}>{data.yellowHomeCount}</Text>
                      </ImageBackground>
                    </View>}
                  {/* <View style={[homeHasActiveEvent ? styles.teamNameLightHeight : undefined]}><Text style={[cstyle.fwB, styles.txtBlack, styles.teamName]}>{!isUdf(data.league_ranking) && data.league_ranking !== 0 ? `[${data.league_ranking}]` : ''}{txtEllipsis(data.homeNameZh)}</Text></View> */}
                  <View style={homeHasActiveEvent ? styles.teamNameLightHeight : undefined}><Text style={[cstyle.fwB, styles.txtBlack, styles.teamName]}>{txtEllipsis(data.homeNameZh)}</Text></View>
                </View>
                {status == MatchStaus.DELAY && <Text style={[cstyle.fwB, styles.layoutMidWp]}>-</Text>}
                {status == MatchStaus.WAITING_BEGIN && <Text style={[cstyle.fwB, styles.layoutMidWp]}>vs</Text>}
                {status != MatchStaus.DELAY && status != MatchStaus.WAITING_BEGIN && <Text style={(status === MatchStaus.IN_PLAY) ? [cstyle.fwB, styles.txtBlue, styles.layoutMidWp] : ([cstyle.fwB, styles.txtRed, styles.layoutMidWp])}>{data.homeScore ? data.homeScore : 0}-{data.awayScore ? data.awayScore : 0}</Text>}
                {/* {status != MatchStaus.DELAY && <Text style={[cstyle.fwB, (status === MatchStaus.IN_PLAY) ? styles.txtBlue : ((status === MatchStaus.AGENDA) ? styles.txtBlack : styles.txtRed), styles.layoutMidWp]}>{data.homeScore ? data.homeScore : 0}-{data.awayScore ? data.awayScore : 0}</Text>} */}
                <View style={[cstyle.flexDirecR, cstyle.flex1, cstyle.flexAiC]}>
                  {/* <View style={[awayHasActiveEvent ? styles.teamNameLightHeight : undefined]}><Text style={[cstyle.fwB, styles.txtBlack, styles.teamName]}>{txtEllipsis(data.awayNameZh)}{!isUdf(data.league_ranking_kedui) && data.league_ranking_kedui !== 0 ? `[${data.league_ranking_kedui}]` : ''}</Text></View> */}
                  <View style={awayHasActiveEvent ? styles.teamNameLightHeight : undefined}><Text style={[cstyle.fwB, styles.txtBlack, styles.teamName]}>{txtEllipsis(data.awayNameZh)}</Text></View>
                  {data.yellowAwayCount > 0 && <View style={[styles.yellowCard, cstyle.mgL10]}>
                    <ImageBackground source={imageSkewYellowBg} style={styles.cardBgImage}>
                      <Text style={[cstyle.txtC, styles.size20, styles.cardTxt, styles.txtGray1]}>{data.yellowAwayCount}</Text>
                    </ImageBackground>
                  </View>}
                  {data.redAwayCount > 0 && <View style={[styles.redCard, cstyle.mgL10]}>
                    <ImageBackground source={imageSkewRedBg} style={styles.cardBgImage}>
                      <Text style={[cstyle.txtC, styles.size20, styles.cardTxt, styles.txtWhite]}>{data.redAwayCount}</Text>
                    </ImageBackground>
                  </View>}
                </View>
              </View>
              <View style={[styles.lsR, cstyle.flexDirecR, cstyle.flexJcC]}>
                <View style={[styles.videoType, styles.videoWp]}>
                  {hasVideo && <Image source={imageVideoIcon} style={styles.video} />}
                </View>
              </View>
            </View>
            <View style={[cstyle.flexDirecR, cstyle.flexAiC, cstyle.flexJcC]}>
              <View style={[styles.lsL, styles.blsL]}>
                {props.needFav !== false && <TouchableOpacity activeOpacity={theme.clickOpacity} style={styles.favourite} onPress={updateFavourite}>
                  <Image source={imageFavourite} style={styles.favouriteImage} />
                </TouchableOpacity>}
              </View>
              <View style={[cstyle.flexDirecR, cstyle.flexAiC, cstyle.flexJcC, cstyle.flex1, showDelayCauseOnThePlace(status) ? cstyle.hide : {}]}>
                <View style={[cstyle.flexDirecR, cstyle.flex1, cstyle.flexJcFe]}>
                  <Text style={[getOddChangedStyle(data.yapan_home_odds_up_down_flag), styles.size20]}>{data.asiaHomeEndOdds}</Text>
                  <Text style={[cstyle.mgL20, cstyle.mgR20, styles.size20]}><Text style={styles.txtRed}>{data.asiaTieEndOdds ? '*' : ''}</Text><Text style={styles.txtGray}>{data.asiaTieEndOdds}</Text></Text>
                  <Text style={[getOddChangedStyle(data.yapan_away_odds_updown_flag), styles.size20]}>{data.asiaAwayEndOdds}</Text>
                </View>
                <HalfScore />
                <View style={[cstyle.flexDirecR, cstyle.flex1]}>
                  <Text style={[getOddChangedStyle(data.daxiaoqiu_home_odds_up_down_flag), styles.size20]}>{data.bsHomeEndOdds}</Text>
                  <Text style={[styles.txtGray, cstyle.mgL20, cstyle.mgR20, styles.size20]}>{data.bsTieEndOdds}</Text>
                  <Text style={[getOddChangedStyle(data.daxiaoqiu_away_odds_updown_flag), styles.size20]}>{data.bsAwayEndOdds}</Text>
                </View>
              </View>
              {showDelayCauseOnThePlace(status) && <View style={[styles.listTip, cstyle.flex1]}><Text style={styles.listTipTxt}>{txtEllipsis(data.match_detail, 25)}</Text></View>}
              <View style={styles.lsR}></View>
            </View>
            {hasDelayCause(status) && !noDataOnBottomRow() && <View style={styles.listTip}><Text style={styles.listTipTxt}>{txtEllipsis(data.match_detail, 25)}</Text></View>}
          </TouchableOpacity>
        </View>

      </>
    );
  }
  return elements;
}

function updateCompare(prevProps, nextProps) {
  return prevProps.updateFlag === nextProps.updateFlag;
}

export default React.memo(Football, updateCompare);

const styles = StyleSheet.create({
  container: {
    minHeight: px(142),
    paddingTop: px(16),
    paddingBottom: px(14),
    paddingRight: px(12),
    paddingLeft: px(12),
    backgroundColor: theme.background.colorWhite,
  },
  borderBottom: {
    borderBottomWidth: px(2),
    borderBottomColor: theme.competitionListItem.borderBottomColor,
  },
  txtGray: {
    color: theme.text.colorGray
  },
  txtGray1: {
    color: theme.text.color13
  },
  txtRed: {
    color: theme.competitionListItem.textColorRed
  },
  txtRed1: {
    color: theme.text.colorRed1
  },
  txtBlack: {
    color: theme.competitionListItem.textColorBlack
  },
  txtGreen: {
    color: theme.competitionListItem.textColorGreen
  },
  txtHarlf: {
    color: theme.competitionListItem.harlfScoreColor
  },
  txtCoffee: {
    color: theme.competitionListItem.textColorCoffee
  },
  txtBlue: {
    color: theme.competitionListItem.textCoorBlue
  },
  txtWhite: {
    color: theme.text.colorWhite
  },
  blsL: {
    minWidth: px(66),
  },
  favourite: {
    width: px(58),
    justifyContent: 'center',
    alignItems: 'center'
  },
  favouriteImage: {
    width: px(34),
    height: px(34)
  },
  planInfo: {
    minWidth: px(60),
    height: px(30),
    fontSize: px(18),
    borderRadius: px(8),
    backgroundColor: theme.competitionListItem.plainInfoBgColor,
    color: theme.competitionListItem.plainInfoTxtColor,
    display: 'none' // 本期不做，增加了猛料再加
  },
  yellowCard: {
    // width: px(26),
    // height: px(22),
    // lineHeight: px(22),
    minWidth: px(18),
    height: px(24),
    lineHeight: px(24),
    // backgroundColor: theme.competitionListItem.yellowCardBgColor,
    // transform: [{ skewX: "350deg" }],
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center'
  },
  cardBgImage: {
    width: '100%',
    height: '100%'
  },
  cardTxt: {
    width: '100%',
    height: px(24),
    lineHeight: px(24),
    paddingLeft: px(2),
    paddingRight: px(2),
  },
  redCard: {
    // width: px(26),
    // height: px(22),
    // lineHeight: px(22),
    minWidth: px(18),
    height: px(24),
    lineHeight: px(24),
    // backgroundColor: theme.competitionListItem.redCardBgColor,
    // transform: [{ skewX: '350deg' }]
  },
  iconFootball: {
    width: px(14),
    height: px(14),
    marginLeft: px(4),
  },
  videoType: {
    width: px(30),
    height: px(28),
  },
  teamName: {
    maxWidth: px(186),
    fontSize: px(22)
  },
  teamNameLightHeight: {
    backgroundColor: theme.competition.lightHeightBgColorOrange,
    borderRadius: px(14),
    paddingLeft: px(10),
    paddingRight: px(10),
    opacity: 0.6
  },
  videoWp: {
    width: px(50),
    justifyContent: 'center',
    alignItems: 'center',
    // borderWidth: 1
  },
  video: {
    width: px(30),
    height: px(27)
  },
  firstItem: {
    borderTopLeftRadius: px(16),
    borderTopRightRadius: px(16),
  },
  lastItem: {
    borderBottomLeftRadius: px(16),
    borderBottomRightRadius: px(16),
    borderBottomWidth: 0
  },
  size20: {
    fontSize: theme.text.size20
  },
  lsR: {
    width: px(50)
  },
  matchName: {
    width: px(234),
    overflow: 'hidden'
  },
  matchStatus: {
    minWidth: px(60)
  },
  listTip: {
    // height: px(22),
    alignItems: 'center',
    // paddingBottom: px(10)
    overflow: 'hidden'
  },
  listTipTxt: {
    color: theme.text.color7,
    fontSize: px(22)
  },
  layoutMidWp: {
    width: px(80),
    textAlign: 'center'
  },
  bd: {
    borderWidth: 1
  }
});
