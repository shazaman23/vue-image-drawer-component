function Stack() {
  this.dataStore = [];
  this.top = 0;
}

// add a new to the stack
Stack.prototype.push = function (element) {
  this.dataStore[this.top++] = element;
};
// sheft a new element from the stack
Stack.prototype.pop = function () {
  const pop = this.top ? this.dataStore.splice(--this.top, 1) : undefined;
  return pop;
};

Stack.prototype.peek = function () {
  return this.dataStore[this.top - 1];
};

Stack.prototype.clear = function () {
  this.top = 0;
};
Stack.prototype.length = function () {
  return this.top;
};

export default new Stack();
