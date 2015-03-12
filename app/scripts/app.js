var TodoApp = React.createClass({

	getInitialState: function () {
		return null;
	},

	componentDidMount: function () {
		this.props.store.subscribe('change', function () {
			React.render(<App store={TodoStore} />, document.querySelector('#content'));
		});
	},

	render: function () {

		return (
			<section className="todoApp">
				<TodoForm save={this._save} />
				<TodoList 
					todos={this.props.store.todos}
					complete={this._toggleComplete} />
			</section>
		);
	},

	_save: function (todo) {
		this.props.store.save(todo);
	},

	_toggleComplete: function (todo) {
		this.props.store.toggleComplete(todo);
	}
});

var TodoList = React.createClass({

	toggleComplete: function (todo) {
		this.props.complete(todo);
	},

	render: function () {
		return (
			<ul>
				{this.props.todos.map(function (todo) {
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

	propTypes: {

	},

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
		return this.props.store.completeAll();
	},

	clearComplete: function () {
		return this.props.store.clearCompleted();
	},

	clearAll: function () {
		return this.props.store.clearAll();
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
			<ul className="footer" onClick={this._handleClick}>
				<li><a href="#" id="markComplete">Complete All</a></li>
				<li><a href="#" id="clearComplete">Clear Completed</a></li>
				<li><a href="#" id="clearAll">Clear All</a></li>
			</ul>
		);
	}
});

var App = React.createClass({
	render: function () {
		return (
			<div>
				<TodoApp store={this.props.store}/>
				<Controls store={this.props.store}/>
			</div>
		);
	}
});

window.onload = React.render(<App store={TodoStore}/>, document.querySelector('#content'));

