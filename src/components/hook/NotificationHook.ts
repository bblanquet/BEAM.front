import { InfoState } from '../model/InfoState';
import { LogKind } from '../../tools/logger/LogKind';
import { StaticLogger } from '../../tools/logger/StaticLogger';
import { StateUpdater } from 'preact/hooks';
import { Hook } from '../utils/Hook';
import { INotificationService } from '../../services/INotificationService';
import { SingletonKey, Singletons } from '../../tools/singleton/Singletons';

export class NotificationHook extends Hook<InfoState> {
	private notificationSvc: INotificationService;
	private _timeout: NodeJS.Timeout;

	constructor(d: [InfoState, StateUpdater<InfoState>], private animate: () => void) {
		super(d[0], d[1]);
		this.notificationSvc = Singletons.Load<INotificationService>(SingletonKey.notification);
		this.notificationSvc.onNotification.On(this.handleNotification.bind(this));
	}

	public static defaultState(): InfoState {
		return new InfoState(LogKind.error, '');
	}

	protected stateChanged(): void {}

	private handleNotification(src: any, notification: InfoState): void {
		this.update((e) => {
			e.kind = notification.kind;
			e.message = notification.message;
		});
		if (0 < notification.message.length) {
			this.update((e) => {
				e.kind = notification.kind;
				e.message = notification.message;
			});
			this.animate();

			if (this._timeout) {
				clearTimeout(this._timeout);
			}
			this._timeout = setTimeout(() => {
				this.update((e) => (e.message = ''));
			}, 5000);
		}
	}

	public unmount(): void {}

	public GetIcon(): string {
		return StaticLogger.Icons.Get(LogKind[this.state.kind]);
	}

	public GetColor() {
		return StaticLogger.Colors.Get(LogKind[this.state.kind]);
	}

	public GetSecondaryColor() {
		return StaticLogger.SecondaryColors.Get(LogKind[this.state.kind]);
	}

	public IsError(): boolean {
		return [ LogKind.warning, LogKind.dangerous, LogKind.error ].includes(this.state.kind);
	}
}
