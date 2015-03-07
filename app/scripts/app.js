(function () {

	var id = 0;

	var todoData = [
		{completed: false, text: 'Learn React', id: ++id}
	];

	var TodoApp = React.createClass({

		getInitialState: function () {
			return {data: todoData};
		},

		saveTodos: function (todo) {
			todoData.push(todo);
			this.setState({data: todoData});
		},

		complete: function (todo) {
			todo.completed = !todo.completed;
			this.setState({data: todoData});
		},

		render: function () {

			return (
				<section className="todoApp">
					<TodoForm save={this.saveTodos} />
					<TodoList 
						list={this.state.data}
						complete={this.complete} />
				</section>
			);
		}
	});

	var TodoList = React.createClass({

		toggleComplete: function (todo) {
			console.log(todo)
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
						<span>{this.props.todo.text}</span>
						<input type="checkbox" onChange={this.props.onChange} />
						<span>Mark Completed</span>
				</li>
			);
		}
	});

	window.onload = React.render(<TodoApp />, document.querySelector('#content'));

})();