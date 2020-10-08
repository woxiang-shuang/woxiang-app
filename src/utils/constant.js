
export const GameTypes = {
  FOOTBALL: 'football',
  BASTKETBALL: 'basketball'
};

export const CompetitionListItemTypes = {
  ALL: 'all',
  IN_PLAY: 'inplay',
  AGENDA: 'agenda',
  ENDS: 'ends',
  FAVOURITE: 'favourite'
};

export const CompetitionFootballEventTypes = {
  TO_SHOT: 0, // 射门
  GOAL_IN: 1, // 进球
  CORNER_KICK: 2, // 角球
  YELLOW_CARD: 3, // 黄牌
  RED_CARD: 4, // 红牌
  OWN_GOAL: 5, // 乌龙球
  TWO_YELLOW_TO_RED: 7, // 2黄变红
  SUBSTITUTION: 9, // 替换
  WILL_ENDS: 11, // 快结束
  PENALTY_KICK: 16, // 点球
  THE_OBVERSE_SIDE_SHOT: 21, // 射正
  SHOT_ASIDE: 22, // 射偏
  ATTACK: 23, // 进攻
  DANGER_ATTACK: 24, // 危险进攻
  TRAP_RATE: 25 // 控球率
};

// 比赛状态
export const MatchStaus = {
  WAITING_BEGIN: 'WAITING_BEGIN',
  IN_PLAY: 'IN_PLAY',
  ENDS: 'ENDS',
  DELAY: 'DELAY',
  IN_PLAY_DELAY: 'IN_PLAY_DELAY',
  HALFTIME: 'HALFTIME'
};

// WebSocket消息数据类型
export const SocketDataMsgType = {
  NEWS_CONTENT_REALTIMEDATA: 'NEWS_CONTENT_REALTIMEDATA',
  EVENTDATA: 'EVENTDATA',
  SHORT_EVENTDATA: 'SHORT_EVENTDATA',
  REALTIMEDATA: 'REALTIMEDATA',
  SHORT_REALTIMEDATA: 'SHORT_REALTIMEDATA', // 进行压缩了的字段
  ALLMATCHSTATE: 'ALLMATCHSTATE',
  REALTIMEEVENT: 'REALTIMEEVENT', // 增加事件
  FOOTBALL_TEXT_ALIVE: 'FOOTBALL_TEXT_ALIVE',
  FOOTBALL_EVENTS: 'FOOTBALL_EVENTS',
  FOOTBALL_ODDS: 'FOOTBALL_ODDS',
  FOOTBALL_TECHNICAL_STATISTICS: 'FOOTBALL_TECHNICAL_STATISTICS'
};
export const OffOutNews = {
  OFF_OUT_NEWS:'OFF_OUT_NEWS'
};