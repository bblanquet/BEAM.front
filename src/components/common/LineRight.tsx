import { Component, h } from 'preact';

export default class LineRight extends Component<{}, {}> {
	render() {
		return <div style="display: flex;flex-direction:row;justify-content:flex-end;">{this.props.children}</div>;
	}
}
