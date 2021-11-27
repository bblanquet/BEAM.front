import { Component, h } from 'preact';
import './RangeSlider.css';

export default class RangeSlider extends Component<
	{ onValue: (e: number) => void; min: number; max: number; value: number },
	{}
> {
	private range: HTMLInputElement;

	render() {
		return (
			<div class="slidecontainer">
				<input
					ref={(e) => (this.range = e)}
					onInput={(e) => {
						this.props.onValue(+this.range.value);
					}}
					type="range"
					min={this.props.min}
					max={this.props.max}
					value={this.props.value}
					class="slider"
					id="myRange"
				/>
			</div>
		);
	}
}
