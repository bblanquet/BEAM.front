import { Component, h } from 'preact';

export default class Column extends Component {
	render() {
		return (
			<div style="display: flex;flex-direction:column;justify-content:center; height:100%">
				{this.props.children}
			</div>
		);
	}
}
