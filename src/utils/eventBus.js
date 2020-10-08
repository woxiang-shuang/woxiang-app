let listensers = [];

export default class EventBus {
  static addListenser(name, handler) {
    listensers.push({name, handler});
  }
  static removeListenser(name) {
    for (let i = 0, len = listensers.length; i < len; i++) {
      if (listensers[i]?.name === name) {
        listensers.splice(i, 1);
      }
    }
  }
  static emit(name, data) {
    for (let i = 0, len = listensers.length;  i < len; i++) {
      if (listensers[i]?.name === name) {
        if (typeof listensers[i]?.handler === 'function') {
          listensers[i].handler(data);
        }
      }
    }
  }
  static removeAll() {
    listensers = [];
  }
  static getListensers() {
    return listensers;
  }
  static has(name) {
    return listensers.find(item => item.name === name);
  }
}
