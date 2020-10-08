
export default class RequestQueue {
  queue = [];
  maxLength = 10;
  constructor(maxLength = 10) {
    this.maxLength = maxLength;
  }
  add(url) {
    this.queue.unshift(url);
    if (this.queue.length > this.maxLength) {
      this.queue.pop();
    }
  }
  remove(url) {
    this.queue = this.queue.filter(u => u !== url);
  }
  has(url) {
    return !!this.queue.find(u => u === url);
  }
  clear() {
    this.queue = [];
  }
}
