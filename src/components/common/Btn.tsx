import { h, Component } from 'preact';

export default class Btn extends Component<{ onClick: () => void; isSelected: boolean }, any> {
	render() {
		return (
			<button
				class={this.props.isSelected ? 'btn btn-primary sm-m' : 'btn btn-secondary sm-m'}
				onClick={() => {
					this.props.onClick();
				}}
			>
				{this.props.children}
			</button>
		);
	}
}
