import * as React from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import { cstyle, theme, px } from '../../styles';

const mapState = (state) => ({
});

const mapDispatch = {
};

/**
 * 发布猛料（足球、篮球）
 */
class Publish extends React.Component {
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

export default connect(mapState, mapDispatch)(Publish);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.screenBgColor,
  }
});
