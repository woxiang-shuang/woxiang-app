
export function isNumber(num) {
  return /^\d+$/.test(num);
}

export function isPhone(phoneNum) {
  return /^\d{11}$/.test(phoneNum);
}

export function isPassword(pwd) {
  return /^[\da-zA-Z]{6,12}$/gi.test(pwd);
}

export function isValidateCode(code) {
  return /^\d{6}$/.test(code);
}
