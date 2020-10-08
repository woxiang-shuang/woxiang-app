import React from 'react';
import { View, StyleSheet, Image } from 'react-native';

import { px } from '../../../utils/adapter';
import theme from '../../../styles/theme';

const slideImage = require('../../../assets/images/article.png');

class SwiperPredict extends React.PureComponent {

  get renderDot () {
    return <View style={styles.dot}></View>;
  }

  get renderActiveDot() {
    return <View style={styles.activeDot}></View>;
  }

  render() {
    return (
      <View style={styles.container}>
        {/* <Swiper
          style={styles.wrapper}
          autoplay
          loop
          autoplayTimeout={2}
          dot={this.renderDot}
          activeDot={this.renderActiveDot}
          paginationStyle={styles.paginationStyle}
        >
          <View style={styles.slide}>
            <Image source={slideImage} style={styles.slideImg} />
          </View>
          <View style={styles.slide}>
            <Image source={slideImage} style={styles.slideImg} />
          </View>
          <View style={styles.slide}>
            <Image source={slideImage} style={styles.slideImg} />
          </View>
        </Swiper> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: px(300),
    marginTop: px(20),
    marginBottom: px(25)
  },
  wrapper: {},
  slide: {
    alignItems: 'center',
  },
  slideImg: {
    width: px(710),
    height: px(300),
    borderRadius: 8
  },
  dot: {
    width: px(8),
    height: px(8),
    backgroundColor: theme.background.color20,
    borderRadius: px(4),
    opacity: 0.4,
    marginHorizontal: px(12)
  },
  activeDot: {
    width: px(8),
    height: px(8),
    borderRadius: px(4),
    backgroundColor: theme.background.color20
  },
  paginationStyle: {
    bottom: px(22)
  }
});

export default SwiperPredict;
