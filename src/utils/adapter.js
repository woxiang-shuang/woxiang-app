import { Dimensions, Platform, StatusBar } from 'react-native';

export const designWidth = 750;
export const designHeight = 1334;

export let winWidth = Dimensions.get('window').width;
export let winHeight = Dimensions.get('window').height;

export const unitWidth = winWidth / designWidth;
export const unitHeight = winHeight / designHeight;

export function px(v) {
  return v * unitWidth;
}

/**
 * 判断是否为iphoneX
 * @returns {boolean}
 */
export function isIphoneX() {
  const X_WIDTH = 375;
  const X_HEIGHT = 812;
  return Platform.OS == 'ios' && (winHeight == X_HEIGHT && winWidth == X_WIDTH);
}

// 状态栏的高度
export function getStatusBarHeight() {
  if (Platform.OS == 'android') return StatusBar.currentHeight;
  if (isIphoneX()) {
    return 44;
  }
  return 20;
}
