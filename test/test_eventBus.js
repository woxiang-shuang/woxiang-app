// let listensers = [];

// class EventBus {
//   static addListenser(name, handler) {
//     listensers.push({name, handler});
//   }
//   static removeListenser(name) {
//     for (let i = 0, len = listensers.length; i < len; i++) {
//       if (listensers[i].name === name) {
//         listensers.splice(i, 1);
//       }
//     }
//   }
//   static emit(name, data) {
//     for (let i = 0, len = listensers.length;  i < len; i++) {
//       if (listensers[i].name === name) {
//         // console.log('listensers[i].handler', listensers[i].handler)
//         if (typeof listensers[i].handler === 'function') {
//           listensers[i].handler(data);
//         }
//       }
//     }
//   }
//   static removeAll() {
//     listensers = [];
//   }
//   static getListensers() {
//     return listensers;
//   }
//   static has(name) {
//     return listensers.find(item => item.name ===name);
//   }
// }

// EventBus.addListenser('test', () => console.log('test called'));

// console.log(EventBus.getListensers())

// console.log(EventBus.has('test'));

// console.log(EventBus.has('test1'));

// EventBus.removeListenser('test');

// console.log(EventBus.has('test'));