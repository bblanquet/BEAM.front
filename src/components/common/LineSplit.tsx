import { Component, h } from 'preact';

export default class LineSplit extends Component<{}, {}> {
	render() {
		return <div style="display: flex;flex-direction:row;justify-content:space-between;">{this.props.children}</div>;
	}
}
