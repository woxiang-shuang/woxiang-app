import { PanResponder } from 'react-native';
// export const getHandWatch = (cpt) => {
//   const {
//     _panResponder: { panHandlers: data },
//   } = cpt;
//   const _pan = cpt || {};
//   const panHandlers = _pan._panResponder ? data || {} : {};
//   return panHandlers;
// };
export const SetHandWatch = (cpt) => {
  const {
    component,
    onStartShouldSetPanResponder,
    onStartShouldSetPanResponderCapture,
    onMoveShouldSetPanResponder,
    onMoveShouldSetPanResponderCapture,
    onPanResponderGrant,
    onPanResponderMove,
    onPanResponderTerminationRequest,
    onPanResponderRelease,
    onShouldBlockNativeResponder,
  } = cpt;
  const choseTrue = () => true;
  const choseFalse = () => false;
  const init = () => null;
  component._panResponder = PanResponder.create({
    // 开启点击手势响应
    onStartShouldSetPanResponder: onStartShouldSetPanResponder || choseTrue,
    // 开启点击手势响应是否劫持 true: 不传递给子view false：传递给子view
    onStartShouldSetPanResponderCapture:
        onStartShouldSetPanResponderCapture || choseTrue,
    // 开启移动手势响应
    onMoveShouldSetPanResponder: onMoveShouldSetPanResponder || choseTrue,
    // 开启移动手势响应是否劫持 true：不传递给子view false：传递给子view
    onMoveShouldSetPanResponderCapture:
        onMoveShouldSetPanResponderCapture || choseTrue,
    // 手指触碰屏幕那一刻触发 成为激活状态。
    onPanResponderGrant: onPanResponderGrant || init,
    // 手指在屏幕上移动触发
    onPanResponderMove: onPanResponderMove || init,
    // 当有其他不同手势出现，响应是否中止当前的手势
    onPanResponderTerminationRequest:
        onPanResponderTerminationRequest || choseTrue,
    // 手指离开屏幕触发
    onPanResponderRelease: onPanResponderRelease || init,
    onShouldBlockNativeResponder: onShouldBlockNativeResponder || choseFalse,
  });
  return component._panResponder.panHandlers;
};
