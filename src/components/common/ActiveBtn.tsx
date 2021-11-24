import { h, Component, JSX } from 'preact';

export default class ActiveBtn extends Component<
	{
		left: JSX.Element;
		right: JSX.Element;
		onClick: () => void;
		isActive: boolean;
	},
	any
> {
	render() {
		if (this.props.isActive) {
			return (
				<button
					class="btn btn-primary sm-m"
					onClick={() => {
						this.props.onClick();
					}}
				>
					{this.props.left}
				</button>
			);
		} else {
			return (
				<button
					class="btn btn-secondary sm-m"
					onClick={() => {
						this.props.onClick();
					}}
				>
					{this.props.right}
				</button>
			);
		}
	}
}
