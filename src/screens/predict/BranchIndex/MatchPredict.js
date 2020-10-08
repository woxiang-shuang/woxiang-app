import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  ImageBackground
} from 'react-native';

import { px } from '../../../utils/adapter';
import theme from '../../../styles/theme';

const slideImage = require('../../../assets/images/article.png');

class MatchPredict extends React.PureComponent {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.title}>
          <View style={styles.titleLeft}>
            <Image
              source={require('../../../assets/images/title-comet.png')}
              style={styles.leftImage}
            />
            <ImageBackground
              source={require('../../../assets/images/title-bg2.png')}
              style={styles.leftTitBackg}
            >
              <Text style={styles.leftTit}>热门赛事</Text>
            </ImageBackground>
          </View>
          <View style={styles.titleRight}>
            <Image
              source={require('../../../assets/images/feather-grid.png')}
              style={styles.rightImages}
            />
            <Text style={styles.rightTit}>去看篮球</Text>
            <Image
              source={require('../../../assets/images/arrow-right.png')}
              style={styles.rightIcon}
            />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderBottomColor: theme.background.color18,
    borderBottomWidth: px(10),
    paddingTop: px(12),
    paddingBottom: px(20),
  },
  title: {
    paddingBottom: px(20),
    paddingHorizontal: px(20),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftImage: {
    width: px(40),
    height: px(40),
  },
  leftTitBackg: {
    marginLeft: px(10),
    height: px(38),
  },
  leftTit: {
    fontSize: px(26),
    lineHeight: px(38),
    color: theme.text.color37,
  },
  titleRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightImages: {
    width: px(24),
    height: px(24),
  },
  rightTit: {
    marginLeft: px(6),
    fontSize: px(18),
    color: theme.text.color25,
  },
  rightIcon: {
    width: px(10),
    height: px(16),
    marginLeft: px(10),
  }
});

export default MatchPredict;
