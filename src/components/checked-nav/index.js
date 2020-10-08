import * as React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { px } from '../../utils/adapter';
import cstyle from '../../styles/common';
import theme from '../../styles/theme';

export default function CheckedNav(props) {
  let [navBarTabs] = React.useState(props.navBarTabsConfig);
  let [curTabIdx, setCurTabIdx] = React.useState(0);
  let tabHandler = (tab, i) => {
    if (props.canSwitch !== false) {
      setCurTabIdx(i);
      props.onPress && props.onPress(tab, i);
    }
  };
  return (
    <View>
      <View style={[cstyle.flexDirecR, cstyle.flexJcC,styles.navNarTabs, props?.style || {}]}>
        {navBarTabs.map((tab, i) => (
          <View key={i} style={[styles.tabItem, curTabIdx === i ? styles.active : {}, i === 0 ? styles.leftRadius : {}, i === navBarTabs.length - 1 ? styles.rightRadius : {}, props?.itemStyle || {}]} >
            <TouchableOpacity activeOpacity={1} onPress={() => tabHandler(tab, i)} style={[cstyle.flex1, cstyle.flexAiC, cstyle.flexJcC]}>
              <Text style={curTabIdx === i ? styles.activeTextColor : styles.normalTxtColr}>{tab.title}</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  navNarTabs: {
    fontSize: px(26)
  },
  tabItem: {
    minWidth: px(140),
    height: px(60),
    borderRightWidth: px(2),
    borderTopWidth: px(2),
    borderBottomWidth: px(2),
    borderColor: theme.competitionHeader.navBarTabBd
  },
  leftRadius: {
    borderLeftWidth: px(2),
    borderTopLeftRadius: px(30),
    borderBottomLeftRadius: px(30)
  },
  rightRadius: {
    borderTopRightRadius: px(30),
    borderBottomRightRadius: px(30)
  },
  active: {
    backgroundColor: theme.competitionHeader.navBarActiveBgColor,
  },
  normalTxtColr: {
    color: theme.text.color6,
    fontSize: px(26)
  },
  activeTextColor: {
    color: theme.competitionHeader.navBarTabActiveTxtColor,
    fontSize: px(26)
  }
});
