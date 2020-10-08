import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Animated, Easing } from 'react-native';
import { cstyle, theme, px } from '../../styles';

const loadingImage = require('../../assets/images/loading.png');

export default function Loading(props) {
  let { content = '加载中...', style } = props;
  const spinValue = new Animated.Value(0);
  function startAni() {
    Animated.loop(Animated.timing(
      spinValue,
      {
        toValue: 1,
        duration: 3000,
        easing: Easing.inOut(Easing.linear),
        useNativeDriver: true
      }
    ), { iterations: -1 }).start();
  }
  const spinAni = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });
  useEffect(() => {
    startAni();
  }, []);
  return (<View style={[styles.container, style]}>
    <View style={[styles.loadingIconWp, cstyle.flexAiC]}>
      <Animated.Image source={loadingImage} style={[styles.loadingImage, {transform: [{ rotate: spinAni },{ perspective: 1000 }]}]} />
    </View>
    <View style={cstyle.flexAiC}><Text style={styles.content}>{content}</Text></View>
  </View>);
}

const styles = StyleSheet.create({
  container: {
    width: px(170),
    height: px(124),
    backgroundColor: theme.loadingBgColor,
    borderRadius: px(6),
    opacity: 0.9
  },
  loadingIconWp: {
    height: px(80),
    paddingTop: px(16)
  },
  loadingImage: {
    width: px(55),
    height: px(55)
  },
  content: {
    color: theme.text.colorWhite,
    fontSize: px(24)
  }
});
