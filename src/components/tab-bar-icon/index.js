import * as React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import theme from '../../styles/theme';
import { px } from '../../utils/adapter';
const IMAGE_BASE_DIR = '../../assets/images/';

const images = {
  competition: {
    default: require(IMAGE_BASE_DIR + 'score.png'),
    selected: require(IMAGE_BASE_DIR + 'score-active.png'),
  },
  predict: {
    default: require(IMAGE_BASE_DIR + 'predict.png'),
    selected: require(IMAGE_BASE_DIR + 'predict-active.png'),
  },
  koksport: {
    // default: require(IMAGE_BASE_DIR + 'kok-sport.png'),
    // selected: require(IMAGE_BASE_DIR + 'kok-sport.png'),
    default: require(IMAGE_BASE_DIR + 'xf-logo.png'),
    selected: require(IMAGE_BASE_DIR + 'xf-logo.png'),
  },
  news: {
    default: require(IMAGE_BASE_DIR + 'news.png'),
    selected: require(IMAGE_BASE_DIR + 'news-active.png'),
  },
  my: {
    default: require(IMAGE_BASE_DIR + 'my.png'),
    selected: require(IMAGE_BASE_DIR + 'my-active.png'),
  }
};

export default function TabBarIcon(props) {
  const curIcon = images[(props.name || '')];
  const isKoKSport = props.name === 'koksport';
  return (
    <View style={[styles.tabIconWp, isKoKSport ? styles.kokSport : {}]}>
      <Image source={props.focused ? curIcon?.selected : curIcon?.default} style={[styles.tabIcon, isKoKSport ? styles.kokSportTabIcon : {}]}/>
    </View>
  );
}

const styles = StyleSheet.create({
  tabIconWp: {
    width: px(38),
    height: px(38)
  },
  kokSport: {
    width: px(92),
    height: px(94),
    backgroundColor: theme.tabBarOptions.backgroundColor,
    borderRadius: px(50),
    marginTop: px(-36),
    paddingRight: px(10),
    paddingLeft: px(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabIcon: {
    width: '100%',
    height: '100%'
  },
  kokSportTabIcon: {
    width: px(72),
    height: px(74)
  }
});
