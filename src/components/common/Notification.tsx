import { h, Component } from 'preact';
import { InfoState } from '../model/InfoState';
import { useState } from 'preact/hooks';
import { HookedComponent } from '../utils/HookedComponent';
import { NotificationHook } from '../hook/NotificationHook';
import Visible from './Visible';
import Icon from './Icon';

export default class Notification extends HookedComponent<{}, NotificationHook, InfoState> {
	private _notificationDiv: HTMLElement;

	public getDefaultHook(): NotificationHook {
		return new NotificationHook(useState(NotificationHook.defaultState()), this.Animate.bind(this));
	}

	private Animate() {
		if (this._notificationDiv) {
			this._notificationDiv.classList.remove('slow-bounce');
			setTimeout(() => {
				this._notificationDiv.classList.add('slow-bounce');
			}, 50);
		}
	}

	public rendering(): h.JSX.Element {
		return (
			<Visible isVisible={0 < this.hook.state.message.length}>
				<div class="toast-container">
					<div
						ref={(e) => (this._notificationDiv = e)}
						class="my-toast slow-bounce"
						style={`background-color:${this.hook.GetColor()};color:${this.hook.GetSecondaryColor()}`}
					>
						<div class="d-flex" style="flex-direction:row;align-content:space-between;align-items: center">
							<div style="width:100%">
								<Icon value={this.hook.GetIcon()} /> {this.hook.state.message}
							</div>
						</div>
					</div>
				</div>
			</Visible>
		);
	}
}
