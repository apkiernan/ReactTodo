(function () {

	var getId = function () {
		return Date.now() * Math.floor(Math.random() * 7);
	};

	var TodoStore = Object.create({
		subscribers: {},
		todos: (function () {
			if (localStorage.getItem('react-todo')) {
				return JSON.parse(localStorage.getItem('react-todo'));
			} else {
				return [];
			}
		})(),
		
		publish: function (event) {
			if (!this.subscribers[event]) {
				return;
			}
			for (var i = 0; i < this.subscribers[event].length; i++) {
				this.subscribers[event][i]();
			}
		},

		subscribe: function (ev, func) {
			if (this.subscribers[ev]) {
				this.subscribers[ev].push(func)
			} else {
				this.subscribers[ev] = [func];
			}
		},

		unsubscribe: function (e, func) {
			for (var ev in this.subscribers) {
				if (this.subscribers[ev] === e) {
					var sub = this.subscribers[ev];
					sub.splice(sub.indexof(func), 1);
				}
			}
		},

		save: function (todo) {
			todo.id = getId();
			this.todos.push(todo);
			this.publish('change');
		},

		toggleComplete: function (todo) {
			todo.completed = !todo.completed;
			this.publish('change');
		},

		completeAll: function () {
			this.todos.map(function (todo) {
				return todo.completed = true;
			});
			this.publish('change');
		},

		clearCompleted: function () {
			this.todos = this.todos.filter(function (todo) {
				return !todo.completed;
			}, this);
			this.publish('change');
		},

		clearAll: function () {
			this.todos = [];
			this.publish('change');
		}
	});

	TodoStore.subscribe('change', function () {
		localStorage.setItem('react-todo', JSON.stringify(TodoStore.todos));
	});

	window.TodoStore = TodoStore;
})();