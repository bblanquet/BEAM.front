import { h } from 'preact';
import { HomeState } from '../model/HomeState';
import { HookedComponent } from '../utils/HookedComponent';
import { HomeHook } from '../Hook/HomeHook';
import { useState } from 'preact/hooks';
import Icon from '../common/Icon';
import Notification from '../common/Notification';
import Switch from '../common/Switch';
import { toReadableNumber } from '../../tools/numberUtils';

export default class HomeScreen extends HookedComponent<{}, HomeHook, HomeState> {
	private sidebar: HTMLElement;
	private sidebarBtn: HTMLElement;

	getDefaultHook() {
		return new HomeHook(useState(new HomeState()), this.animate.bind(this));
	}

	public animate(isVisible: boolean) {
		this.sidebar.style.width = isVisible ? '250px' : '0px';
		this.sidebarBtn.style.left = isVisible ? '250px' : '0px';
	}

	rendering() {
		return (
			<div>
				<div class="sidebar" ref={(e) => (this.sidebar = e)}>
					<div class="btn-sidebar" ref={(e) => (this.sidebarBtn = e)}>
						<button
							type="button"
							class="btn btn-light"
							onClick={(e) => {
								this.hook.setSidebar();
							}}
						>
							<Switch
								isLeft={this.hook.state.isSidebarVisible}
								left={<Icon value="fas fa-arrow-left" />}
								right={<Icon value="fas fa-arrow-right" />}
							/>
						</button>
					</div>
					<div style="padding:5px">
						<form class="form">
							<div class="form-group">
								<label for="formGroupExampleInput">radius</label>
								<input
									type="number"
									class="form-control"
									id="formGroupExampleInput"
									placeholder="40"
									value={this.hook.state.radius}
									onInput={(e: any) => this.hook.setRadius(e.target.value)}
								/>
							</div>
							<div class="form-group">
								<label for="formGroupExampleInput">scooters</label>
								<input
									type="number"
									class="form-control"
									id="formGroupExampleInput"
									placeholder="5"
									value={this.hook.state.scooterCount}
									onInput={(e: any) => this.hook.setScooter(e.target.value)}
								/>
							</div>
						</form>
						<ul class="list-group" style="overflow-y:auto;height:50vh">
							{this.hook.state.selected.map((item) => (
								<li class="list-group-item d-flex justify-content-between align-items-center">
									<span class="badge badge-dark sm-m">{`#${item.scooter.id}`}</span>
									<span class="purple-text">{toReadableNumber(item.distance)}m</span>
								</li>
							))}
						</ul>
					</div>
				</div>
				<div id="map" />
				<Notification />
			</div>
		);
	}
}
