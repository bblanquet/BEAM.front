import { h } from 'preact';
import { HomeState } from '../model/HomeState';
import { HookedComponent } from '../utils/HookedComponent';
import { HomeHook } from '../Hook/HomeHook';
import { useState } from 'preact/hooks';
import Notification from '../common/Notification';
import { toReadableNumber } from '../../tools/numberUtils';
import Sidebar from '../common/Sidebar';
import RangeSlider from '../common/RangeSlider';
import Icon from '../common/Icon';

export default class HomeScreen extends HookedComponent<{}, HomeHook, HomeState> {
	getDefaultHook() {
		return new HomeHook(useState(new HomeState()));
	}

	rendering() {
		return (
			<div>
				<Sidebar>
					<form class="form">
						<div class="form-group">
							<label for="formGroupExampleInput">radius {this.hook.state.radius}</label>
							<RangeSlider
								onValue={(e: number) => {
									this.hook.setRadius(e);
								}}
								min={200}
								value={this.hook.state.radius}
								max={5000}
							/>
						</div>
						<div class="form-group">
							<label for="formGroupExampleInput">scooters {this.hook.state.scooterCount}</label>
							<RangeSlider
								onValue={(e: number) => {
									this.hook.setScooter(e);
								}}
								min={1}
								value={this.hook.state.scooterCount}
								max={25}
							/>
						</div>
					</form>
					<ul class="list-group" style="overflow-y:auto;height:50vh">
						{this.hook.state.selected.map((item) => (
							<li class="list-group-item d-flex justify-content-between align-items-center">
								<button
									type="button"
									class="btn btn-dark"
									onClick={(e) => {
										this.hook.setView(item.scooter.id);
									}}
								>
									<Icon value="fas fa-map-marker" />
									{` ${item.scooter.id}`}
								</button>
								<span class="purple-text">{toReadableNumber(item.distance)}m</span>
							</li>
						))}
					</ul>
				</Sidebar>
				<div id="map" />
				<Notification />
			</div>
		);
	}
}
