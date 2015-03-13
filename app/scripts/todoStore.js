(function () {

	var getId = function () {
		return Date.now() * Math.floor(Math.random() * 7);
	};

	var TodoStore = {
		subscribers: {},
		todos: (function () {
			if (localStorage.getItem('react-todo')) {
				return JSON.parse(localStorage.getItem('react-todo'));
			} else {
				return [];
			}
		})()
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
			this.subscribers[ev].push(func)
		} else {
			this.subscribers[ev] = [func];
		}
	};

	TodoStore.prototype.save = function (todo) {
		todo.id = getId();
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

	TodoStore.prototype.clearCompleted = function () {
		this.todos = this.todos.filter(function (todo) {
			return !todo.completed;
		}, this);
		this.publish('change');
	};

	TodoStore.prototype.clearAll = function () {
		this.todos = [];
		this.publish('change');
	};

	TodoStore.subscribe('change', function () {
		localStorage.setItem('react-todo', JSON.stringify(TodoStore.todos));
	});

	window.TodoStore = TodoStore;
})();