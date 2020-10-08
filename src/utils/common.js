/*
@desc 获取URL上的参数
*/
export function getUrlParams(name) {
  let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
  let rs = window.location.search.substr(1).match(reg);
  return rs ? decodeURI(rs[2]) : '';
}

export const enptyFn = () => {};

/**
 * 是否为undefined
 * @param {*} v any
 */
export const isUdf = (v) => {
  return v === undefined;
};

/**
 * 获取值，如果为undefined则返回空字符串
 * @param {*} v 
 */
export function getValue(v) {  
  return isUdf(v) ? '' : v;
}
