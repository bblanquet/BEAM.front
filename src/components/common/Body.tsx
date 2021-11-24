import { h, Component, JSX } from 'preact';

export default class Body extends Component<{ header: JSX.Element; content: JSX.Element; footer: JSX.Element }, any> {
	render() {
		return (
			<div class="wrapper">
				<div class="header">
					<div class="inner">{this.props.header}</div>
				</div>
				<div class="content">
					<div class="inner">
						<div class="scrollable">{this.props.content}</div>
					</div>
				</div>
				<div class="footer">
					<div class="inner">{this.props.footer}</div>
				</div>
			</div>
		);
	}
}
