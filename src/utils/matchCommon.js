import { MatchStaus } from './constant';

export { MatchStaus };

/**
 * 获取比赛状态
 * @param {*} status 状态码
  0 比赛异常，说明：暂未判断具体原因的异常比赛，可能但不限于：腰斩、取消等等，可隐藏处理
  1 未开赛
  2 上半场
  3 中场
  4 下半场
  5 加时赛
  6 加时赛(弃用)
  7 点球决战
  8 完场
  9 推迟
  10  中断
  11  腰斩
  12  取消
  13  待定
 * @return 
*/
export function getMatchStatus(status) {
  if (status === 1) {
    return MatchStaus.WAITING_BEGIN;
  } else if (status >= 2 && status <= 7) {
    return MatchStaus.IN_PLAY;
  } else if (status === 8 || status === 12) {
    return MatchStaus.ENDS;
  } else if (status === 11) {
    return MatchStaus.IN_PLAY_DELAY;
  } else if (status >= 9 && status <= 13 && status !== 12) {
    return MatchStaus.DELAY;
  } else {
    return '';
  }
}

export function isHalftime(status) {
  return status === 3;
}
