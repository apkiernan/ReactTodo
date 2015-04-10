(function () {
	var TodoApp = React.createClass({

		componentDidMount: function () {
			this.props.store.subscribe('change', this._renderApp);
		},

		componentWillUnmount: function () {
			this.props.store.unsubscribe('change', this._renderApp)
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

		_renderApp: function () {
			React.render(<App store={TodoStore} />, document.querySelector('#content'));
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

		_handleSubmit: function (e) {
			e.preventDefault();

			if (this.refs.text.getDOMNode().value.trim()) {

				var todoModel = {
					completed: false,
					text: this.refs.text.getDOMNode().value.trim(),
				};

				this.props.save(todoModel);
			} 

			this.refs.text.getDOMNode().value = '';
		},

		render: function () {
			return (
				<form onKeydown={this._verifyInput}
							onSubmit={this._handleSubmit}>
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
						<input type="checkbox" 
								onChange={this.props.onChange}
								checked={completed ? 'checked' : ''} />
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
					<li><span id="markComplete">Complete All</span></li>
					<li><span id="clearComplete">Clear Completed</span></li>
					<li><span id="clearAll">Clear All</span></li>
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
})();

