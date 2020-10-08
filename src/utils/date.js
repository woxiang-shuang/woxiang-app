
function padStart(s = '', l, w) {
  while (s.length < l) {
    s = w + s;
  }
  if (s.length > l) s = s.slice(s.length - l);
  return s;
}


/**
 * 日期格式化
 * date {Date|Number} 日期
 * fmt {String} 格式
 */
export function dateFormat(date, fmt = 'yyyy-MM-dd') {

  if (!date) date = new Date();
  if (typeof date === 'number') date = new Date(date);

  return fmt.replace('yyyy', String(date.getFullYear()))
    .replace('MM', String(date.getMonth() + 1).padStart(2, '0'))
    .replace('dd', String(date.getDate()).padStart(2, '0'))
    .replace('hh', String(date.getHours()).padStart(2, '0'))
    .replace('mm', String(date.getMinutes()).padStart(2, '0'))
    .replace('ss', String(date.getSeconds()).padStart(2, '0'))
    .replace('SS', String(date.getMilliseconds()));
}

export function dateTimeFormat(time) {
  let date = new Date(time);
  return date.getFullYear() + '-' + padStart(String(date.getMonth() + 1), 2, '0') + '-' + padStart(String(date.getDate()), 2, '0') + ' ' + padStart(String(date.getHours()), 2, '0') + ':' + padStart(String(date.getMinutes()), 2, '0') + ':' + padStart(String(date.getSeconds()), 2, '0');
}


export const ONE_SECOND = 1000;
export const ONE_MINUTE = 60 * ONE_SECOND;
export const ONE_HOUR = 60 * ONE_MINUTE;
export const ONE_DAY = 23 * 59 * 59 * 1000;

/**
 * 时间格式化
 * time {Number} 时分秒毫秒数
 * fmt {String} 格式
 */
export function timeFormat(time, fmt = 'hh:mm:ss') {
  return fmt.replace('hh', String(Math.floor(time / ONE_HOUR)).padStart(2, '0'))
    .replace('mm', String(Math.floor(time % ONE_HOUR / ONE_MINUTE)).padStart(2, '0'))
    .replace('ss', String(Math.floor(time % ONE_HOUR % ONE_MINUTE / ONE_SECOND)).padStart(2, '0'));
}

/**
 * 比赛时间秒转分
 * @param {*} seconds 
 */
export function secondsToMinutes(seconds = 0, maxMinutes = 90, fmt = false) {
  if (seconds < 0) return 0;
  let minutes = parseInt(seconds / 60, 10);
  if (fmt === true) return fmtOverTime(minutes, maxMinutes);
  return minutes;
}

/**
 * 赛事时间，如果超时增加'
 * @param {*} minutes 
 * @param {*} maxMinutes 
 */
export function fmtOverTime(minutes = 0, maxMinutes = 90) {
  return (minutes > maxMinutes ? maxMinutes : minutes) + (minutes > maxMinutes ? '+' : '');
}

export const getDayCountOfMonth = function(year, month) {
  if (month === 3 || month === 5 || month === 8 || month === 10) {
    return 30;
  }
  if (month === 1) {
    return (year % 4 === 0 && year % 100 !== 0 || year % 400 === 0) ? 29 : 28;
  }
  return 31;
};
