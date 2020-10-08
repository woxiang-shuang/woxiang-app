import React, { useState, useEffect } from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View, Animated, ImageBackground } from 'react-native';
import { Row, Col } from '../../components/grid';
import cstyle, { txtEllipsis } from '../../styles/common';
import theme from '../../styles/theme';
import { px } from '../../utils/adapter';
import { ShadowBox } from 'react-native-neomorph-shadows';
import { CompetitionFootballEventTypes } from '../../utils/constant';
import { secondsToMinutes, fmtOverTime } from '../../utils/date';

const IMAGE_BASE_DIR = '../../assets/images/';

// const imageGoalInLeft = require(IMAGE_BASE_DIR + 'icon-soccer-l.png');
// const imageGoalInRight = require(IMAGE_BASE_DIR + 'icon-soccer-r.png');
const imageGoalInLeft = require(IMAGE_BASE_DIR + 'football.gif');
const imageGoalInRight = require(IMAGE_BASE_DIR + 'football.gif');
const imageRedCard = require(IMAGE_BASE_DIR + 'icon-sent-r.png');

export default function Football(props) {
  // console.log('info reminder football props=', props)
  let { matchName, matchTime = 0, teamHomeName, teamAwayName, homeScore, awayScore, homeRedCard, awayRedCard, eventTeamType, remiderType, style = {} } = props;
  let isHomeTeamEvent = eventTeamType === 'home';
  let isAwayTeamEvent = eventTeamType === 'away';
  let homeTeamEventTxtStyle = isHomeTeamEvent ? styles.activeTxt : {};
  let awayTeamEventTxtStyle = isAwayTeamEvent ? styles.activeTxt : {};
  React.useEffect(() => {
    let timeout = setTimeout(() => {
      props.showEnd && props.showEnd(props.id);
      // console.log('清除弹框的数据是=', props);
      clearTimeout(timeout);
    }, 10000);
    return () => {
      clearTimeout(timeout);
    };
  }, [matchName, matchTime, teamHomeName, teamAwayName, homeScore, awayScore, homeRedCard, awayRedCard, eventTeamType, remiderType]);

  function goto() {
    props.showEnd && props.showEnd(props.id);
  }

  return (<View style={[styles.container, style]}>
    <Animated.View
      style={{
        transform: [
          { perspective: 1000 }
        ]
      }}
    >
      <ShadowBox
        useSvg // <- set this prop to use svg on ios
        style={styles.shadowBoxStyle}
      >
        <TouchableOpacity activeOpacity={theme.clickOpacity} onPress={goto} style={cstyle.flex1}>
          <View style={styles.innerWp}>
            <View><Text style={[cstyle.fz20, styles.txtColor]}>{matchName}</Text></View>
            <View style={[cstyle.flexDirecR, cstyle.flexAiC, cstyle.mgT20]}>
              {/* <View><Text style={[cstyle.fz20, styles.txtColor]}>{secondsToMinutes(matchTime, 90, true)}'</Text></View> */}
              <View><Text style={[cstyle.fz20, styles.txtColor]}>{matchTime > 90 ? 90 : matchTime}{matchTime > 90 ? '+' : ''}&apos;</Text></View>
              <View style={[cstyle.flexDirecR, cstyle.flexAiC]}>
                <View style={[cstyle.flexDirecR, cstyle.flexAiC, cstyle.flex1, cstyle.flexJcFe]}>
                  {remiderType === CompetitionFootballEventTypes.RED_CARD && <View style={[styles.redCard, isHomeTeamEvent ? {} : cstyle.hide]}>
                    <ImageBackground source={imageRedCard} style={[cstyle.flex1, cstyle.flexAiC, cstyle.flexJcC]}>
                      <Text style={styles.redCardTxt}>{homeRedCard}</Text>
                    </ImageBackground>
                  </View>}
                  {remiderType === CompetitionFootballEventTypes.GOAL_IN && <View style={[styles.iconFootBall, isHomeTeamEvent ? {} : cstyle.hide]}>
                    <Image source={imageGoalInLeft} style={styles.iconFootBall} />
                  </View>}
                  <View style={[cstyle.mgL10, styles.teamName]}><Text style={[cstyle.fz22, styles.txtColor, homeTeamEventTxtStyle]}>{txtEllipsis(teamHomeName)}</Text></View>
                </View>
                <View style={[cstyle.flexDirecR, cstyle.flexAiC, cstyle.pdL20, cstyle.pdR20]}>
                  <View><Text style={[cstyle.fz22, homeTeamEventTxtStyle, isHomeTeamEvent ? cstyle.fz26 : {}]}>{homeScore}</Text></View>
                  <View><Text style={cstyle.fz22}>-</Text></View>
                  <View><Text style={[cstyle.fz22, awayTeamEventTxtStyle, isAwayTeamEvent ? cstyle.fz26 : {}]}>{awayScore}</Text></View>
                </View>
                <View style={[cstyle.flexDirecR, cstyle.flexAiC, cstyle.flex1]}>
                  <View style={[cstyle.mgR10, styles.teamName]}><Text style={[cstyle.fz22, styles.txtColor, awayTeamEventTxtStyle]}>{txtEllipsis(teamAwayName)}</Text></View>
                  {remiderType === CompetitionFootballEventTypes.GOAL_IN && <View style={[styles.iconFootBall, isAwayTeamEvent ? {} : cstyle.hide]}>
                    <Image source={imageGoalInRight} style={styles.iconFootBall} />
                  </View>}
                  {remiderType === CompetitionFootballEventTypes.RED_CARD && <View style={[styles.redCard, isAwayTeamEvent ? {} : cstyle.hide]}>
                    <ImageBackground source={imageRedCard} style={[cstyle.flex1, cstyle.flexAiC, cstyle.flexJcC]}>
                      <Text style={styles.redCardTxt}>{awayRedCard}</Text>
                    </ImageBackground>
                  </View>}
                </View>
              </View>
            </View>
            <View style={styles.bottomRow}>
              {remiderType === CompetitionFootballEventTypes.GOAL_IN && <Row style={cstyle.flexDirecR}>
                <Col span={10} style={cstyle.flexJcFe}><Text style={[cstyle.fz22, cstyle.txtC, isHomeTeamEvent ? styles.activeTxt : cstyle.hide]}>进球</Text></Col>
                <Col span={2}></Col>
                <Col span={10} style={cstyle.flexJcFs}><Text style={[cstyle.fz22, cstyle.txtC, isAwayTeamEvent ? styles.activeTxt : cstyle.hide]}>进球</Text></Col>
              </Row>}
              {remiderType === CompetitionFootballEventTypes.RED_CARD && <Row style={cstyle.flexDirecR}>
                <Col span={10} style={cstyle.flexJcFe}><Text style={[cstyle.fz22, cstyle.txtC, isHomeTeamEvent ? styles.activeTxt : cstyle.hide]}>红牌</Text></Col>
                <Col span={2}></Col>
                <Col span={10} style={cstyle.flexJcFs}><Text style={[cstyle.fz22, cstyle.txtC, isAwayTeamEvent ? styles.activeTxt : cstyle.hide]}>红牌</Text></Col>
              </Row>}
            </View>
          </View>
        </TouchableOpacity>
      </ShadowBox>
    </Animated.View>
  </View>);
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    // position: 'absolute',
    top: px(0),
    // bottom: 0,
    padding: px(20)
  },
  txtColor: {
    color: theme.competition.reminderTxtColor
  },
  innerWp: {
    borderRadius: px(20),
    paddingTop: px(10),
    paddingBottom: px(10),
    paddingLeft: px(20),
    paddingRight: px(20),
    backgroundColor: theme.competition.reminderBgColor
  },
  bottomRow: {
    minHeight: px(30),
    paddingLeft: px(160),
    paddingRight: px(80),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  teamName: {
    maxWidth: px(150)
  },
  iconFootBall: {
    // width: px(66),
    // height: px(46)
    width: px(30),
    height: px(30)
  },
  redCard: {
    // width: px(48),
    // height: px(52)
    // width: px(58),
    // height: px(52)
    width: px(38),
    height: px(52)
  },
  redCardTxt: {
    fontSize: theme.text.size26,
    color: theme.text.colorWhite
  },
  activeLeft: {
    paddingLeft: px(80)
  },
  activeRight: {
    paddingRight: px(80)
  },
  activeTxt: {
    fontSize: theme.text.size24,
    color: theme.text.color12,
    fontWeight: 'bold'
  },
  shadowBoxStyle: {
    shadowOffset: { width: px(2), height: px(2) },
    shadowOpacity: theme.shadowOpacity,
    shadowColor: theme.text.color30,
    shadowRadius: px(20),
    borderRadius: px(10),
    backgroundColor: theme.background.colorWhite,
    width: px(750 - 40),
    height: px(150),
    opacity: 0.9
  }
});
