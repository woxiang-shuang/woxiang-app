import React from 'react';
import { Image, Platform, StyleSheet, Text, View } from 'react-native';
import { px } from '../../utils/adapter';
import cstyle from '../../styles/common';
import theme from '../../styles/theme';
import { ShadowBox } from 'react-native-neomorph-shadows';
import { CompetitionFootballEventTypes } from '../../utils/constant';

const IMAGE_BASE_DIR = '../../assets/images/';

const images = {
  [CompetitionFootballEventTypes.WILL_ENDS]: require(IMAGE_BASE_DIR + 'icon-whistle.png'),
  [CompetitionFootballEventTypes.CORNER_KICK]: require(IMAGE_BASE_DIR + 'icon-sp2.png'),
  [CompetitionFootballEventTypes.YELLOW_CARD]: require(IMAGE_BASE_DIR + 'icon-sent-y.png'),
  [CompetitionFootballEventTypes.RED_CARD]: require(IMAGE_BASE_DIR + 'icon-sent-r.png'),
  [CompetitionFootballEventTypes.OWN_GOAL]: require(IMAGE_BASE_DIR + 'icon-sport.png'),
  [CompetitionFootballEventTypes.GOAL_IN]: require(IMAGE_BASE_DIR + 'icon-soccer3.png'),
  [CompetitionFootballEventTypes.TWO_YELLOW_TO_RED]: require(IMAGE_BASE_DIR + 'icon-sent-yr.png'),
  [CompetitionFootballEventTypes.PENALTY_KICK]: require(IMAGE_BASE_DIR + 'icon-sport2.png'),
  [CompetitionFootballEventTypes.SUBSTITUTION]: require(IMAGE_BASE_DIR + 'icon-swap.png'),
};

function TXT_TIME(v) {
  if (typeof v === 'number') {
    return `${v}'`;
  } else {
    return v;
  }
}

function TextLiveInfoFlow(props) {
  let { type = '', text = '', time = '', isFirst = false } = props;
  return (
    <View style={cstyle.flexDirecR}>
      <View style={[cstyle.flexDirecR, cstyle.flexJcSb, styles.left]}>
        <Image source={images[type]} style={styles.typeImage} />
        <Text style={styles.time}>{TXT_TIME(time)}</Text>
        <ShadowBox
          useSvg // <- set this prop to use svg on ios
          style={styles.shadowBoxStyles}
        >
          <View style={[styles.iconCircle, isFirst ? styles.firstIconCircle : {}]}></View>
        </ShadowBox>
      </View>
      <View style={styles.right}>
        <ShadowBox
          // inner // <- enable inner shadow
          useSvg // <- set this prop to use svg on ios
          style={{
            shadowOffset: { width: px(5), height: px(10) },
            shadowOpacity: theme.shadowOpacity,
            shadowColor: isFirst ? theme.shadowColor : theme.shadowColorSecond,
            shadowRadius: px(10),
            borderRadius: px(20),
            backgroundColor: theme.background.colorWhite,
            width: px(750 - 40 - 80 - 40),
            height: px(90),
          }}
        >
          <Text style={styles.evntText}>{text}</Text>
        </ShadowBox>
      </View>
    </View>
  );
}

export default React.memo(TextLiveInfoFlow);

const styles = StyleSheet.create({
  container: {},
  left: {
    width: px(90),
    borderRightWidth: px(2),
    borderColor: theme.competition.detail.textLiveInfoFlowBdColor
  },
  time: {
    width: px(40),
    // borderWidth: 1,
    color: theme.competition.detail.textLiveInfoTimeTxtColor,
    fontSize: px(20),
    // flex: 1,
  },
  typeImage: {
    width: px(30),
    height: px(25),
    marginRight: px(10)
  },
  firstIconCircle: {
    backgroundColor: theme.competition.detail.textLiveInfofirstIconCircleBgColor
  },
  iconCircle: {
    width: px(20),
    height: px(20),
    borderWidth: px(4),
    borderColor: theme.border.color7,
    backgroundColor: theme.competition.detail.textLiveInfoIconCircleBgColor,
    borderRadius: px(10),
    marginRight: px(-10)
  },
  right: {
    padding: px(20)
  },
  evntText: {
    fontSize: px(24),
    color: theme.text.color31,
    flex: 1,
    paddingLeft: px(20),
    paddingRight: px(20),
    overflow: 'scroll'
  },
  shadowBoxStyles: {
    shadowOffset: { width: px(1), height: px(1) },
    shadowOpacity: theme.shadowOpacity,
    shadowColor: theme.text.color30,
    shadowRadius: px(10),
    borderRadius: px(10),
    backgroundColor: theme.background.colorWhite,
    width: px(20),
    height: px(20),
    marginRight: px(-10)
  }
});
