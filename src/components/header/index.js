import * as React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { px } from '../../utils/adapter';
import theme from '../../styles/theme';
import cstyle from '../../styles/common';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Header({ scene, previous, navigation }) {
  // console.log('info Header scene=', scene, ' previous=', previous, ' navigation=', navigation);
  const { options } = scene.descriptor;
  const title =
    options.headerTitle !== undefined
      ? options.headerTitle
      : options.title !== undefined
        ? options.title
        : scene.route.name;
  let clickStartTime = Date.now();
  function goBack() {
    if (Date.now() - clickStartTime < 300) return;
    clickStartTime = Date.now();
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  }
  return (
    // <SafeAreaView>
    <View style={[cstyle.flexDirecR, styles.container, options.headerStyle || {}]}>
      <View style={styles.left}>
        {options.headerLeft && (typeof options.headerLeft !== 'function' ? <Text>{options.headerLeft}</Text> : options.headerLeft())}
        {!options.headerLeft && previous && <TouchableOpacity onPress={goBack} style={cstyle.flex1}>
          <View style={theme.iconBack}></View>
        </TouchableOpacity>}
      </View>
      <View style={[cstyle.flex1, cstyle.flexAiC, cstyle.flexJcC]}>
        {typeof title !== 'function' ? <Text>{title}</Text> : title()}
      </View>
      <View style={styles.right}>
        {options.headerRight && (typeof options.headerRight !== 'function' ? <Text>{options.headerRight}</Text> : options.headerRight())}
      </View>
    </View>
    // </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: px(90),
    backgroundColor: theme.header.backgroundColor,
  },
  left: {
    minWidth: px(80),
  },
  title: {},
  right: {
    minWidth: px(80),
    justifyContent: 'center',
    color: theme.text.color14
  }
});
