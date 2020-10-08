import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { px } from '../../utils/adapter';
import cstyle from '../../styles/common';
import theme from '../../styles/theme';

export default function NoDataPlaceHolder(props) {
  return (
    <View style={[styles.container, props.style || {}, props.show === false ? cstyle.hide : {}] || `no-data-placeholder-view ${props.style || ''} ${props.show === false ? 'hide' : ''}`}>
      <View style={[cstyle.flexAiC, styles.iconWp]}>
        <Image source={require('../../assets/images/EmptyState.png')} style={styles.icon} />
      </View>
      {props.msg && 
        <View style={[cstyle.flexDirecR, cstyle.flexAiC, cstyle.flexJcC]}>
          <Text style={styles.tipTxt}>{props.msg}</Text>
        </View>
      }
      <View>{props.children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: px(200),
  },
  iconWp: {
    
  },
  icon: {
    width: px(204),
    height: px(126)
  },
  tipTxt: {
    color: theme.text.color8,
    fontSize: px(24),
    marginTop: px(70)   
  }
});
