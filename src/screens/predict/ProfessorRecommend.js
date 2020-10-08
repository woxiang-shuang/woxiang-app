import * as React from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import { cstyle, theme, px } from '../../styles';

const mapState = (state) => ({
});

const mapDispatch = {
};

/**
 * 专家推荐（足球、篮球）
 */
class ProfessorRecommend extends React.Component {
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

export default connect(mapState, mapDispatch)(ProfessorRecommend);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.screenBgColor,
  }
});
