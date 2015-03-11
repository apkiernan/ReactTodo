var id = 0;

var TodoStore = {
	subscribers: {},
	todos: [
		{completed: false, text: 'Learn React', id: ++id}
	]
};

TodoStore.prototype = Object.prototype;

TodoStore.prototype.publish = function (event) {
	if (!this.subscribers[event]) {
		return;
	}
	for (var i = 0; i < this.subscribers[event].length; i++) {
		this.subscribers[event][i]();
	}
};

TodoStore.prototype.subscribe = function (ev, func) {
	if (this.subscribers[ev]) {
		this.subscribers[ev].push(ev)
	} else {
		this.subscribers[ev] = [func];
	}
};


TodoStore.prototype.save = function (todo) {
	this.todos.push(todo);
	this.publish('change');
};

TodoStore.prototype.toggleComplete = function (todo) {
	todo.completed = !todo.completed;
	this.publish('change');
};

TodoStore.prototype.completeAll = function () {
	this.todos.map(function (todo) {
		return todo.completed = true;
	});
	this.publish('change');
};