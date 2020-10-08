import * as React from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import { cstyle, theme, px } from '../../styles';

const mapState = (state) => ({
});

const mapDispatch = {
};

/**
 * 赛事推荐
 */
class MatchRecommend extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  componentDidMount() {

  }
  render() {
    return (<View style={styles.container}>

    </View>);
  }
}

export default connect(mapState, mapDispatch)(MatchRecommend);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.screenBgColor,
  }
});
