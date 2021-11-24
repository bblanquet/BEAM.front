import { HomeState } from '../model/HomeState';
import { Hook } from '../utils/Hook';
import { StateUpdater } from 'preact/hooks';
import { SingletonKey, Singletons } from '../../tools/singleton/Singletons';
import { IApiService } from '../../services/IApiService';
import { INotificationService } from '../../services/INotificationService';
import { InfoState } from '../model/InfoState';
import { LogKind } from '../../tools/logger/LogKind';
import { RecordingState } from '../model/RecordingState';
import Worker from 'worker-loader!./to64.worker';

export class HomeHook extends Hook<HomeState> {
	private apiSvc: IApiService;
	private notificationSvc: INotificationService;
	private socket: WebSocket;
	private socketAddress: string = '{{socket}}';
	private img: HTMLImageElement = new Image();
	private worker;

	constructor(d: [HomeState, StateUpdater<HomeState>]) {
		super(d[0], d[1]);
		this.apiSvc = Singletons.Load<IApiService>(SingletonKey.api);
		this.notificationSvc = Singletons.Load<INotificationService>(SingletonKey.notification);
		this.worker = new Worker();
		this.worker.onmessage = (ev: MessageEvent) => {
			const imgData = URL.createObjectURL(new Blob([ ev.data as Blob ], { type: 'image/jpg' }));
			this.img.src = imgData;
			this.img.onload = () => {
				this.img.decode().then(() => {
					document.body.style.backgroundImage = `url(${imgData})`;
				});
			};
		};
	}

	static defaultState(): HomeState {
		return new HomeState();
	}

	protected stateChanged(): void {}

	public unmount(): void {}

	private status(route: string): void {
		this.apiSvc.get<null, { isOnline: boolean }>(
			route,
			null,
			(r) => {
				this.update((e) => {
					e.isOnline = r.isOnline;
				});
			},
			(e) => {
				this.notificationSvc.onNotification.Invoke(
					this,
					new InfoState(LogKind.error, `${e.name} - ${e.description}`)
				);
			}
		);
	}

	private orderToApi(payload: { message: string }): void {
		this.apiSvc.get<{ message: string }, {}>(
			'Robot/order',
			payload,
			(r) => {},
			(e) => {
				this.notificationSvc.onNotification.Invoke(
					this,
					new InfoState(LogKind.error, `${e.name} - ${e.description}`)
				);
			}
		);
	}

	public stream(): void {
		if (this.state.recordingState === RecordingState.OFF) {
			this.createSocket();
		} else if (this.state.recordingState === RecordingState.ON) {
			if (this.socket) {
				this.socket.close();
			}
		}
	}

	private createSocket(): void {
		if (this.socket === undefined) {
			this.update((e) => {
				e.recordingState = RecordingState.LOADING;
			});
			this.socket = new WebSocket(this.socketAddress);
			this.socket.onopen = (ev: MessageEvent) => {
				this.update((e) => {
					e.recordingState = RecordingState.ON;
				});
				this.socket.onmessage = (ev: MessageEvent) => {
					this.worker.postMessage(ev.data);
				};
			};

			this.socket.onerror = (ev: MessageEvent) => {
				this.socket = undefined;
				this.update((e) => {
					e.recordingState = RecordingState.OFF;
				});
			};

			this.socket.onclose = (ev: CloseEvent) => {
				this.socket = undefined;
				this.update((e) => {
					e.recordingState = RecordingState.OFF;
				});
			};
		}
	}

	public capture(): void {
		this.apiSvc.get<null, ArrayBuffer>(
			'Robot/capture',
			null,
			(r) => {
				this.update((e) => {
					e.currentImage = URL.createObjectURL(new Blob([ r ], { type: 'image/jpg' }));
				});
			},
			(e) => {
				this.notificationSvc.onNotification.Invoke(
					this,
					new InfoState(LogKind.error, `${e.name} - ${e.description}`)
				);
			},
			{ responseType: 'arraybuffer' }
		);
	}

	order(ms: string) {
		this.orderToApi({ message: ms });
	}
}
