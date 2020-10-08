
import { SocketDataMsgType } from './constant';

/**
 * 对象属性列表转成对象数组列表
 * @param {*} objects 
 * {a: {name: ''}, b: {name: ''}} => [{name: '', a: ''}, {name: '', b: ''}]
 * @returns Array objArray
 */
export function objectsOfPropToObjectsOfArray(objects) {
  if (!objects) return [];
  let objArray = [];
  for (let key in objects) {
    objects[key].matchId = parseInt(key, 10);
    objArray.push(objects[key]);
  }
  return objArray;
}

export function socketDataArrayToObject(data, type) {
  switch(type) {
  case SocketDataMsgType.SHORT_REALTIMEDATA:
    return parse_SHORT_REALTIMEDATA(data);
  case SocketDataMsgType.SHORT_EVENTDATA:
    return parse_SHORT_EVENTDATA(data);  
  default:
    break;
  }
}

function parse_SHORT_REALTIMEDATA(data = []) {
  let temp = [];
  data.forEach(item => {
    temp.push({
      matchId: item[0],
      oddType: item[1],
      changeTime: item[2],
      homeOdd: item[3],
      tieOdd: item[4],
      awayOdd: item[5],
      oddState: item[6],
      homeChange: item[7],
      awayChange: item[8]
    });
  });
  return temp;
}

function parse_SHORT_EVENTDATA(data = {}) {
  let temp = {
    red: {},
    yellow: [],
    goal: {},
    corner: [],
    penaltyKickScore: [],
    score: [],
    halfScore: [],
    overTimeScore: [],
    technology: {},
    incidents: {}
  };
  let item;

  // 红牌
  if (data.red) {
    for (let k in data.red) {
      item = data.red[k];
      temp.red[k] = {
        homeRedCount: item[3],
        awayRedCount: item[4],
        time: item[1],
        position: item[2],
        type: item[0],
        second: item[5]
      };
    }
  }
  // 黄牌
  if (data.yellow) {
    for (let i = 0, len = data.yellow.length; i < len; i++) {
      item = data.yellow[i];
      temp.yellow.push({
        home: item[1],
        away: item[2],
        matchId: parseInt(item[0], 10)
      });
    }
  }
  // 进球
  if (data.goal) {
    for (let k in data.goal) {
      item = data.goal[k];
      temp.goal[k] = {
        homeScore: item[3],
        awayScore: item[4],
        time: item[1],
        position: parseInt(item[2], 10),
        type: item[0],
        second: item[5]
      };
    }
  }
  // 角球
  if (data.corner) {
    for (let i = 0, len = data.corner.length; i < len; i++) {
      item = data.corner[i];
      temp.corner.push({
        home: item[1],
        away: item[2],
        matchId: parseInt(item[0], 10)
      });
    }
  }
  // 常规比分
  if (data.score) {
    for (let i = 0, len = data.score.length; i < len; i++) {
      item = data.score[i];
      temp.score.push({
        homeScore: item[1],
        awayScore: item[2],
        matchId: parseInt(item[0], 10)
      });
    }
  }
  // 半场比分
  if (data.halfScore) {
    for (let i = 0, len = data.halfScore.length; i < len; i++) {
      item = data.halfScore[i];
      temp.halfScore.push({
        halfHomeSoce: item[1],
        halfAwaySoce: item[2],
        matchId: parseInt(item[0], 10)
      });
    }
  }
  // 加时赛比分(含常规时间比分)
  if (data.overTimeScore) {
    for (let i = 0, len = data.overTimeScore.length; i < len; i++) {
      item = data.overTimeScore[i];
      temp.overTimeScore.push({
        overTimeHomeScore: item[1],
        overTimeAwayScore: item[2],
        matchId: parseInt(item[0], 10)
      });
    }
  }
  // 技术统计
  if (data.technology) {
    for (let k in data.technology) {
      item = data.technology[k];
      temp.technology[k] = [];
      for (let i = 0, len = item.length; i < len; i++) {
        temp.technology[k].push({
          home: item[i][1],
          away: item[i][2],
          type: item[i][0]
        });
      }
    }
  }
  // 事件全量数据	
  if (data.incidents) {
    for (let k in data.incidents) {
      item = data.incidents[k];
      temp.incidents[k] = [];
      for (let i = 0, len = item.length; i < len; i++) {
        temp.incidents[k].push({
          type: item[i][6],
          position: item[i][3],
          time: item[i][4],
          player_id: item[i][0],
          player_name: item[i][5],
          home_score: item[i][1],
          away_score: item[i][2]
        });
      }
    }
  }
  return temp;
}
