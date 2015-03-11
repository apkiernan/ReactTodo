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

	var TodoApp = React.createClass({

		getInitialState: function () {
			return {todos: this.props.todos};
		},

		componentDidMount: function () {
			TodoStore.subscribe('change', function () {
				React.render(<App todos={TodoStore.todos} />, document.querySelector('#content'));
			});
		},

		saveTodos: function (todo) {
			TodoStore.todos.push(todo);
			TodoStore.publish('change');
		},

		completeTodo: function (todo) {
			todo.completed = !todo.completed;
			TodoStore.publish('change');
		},

		render: function () {

			return (
				<section className="todoApp">
					<TodoForm save={this.saveTodos} />
					<TodoList 
						list={this.state.todos}
						complete={this.completeTodo} />
				</section>
			);
		}
	});

	var TodoList = React.createClass({

		toggleComplete: function (todo) {
			this.props.complete(todo);
		},

		render: function () {

			return (
				<ul>
					{this.props.list.map(function (todo) {
						return (
							<Todo todo={todo} 
										key={todo.id}
										onChange={this.toggleComplete.bind(this, todo)} />
						);
					}, this)}
				</ul>
			);
		}
	});

	var TodoForm = React.createClass({

		_handleSubmit: function (e) {
			e.preventDefault();

			var todoModel = {
				completed: false,
				text: this.refs.text.getDOMNode().value.trim(),
				id: ++id
			};

			this.props.save(todoModel);
			this.refs.text.getDOMNode().value = '';
		},

		render: function () {
			return (
				<form onSubmit={this._handleSubmit}>
					<input type="text" placeholder="What do you need to do?" ref="text" />
					<button type="submit">Save</button>
				</form>
			);
		}
	});

	var Todo = React.createClass({

		render: function () {

			var completed = this.props.todo.completed;

			return (
				<li key={this.props.key}
					className={completed ? 'delete' : ''}>
						<input type="checkbox" onChange={this.props.onChange} />
						<span>{this.props.todo.text}</span>
				</li>
			);
		}
	});

	var Controls = React.createClass({

		markComplete: function () {
			console.log('markComplete triggered');
		},

		clearComplete: function () {
			console.log('clearComplete triggered');
		},

		clearAll: function () {
			console.log('clearAll triggered');
		},

		_handleClick: function (e) {
			e.preventDefault();

			switch(e.target.id) {
				case 'markComplete':
					this.markComplete();
					break;
				case 'clearComplete':
					this.clearComplete();
					break;
				case 'clearAll':
					this.clearAll();
					break;
			}
		},

		render: function () {
			return (
				<div onClick={this._handleClick}>
					<span><a href="#" id="markComplete">Mark All as Completed</a></span>
					<span><a href="#" id="clearComplete">Clear Completed</a></span>
					<span><a href="#" id="clearAll">Clear All</a></span>
				</div>
			);
		}
	});

	var App = React.createClass({
		render: function () {
			return (
				<div>
					<TodoApp todos={this.props.todos}/>
					<Controls />
				</div>
			);
		}

	});

	window.onload = React.render(<App todos={TodoStore.todos}/>, document.querySelector('#content'));