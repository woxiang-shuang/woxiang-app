import http from './core';
import axios from 'axios';
// 登录 注册 找回密码
// 通用接口
const getinit = query => {
  return http({
    url: query[0],
    method: 'post',
    data: query[1]
  }).then(res => {
    return res;
  });
};
// 验证手机号是否存在本平台
const handlePhone = query => {
  return http({
    url: 'api/members/validPhone/' + query,
    method: 'get',
  }).then(res => {
    return res;
  });
};
const getdata = query => {
  return http({
    url: query[0],
    method: 'get',
    params: query[1]
  }).then(res => {
    return res;
  });
};
const loginApi = 'api/members/loginByPassword',// 账号密码登录
  regApi = 'api/members/registerMember',// 注册
  loginCodeApi = 'api/members/loginBySmsCode',// 验证码登录
  sendCodeApi = 'api/members/sendSMSCode',// 发送短信验证码
  updatePassApi = 'api/members/updatePasswordByEmail',// 根据邮箱更新密码
  updatePasswordByPhone = 'api/members/updatePasswordByPhone',// 根据手机号更新密码
  sendMailCode = 'api/members/sendMailCode',// 发送邮箱验证码
  logout = 'api/members/logout', // 退出登录
  // 专家推荐,红单榜
  apprecord = 'api/newsrelease/apprecord', // 推荐
  appstraightwins = 'api/newsexpert/appstraightwins';// 红单
export {
  loginApi, regApi, loginCodeApi, sendCodeApi, updatePassApi, updatePasswordByPhone, getinit, handlePhone, sendMailCode, logout,
  getdata,apprecord,appstraightwins
};

let page = 1;
let pageSize = 10;

/**
 * 获取足球全部列表数据
 * @param {*} params 
 * from
 * page
 * pageSize
 * where 进行中
 */
export function getMatchList(params = {}) {
  params = Object.assign({
    from: 'foot_match_v_all',
    page,
    size: 50
  }, params);
  let str;
  switch (params.from) {
  case 'foot_match_v_all':
    str = 'api/match/findTodayEventData';
    break;
  case 'foot_match_v_jinxinzhong':
    str = 'api/match/findNowRunMatchData';
    break;
  case 'foot_match_ex_saichen':
    str = 'api/match/findMatchSchedule';
    break;
  case 'foot_match_ex_saiguo':
    str = 'api/match/findMatchByMatchTime';
    break;
  case 'mat_fav':
    str = 'api/members/findMemberFootballConcerned';
    break;
  }
  return http.post(`${str}`, params);
}

/**
 * 添加关注
 * @param {*} params {
 *   id
 * }
 */
export function updateFavourite(params = {}) {
  return http.post('api/members/insertMemberConcerned', params);
}

/**
 * 取消关注
 * @param {*} params {
 *   id
 * }
 */
export function cancelFavourite(params = {}) {
  return http.post('api/members/deleteMemberConcerned', params);
}

/**
 * 获取赛事详情
 * @param {*} params 
 * from
 * where
 * match_id
 */
export function getMatchDetailById(params = {}) {
  // params = Object.assign({
  //   from: 'foot_match_ex',
  //   page,
  //   pagesize: 1
  // }, params);
  return http.post('api/footballDetail/findTeamByMatchId', params);
}

/**
 * 获取天气详情 tom
 * @param {*} params 
 */
export function getWeatherById(params = {}) {
  return http.post('api/matchdetail/weather', params);
}

/**
 * 获取文字直播信息
 * @param {*} params 
 * from
 * match_id
 */
export function getTextInfosForLive(params = {}) {
  return http.post('api/footballDetail/findByMatchIdTlive', params);
}

/**
 * 获取直播重要事件
 * @param {*} params 
 * from
 */
export function getImportantEventsForLive(params = {}) {
  return http.post('api/footballDetail/findByMatchIdIncident', params);
}

/**
 * 获取比赛双方的控球率、射门、射正、进攻、危险进攻、角球、红牌、黄牌数据 , params
 * @param {*} data 
 */
export function getCompetitionEventStat(params = {}) {
  return http.post(`api/footballDetail/findByMatchId`, params);
}

/**
 * 获取用户信息
 * @param {*} data 
 */
export function getUserInfo(data) {
  // console.log('data',data);
  return http.post('api/members/info', data);
}

/**
 * 修改用户信息
 * @param {*} data 
 */
export function updataUserInfo(data = {}) {
  return http.post('api/members/update', data);
}


/**
 * 资讯页面获取分类类型
 * @param {*} data 
 */
export function getTypesById(params = {}) {
  // console.log(params);
  return http.get('api/articleCategorys/getByType', { params });
}

export function getByCatsgoryId(params = {}) {
  // console.log('params',params)
  return http.get(`api/articles/getByCatsgoryId`, { params });

}
// 根据id获取该篇资讯信息
export function getArticleDetail(data = {}) {
  return http({
    url: 'api/articles/articleDetail',
    method: 'post',
    data: data,
    // isRaw:true
  });
}
// 文章点赞
export function giveThumb(data = {}) {
  return http({
    url: 'api/articles/changeDigg',
    method: 'get',
    params: data,
  });
}
// 文章收藏
export function giveACollect(data = {}) {
  return http({
    url: 'api/articles/collect',
    method: 'get',
    params: data,
  });
}
// 资讯模块二接口
/**
 * 获取赛事筛选tabs菜单数据
 */
export function getTabsOfMatchFilter(params) {
  return http.get(`api/leagues/matchFilter`, { params });
}

/**
 * 获取赛事筛选tab对应的数据
 */
// export function getTabTypesOfMatchFilter() {
//   return http.get(`sport/queryPageTrad/league`);
// }

/**
 * 获取赛事详情-阵容数据
 * @param {*} params 
 */
export function getTeamOfDetail(params = {}) {
  return http.post(`api/matchdetail/lineup`, params);
}


/**
 * 获取赛事详情-指数数据
 * @param {*} params 
 */
export function getExponentData(params = {}) {
  // params = Object.assign({
  //   page,
  //   pagesize: pageSize
  // }, params);
  return http.post(`api/footballDetail/footballDetailOdds`, params);
}
/**
 * 获取 非今日 赛事详情-指数数据
 * @param {*} params 
 */
export function getExponentDataBefore (params = {}) {
  return http.get(`api/match/getCalculateRealOdds?matchId=${params.matchId}&createDate=${params.createDate}`);
}

/**
 * 获取赛事详情-情报数据
 * @param {*} params 
 */
export function getInfosDataOfDetail(params = {}) {
  params = Object.assign({
    from: 'foot_qinbao_v',
    page,
    pagesize: pageSize
  }, params);
  return http.get('queryPage', { params });
}

/**
 * 获取赛事详情-数据-历史数据
 * @param {*} params 
 */
export function getHistoryDataOfDetail(params = {}) {
  return http.post(`api/matchdetail/history/getList`, params);
}

/**
 * 获取赛事详情-数据-历史交锋
 * @param {*} params 
 */
function getDetailDataHistory(params = {}) {
  return http.post(`api/matchdetail/history/getHistoryData`, params);
}

/**
 * 获取赛事详情-数据-近期战绩
 * @param {*} params 
 */
function getDetailDataRecent(params = {}) {
  return http.post(`api/matchdetail/history/getRecent`, params);
}

export default {
  getMatchList,
  updataUserInfo,
  getUserInfo,
  getMatchDetailById,
  getWeatherById,
  updateFavourite,
  cancelFavourite,
  getTextInfosForLive,
  getImportantEventsForLive,
  getCompetitionEventStat,
  getTypesById,
  getByCatsgoryId,
  getArticleDetail,
  getTabsOfMatchFilter,
  // getTabTypesOfMatchFilter,
  getExponentData,
  getExponentDataBefore,
  getInfosDataOfDetail,
  getHistoryDataOfDetail,
  getDetailDataHistory,
  getDetailDataRecent,
  getTeamOfDetail,
  giveThumb,
  giveACollect
};
