import * as React from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View, ImageBackground, Animated, Easing } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { CompetitionListItemTypes } from '../../utils/constant';
import { cstyle, theme, px, txtEllipsis } from '../../styles';
import { dateFormat } from '../../utils/date';
import { getMatchStatus, MatchStaus, isHalftime } from '../../utils/matchCommon';
import { secondsToMinutes, fmtOverTime, ONE_MINUTE, ONE_SECOND } from '../../utils/date';
import { getValue, isUdf } from '../../utils/common';
import usePrevious from '../../hooks/UsePrevious';
import EventBus from '../../utils/eventBus';

const IMAGE_BASE_DIR = '../../assets/images/';
const imageSkewRedBg = require(IMAGE_BASE_DIR + 'icon-sent-r.png');
const imageSkewYellowBg = require(IMAGE_BASE_DIR + 'icon-sent-y.png');
const imageAddFavourite = require(IMAGE_BASE_DIR + 'icon-star.png');
const imageOnFavourite = require(IMAGE_BASE_DIR + 'icon-star-active.png');
const imageVideoTypeLive = require(IMAGE_BASE_DIR + 'icon-live.png');
const imageVideoTypeAni = require(IMAGE_BASE_DIR + 'icon-sp3.png');
const iconFootball = require(IMAGE_BASE_DIR + 'icon-football.png');
const iconCornerKick = require(IMAGE_BASE_DIR + 'icon-sp2-1.png');

function Basketball(props) {
  let { data } = props;
  // console.log('info Football props=', props)
  // data.fav = 'y';
  // data.video = 1;
  // data.match_time = Date.now() + 100030;
  let [aniBlink] = React.useState(new Animated.Value(0));
  let [aniBlinkObj, setAniBlinkObj] = React.useState(null);
  let [playingTime, setPlayingTime] = React.useState(0);
  let [timerObj, setTimerObj] = React.useState({});
  const HALF_TIME = 45;
  const prevTeeTime = usePrevious(data.tee_time);
  function updateFavourite() {
    props.updateFavourite && props.updateFavourite(data.id, data.fav);
  }
  const navigation = useNavigation();
  function goto() {
    EventBus.removeListenser('evtNofityToMatchListPage');
    navigation.navigate('CompetitionDetail', { id: data.id, match_id: data.match_id });
  }
  function getOddChangedStyle(change) {
    return change === 'up' ? styles.txtRed1 : change === 'down' ? styles.txtGreen : styles.txtBlack;
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
    // let timer;
    // let intever;
    if (status === MatchStaus.IN_PLAY) {
      // console.log('info prevTeeTime=', prevTeeTime, data.tee_time)
      if (prevTeeTime !== data.tee_time) {
        startBlinkAni();
        let inPlayTime = data.tee_time - data.match_time;
        // let firstRemainMinute = (60 - inPlayTime % 60) * ONE_SECOND
        // console.log('setPlayingTime firstRemainMinute= ', firstRemainMinute, inPlayTime, inPlayTime / 60)
        setPlayingTime(secondsToMinutes(inPlayTime));
        // timer = setTimeout(() => {
        // setPlayingTime((playingTime) => playingTime + 1)
        clearInterval(timerObj.intever);
        timerObj.intever = setInterval(() => {
          setPlayingTime((playingTime) => playingTime + 1);
        }, 60000);
        // }, firstRemainMinute)
      }
    }

    return () => {
      if (aniBlink.setValue) {
        aniBlink.setValue(0);
      }
      // clearTimeout(timer);
      clearInterval(timerObj.intever);
    };
  }, [data.tee_time]);
  function noDataOnBottomRow() {
    return isUdf(data.home_odds) && isUdf(data.tie_odds) && isUdf(data.away_odds) && isUdf(data.half_court_score)
      && isUdf(data.half_court_score_kedui) && isUdf(data.home_odds2) && isUdf(data.tie_odds2) && isUdf(data.away_odds2);
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
  const hasVideo = data.video === 1 || data.animation === 1;
  const imageVideoIcon = data.video === 1 ? imageVideoTypeLive : data.animation === 1 ? imageVideoTypeAni : undefined;
  const imageFavourite = data.fav === 'y' ? imageOnFavourite : imageAddFavourite;
  const homeHasActiveEvent = data.homeHasActiveEvent;
  const awayHasActiveEvent = data.awayHasActiveEvent;
  const matchTime = dateFormat(new Date(data.match_time * 1000), 'hh : mm');
  const status = getMatchStatus(data.match_status);
  // status = MatchStaus.DELAY;
  // data.match_detail = '因疫情推迟 因疫情推迟 因疫情推迟 因疫情推迟 因疫情推迟 因疫情推迟';
  // const containerBd = (status === MatchStaus.DELAY && data.match_detail || props.isLastItem) ? {} : styles.borderBottom;
  const containerBd = styles.borderBottom;
  const containDelayStyle = (status === MatchStaus.DELAY && data.match_detail) ? { paddingBottom: px(12) } : {};

  function notUdfAndZero(v) {
    return !isUdf(v) && v !== 0;
  }

  function InPlayView() {
    if (isHalftime(data.match_status)) {
      return <Text style={[styles.txtRed, styles.size20, styles.layoutMidWp]}>中</Text>;
    } else {
      return (
        <View style={[cstyle.flexDirecR, cstyle.flexAiC, cstyle.flexJcC, styles.layoutMidWp]}>
          <Text style={[styles.txtRed, styles.size20]}>{fmtOverTime(playingTime)}</Text>
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
    return status === MatchStaus.IN_PLAY && playingTime > HALF_TIME && !isHalftime(data.match_status);
  }

  function HalfScore() {
    // 半场结束，赛果 无需校验
    if (isHalfOver() || status === MatchStaus.ENDS) {
      return <Text style={[styles.txtGreen, styles.size20, styles.layoutMidWp]}>{`(${getValue(data.halfHomeSoce)}-${getValue(data.half_court_score_kedui)})`} </Text>;
    } else {
      return <Text style={[styles.txtGreen, styles.size20, styles.layoutMidWp]}>{notUdfAndZero(data.halfHomeSoce) || notUdfAndZero(data.half_court_score_kedui) ? `(${getValue(data.halfHomeSoce)}-${getValue(data.half_court_score_kedui)})` : ''} </Text>;
    }
  }

  // -{props.index}-{data.id}
  if (props.itemType === CompetitionListItemTypes.AGENDA || status === MatchStaus.WAITING_BEGIN) {
    elements = (
      <View style={[styles.container, containerBd, firstItemStyle, lastItemStyle]}>
        <TouchableOpacity activeOpacity={theme.clickOpacity} onPress={goto} style={cstyle.flex1}>
          <View style={[cstyle.flexDirecR, cstyle.flexAiC, cstyle.flexJcC]}>
            <View style={[styles.lsL, styles.matchName]}><Text style={styles.size20}>{txtEllipsis(data.event_saishi, 8)}</Text></View>
            <View style={[cstyle.flexDirecR, cstyle.flexAiC, cstyle.flexJcC, { width: px(210) }]}>
              {status === MatchStaus.DELAY && <Text style={styles.size20}>推</Text>}
              {status === MatchStaus.WAITING_BEGIN && <Text style={styles.size20}>未</Text>}
            </View>
            <View style={[styles.lsR, cstyle.flex1]}><Text style={[cstyle.txtC, styles.planInfo, styles.size20]}>计划3</Text></View>
          </View>
          <View style={[cstyle.flexDirecR, cstyle.flexAiC, cstyle.flexJcSb, cstyle.mgT10]}>
            <Text style={[styles.txtGray, styles.lsL, styles.size20]}>{matchTime}</Text>
            <View style={[cstyle.flexDirecR, cstyle.flexAiC, cstyle.flexJcC, cstyle.flex1]}>
              <View style={[cstyle.flexDirecR, cstyle.flex1, cstyle.flexJcFe]}><Text style={[cstyle.fwB, styles.txtBlack, styles.teamName]}>{txtEllipsis(data.teamname_zhudui)}</Text></View>
              <Text style={[cstyle.fwB, cstyle.pdL20, cstyle.pdR20]}>-</Text>
              <View style={[cstyle.flexDirecR, cstyle.flex1]}><Text style={[cstyle.fwB, styles.txtBlack, styles.teamName]}>{txtEllipsis(data.kedui)}</Text></View>
            </View>
            <View style={[styles.lsR, cstyle.flexDirecR, cstyle.flexJcC]}>
              <View style={[styles.videoType, styles.videoWp]}>
                {hasVideo && <Image source={imageVideoIcon} style={styles.video} />}
              </View>
            </View>
          </View>
          <View style={cstyle.flexDirecR}>
            <View style={styles.lsL}>
              <TouchableOpacity style={styles.favourite} onPress={updateFavourite}>
                <Image source={imageFavourite} style={styles.favouriteImage} />
              </TouchableOpacity>
            </View>
            <View style={[cstyle.flexDirecR, cstyle.flexAiC, cstyle.flexJcC, cstyle.flex1, styles.listTip]}>
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
          <TouchableOpacity activeOpacity={theme.clickOpacity} onPress={goto} style={cstyle.flex1}>
            <View style={[cstyle.flexDirecR, cstyle.flexAiC, cstyle.flexJcC]}>
              <View style={[styles.lsL, styles.matchName]}><Text style={styles.size20}>{txtEllipsis(data.event_saishi, 8)}</Text></View>
              <Text style={[styles.txtGray, styles.lsL, styles.size20, styles.blsLa]}>{matchTime}</Text>
              <View style={[cstyle.flexDirecR, cstyle.flexAiC, cstyle.flex1]}>
                {/* <Text style={[styles.txtGray, styles.size20, cstyle.mgL10]}>一球/半</Text>
              <View style={[cstyle.flexDirecR, cstyle.flexAiC, cstyle.flexJcC, styles.matchStatus]}>

                {status === MatchStaus.DELAY && <Text style={[styles.size20, styles.layoutMidWp]}>推</Text>}
                {status === MatchStaus.WAITING_BEGIN && <Text style={[styles.size20, styles.layoutMidWp]}>未</Text>}
                {status === MatchStaus.ENDS && <Text style={[styles.txtRed, styles.size20, styles.layoutMidWp]}>完</Text>}
                {status === MatchStaus.IN_PLAY && <View style={[cstyle.flexDirecR, cstyle.flexAiC]} >
                  <InPlayView />
                </View>}
              </View>
              <View style={[cstyle.flexDirecR, cstyle.flexAiC, cstyle.flex1, cstyle.mgL10]}>
                {(notUdfAndZero(data.point_score) || notUdfAndZero(data.point_score_kedui)) && <>
                  <Image source={iconFootball} style={styles.iconFootball} />
                  <Text style={[styles.txtGray, styles.size20, cstyle.mgR20]}>{getValue(data.point_score)}/{getValue(data.point_score_kedui)}</Text>
                  </>
                }
                {(notUdfAndZero(data.corner_kick) || notUdfAndZero(data.corner_kick_kedui)) ? <Image source={iconCornerKick} style={[styles.iconFootball]} /> : <></>}
                {(notUdfAndZero(data.corner_kick) || notUdfAndZero(data.corner_kick_kedui)) && <Text style={[styles.txtGray, styles.size20]}>{data.corner_kick}-{data.corner_kick_kedui}</Text>}
              </View>*/}
                <Text style={styles.txtYellow}>第一节 10:00</Text>
              </View>
              <View style={styles.lsR}><Text style={[cstyle.txtC, styles.planInfo, styles.size20]}>计划3</Text></View>
            </View>
            <View style={[cstyle.flexDirecR, cstyle.flexAiC, cstyle.flexJcSb, cstyle.mgT10]} >
              <View style={[cstyle.flexDirecR, cstyle.flexAiC, cstyle.flexJcC, cstyle.flex1]} onClick={() => goto()}>
                <View style={[cstyle.flexDirecR, cstyle.flex1, cstyle.flexJcFe, cstyle.flexAiC]}>
                  {data.red_card > 0 && <View style={[cstyle.mgR10, styles.redCard]}>
                    <ImageBackground source={imageSkewRedBg} style={styles.cardBgImage}>
                      <Text style={[cstyle.txtC, styles.size20, styles.cardTxt, styles.txtWhite]}>{data.red_card}</Text>
                    </ImageBackground>
                  </View>}
                  {data.yellow_card > 0 &&
                    <View style={[cstyle.mgR10, styles.yellowCard]}>
                      <ImageBackground source={imageSkewYellowBg} style={styles.cardBgImage}>
                        <Text style={[cstyle.txtC, styles.size20, styles.cardTxt, styles.txtGray1]}>{data.yellow_card}</Text>
                      </ImageBackground>
                    </View>}
                  <View style={homeHasActiveEvent ? styles.teamNameLightHeight : undefined}><Text style={[cstyle.fwB, styles.txtBlack, styles.teamName]}>{!isUdf(data.league_ranking) && data.league_ranking !== 0 ? `[${data.league_ranking}]` : ''}{txtEllipsis(data.teamname_zhudui)}</Text></View>
                </View>
                {status == MatchStaus.DELAY && <Text style={[cstyle.fwB, styles.layoutMidWp]}>-</Text>}
                {status != MatchStaus.DELAY && <Text style={[cstyle.fwB, styles.txtRed, styles.layoutMidWp]}>{data.homeScore}-{data.awayScore}</Text>}
                <View style={[cstyle.flexDirecR, cstyle.flex1, cstyle.flexAiC]}>
                  <View style={awayHasActiveEvent ? styles.teamNameLightHeight : undefined}><Text style={[cstyle.fwB, styles.txtBlack, styles.teamName]}>{txtEllipsis(data.kedui)}{!isUdf(data.league_ranking_kedui) && data.league_ranking_kedui !== 0 ? `[${data.league_ranking_kedui}]` : ''}</Text></View>
                  {data.yellow_card_kedui > 0 && <View style={[styles.yellowCard, cstyle.mgL10]}>
                    <ImageBackground source={imageSkewYellowBg} style={styles.cardBgImage}>
                      <Text style={[cstyle.txtC, styles.size20, styles.cardTxt, styles.txtGray1]}>{data.yellow_card_kedui}</Text>
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
                  <Text style={[getOddChangedStyle(data.yapan_home_odds_up_down_flag), styles.size20]}>{data.home_odds}</Text>
                  <Text style={[cstyle.mgL20, cstyle.mgR20, styles.size20]}><Text style={styles.txtRed}>{data.tie_odds ? '*' : ''}</Text><Text style={styles.txtGray}>{data.tie_odds}</Text></Text>
                  <Text style={[getOddChangedStyle(data.yapan_away_odds_updown_flag), styles.size20]}>{data.away_odds}</Text>
                </View>
                <HalfScore />
                <View style={[cstyle.flexDirecR, cstyle.flex1]}>
                  <Text style={[getOddChangedStyle(data.daxiaoqiu_home_odds_up_down_flag), styles.size20]}>{data.home_odds2}</Text>
                  <Text style={[styles.txtGray, cstyle.mgL20, cstyle.mgR20, styles.size20]}>{data.tie_odds2}</Text>
                  <Text style={[getOddChangedStyle(data.daxiaoqiu_away_odds_updown_flag), styles.size20]}>{data.away_odds2}</Text>
                </View>
              </View>
              {showDelayCauseOnThePlace(status) && <View style={[styles.listTip, cstyle.flex1]}><Text style={styles.listTipTxt}>{txtEllipsis(data.match_detail, 25)}</Text></View>}
              <View style={styles.lsR}></View>
            </View>
            <View style={[cstyle.flexDirecR, cstyle.flexJcFe]}>
              <Text style={[styles.txtGray, styles.lsL, styles.size20, styles.blsL]}>分差半30 全-</Text>
              <Text style={[styles.txtGray, styles.lsL, styles.size20, styles.blsL]}>总分半70</Text>
            </View>
            {hasDelayCause(status) && !noDataOnBottomRow() && <View style={styles.listTip}><Text style={styles.listTipTxt}>{txtEllipsis(data.match_detail, 25)}</Text></View>}
          </TouchableOpacity>
        </View>

      </>
    );
  }
  return elements;
}

export default React.memo(Basketball);

const styles = StyleSheet.create({
  container: {
    minHeight: px(142),
    paddingTop: px(16),
    paddingBottom: px(16),
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
  txtCoffee: {
    color: theme.competitionListItem.textColorCoffee
  },
  txtBlue: {
    color: theme.competitionListItem.textCoorBlue
  },
  txtWhite: {
    color: theme.text.colorWhite
  },
  txtYellow: {
    color: theme.text.color26,
    fontSize: theme.text.size20
  },
  blsL: {
    minWidth: px(66),
  },
  favourite: {
    width: px(66),
    height: px(33),
    alignItems: 'center'
  },
  favouriteImage: {
    width: px(34),
    height: px(33)
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
    width: px(26),
    height: px(22),
    lineHeight: px(22),
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
    height: px(22),
    lineHeight: px(22)
  },
  redCard: {
    width: px(26),
    height: px(22),
    lineHeight: px(22),
    // backgroundColor: theme.competitionListItem.redCardBgColor,
    transform: [{ skewX: '350deg' }]
  },
  iconFootball: {
    width: px(14),
    height: px(14),
    marginLeft: px(4),
    borderWidth: 1
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
    width: px(145),
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
