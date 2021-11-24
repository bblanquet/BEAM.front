import { Component, h } from 'preact';

export default class Line extends Component<{},{}> {
	render() {
		return <div style="display: flex;flex-direction:row;justify-content:center;">{this.props.children}</div>;
	}
}
