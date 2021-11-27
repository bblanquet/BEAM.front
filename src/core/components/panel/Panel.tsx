import { Component, h } from 'preact';
import { SingletonKey, Singletons } from '../../../tools/singleton/Singletons';
import { IStore } from '../../../tools/store/IStore';
import { PanelState } from './PanelState';
import RangeSlider from '../../common/RangeSlider';

export class Panel extends Component<{}, PanelState> {
	private radiusStore: IStore<number>;
	private countStore: IStore<number>;

	constructor() {
		super();
		this.radiusStore = Singletons.Load<IStore<number>>(SingletonKey.radius);
		this.countStore = Singletons.Load<IStore<number>>(SingletonKey.scooterCount);
		this.radiusStore.onChange.on((src: any, data: number) => {
			this.setState({ radius: data });
		});
		this.countStore.onChange.on((src: any, data: number) => {
			this.setState({ scooterCount: data });
		});

		this.state = {
			radius: this.radiusStore.get(),
			scooterCount: this.countStore.get()
		};
	}

	render() {
		return (
			<form class="form">
				<div class="form-group">
					<label for="formGroupExampleInput">radius {this.state.radius}</label>
					<RangeSlider
						onValue={(e: number) => {
							this.radiusStore.set(e);
						}}
						min={200}
						value={this.state.radius}
						max={5000}
					/>
				</div>
				<div class="form-group">
					<label for="formGroupExampleInput">scooters {this.state.scooterCount}</label>
					<RangeSlider
						onValue={(e: number) => {
							this.countStore.set(e);
						}}
						min={1}
						value={this.state.scooterCount}
						max={25}
					/>
				</div>
			</form>
		);
	}
}
