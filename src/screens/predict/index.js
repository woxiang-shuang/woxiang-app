/* eslint-disable react-native/no-color-literals */
import * as React from 'react';
import { 
  Image,
  StyleSheet, 
  Text,
  View,
  ScrollView
} from 'react-native';
import { connect } from 'react-redux';

import { px } from '../../utils/adapter';
import cstyle from '../../styles/common';
import theme from '../../styles/theme';
import SwiperPredict from './BranchIndex/SwiperPredict';
import PopularityPredict from './BranchIndex/PopularityPredict';
import MatchPredict from './BranchIndex/MatchPredict';

const mapState = (state) => ({
});

const mapDispatch = {
};

class Predict extends React.PureComponent {
  state;
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        {/* <SwiperPredict />
        <PopularityPredict />
        <MatchPredict />
        <Text>minglou</Text> */}
        <View style={[cstyle.flexAiC, { marginTop: px(200) }]}>
          <Image source={require('../../assets/images/other-Done.png')} style={{ width: px(216), height: px(130) }} />
          <Text style={styles.text} > 程序员小哥哥正在奋力赶工中...</Text>
        </View>
      </ScrollView >);
  }
}

export default connect(mapState, mapDispatch)(Predict);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background.colorWhite,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: theme.border.color3
  },
  text: {
    color: '#7586A1',
    marginTop: px(20)
  }
});
