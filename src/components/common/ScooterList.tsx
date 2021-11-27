import { Component, h } from 'preact';
import { HookableComponent } from '../utils/HookableComponent';
import { toReadableNumber } from '../../tools/numberUtils';
import Icon from '../common/Icon';
import { ScooterListHook } from '../hook/ScooterListHook';
import { ScooterListState } from '../model/ScooterListState';
import { useState } from 'preact/hooks';
import Loading from './Loading';

export default class ScooterList extends HookableComponent<{}, ScooterListHook, ScooterListState> {
	public getDefaultHook(): ScooterListHook {
		return new ScooterListHook(useState(new ScooterListState()));
	}

	public rendering(): h.JSX.Element {
		return (
			<Loading value={this.hook.state.RequestState}>
				<ul class="list-group" style="overflow-y:auto;height:50vh">
					{this.hook.state.selected.map((item) => (
						<li class="list-group-item d-flex justify-content-between align-items-center">
							<span
								role="button"
								class="badge badge-dark badge-pill"
								onClick={(e) => {
									this.hook.setView(item.scooter.id);
								}}
							>
								<Icon value="fas fa-map-marker" />
								{` ${item.scooter.id}`}
							</span>

							<small class="text-muted">{toReadableNumber(item.distance)}m</small>
						</li>
					))}
				</ul>
			</Loading>
		);
	}
}
