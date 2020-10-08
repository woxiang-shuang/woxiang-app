import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  ScrollView,
} from 'react-native';
import theme from '../../styles/theme';
export default class History extends Component {
  render() {
    return (
      <ScrollView style={styles.flex}>
        <Text style={styles.detail_text}>history</Text>
        <Text style={styles.back_text} onPress={this.goback.bind(this)}>
          返回
        </Text>
      </ScrollView>
    );
  }
 
  goback() {
    this.props.navigator.pop();
  }
}
 
const styles = StyleSheet.create({
  flex:{
    flex: 1,
  },
  detail_text:{
    fontSize: 16,
    margin: 10
  },
  back_text:{
    width: 80,
    backgroundColor: theme.backgroundColor.gary,
    color: theme.text.colorWhite,
    textAlign: 'center',
    fontSize: 18,
    alignSelf: 'center',
    marginTop: 20
  }
});
