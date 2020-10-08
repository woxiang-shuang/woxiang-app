
class Timer {
  timerItval = 0;
  fn;
  /**
   * 定时器
   * @param {*} time  时间
   * @param {*} fn    回调函数
   * @param {*} step
   */
  constructor(time, fn, step) {
    this.fn = fn;
    this.start(time, fn, step);
  }
  start(time, fn, step = 1000) {
    this.timerItval = window.setInterval(() => {
      if (time <= 0) {
        clearInterval(this.timerItval);
        fn(0, true);
        return;
      }
      fn(time, false);
      time--;
    }, step);
  }
  close() {
    clearInterval(this.timerItval);
    // this.fn(0, true);
  }
}
export function fomatFloat(src, pos) {
  return Math.round(src * Math.pow(10, pos)) / Math.pow(10, pos);
}
export default Timer;
