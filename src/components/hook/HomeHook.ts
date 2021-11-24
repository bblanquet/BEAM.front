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
import * as L from 'leaflet';

export class HomeHook extends Hook<HomeState> {
	private apiSvc: IApiService;
	private notificationSvc: INotificationService;
	private socket: WebSocket;
	private socketAddress: string = '{{socket}}';
	private img: HTMLImageElement = new Image();
	private worker;
	private map: L.Map;
	private markers: L.Marker[] = [];

	constructor(d: [HomeState, StateUpdater<HomeState>]) {
		super(d[0], d[1]);
		this.apiSvc = Singletons.Load<IApiService>(SingletonKey.api);
		this.notificationSvc = Singletons.Load<INotificationService>(SingletonKey.notification);
		this.status('Robot/status');
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

	public didMount(): void {
		if (this.map === undefined) {
			this.map = L.map('map').setView([ 1.3521, 103.8198 ], 13);
			L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
				attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
			}).addTo(this.map);
			this.map.on('click', (e: any) => {
				L.marker([ e.latlng.lat, e.latlng.lng ]).addTo(this.map);
			});
			this.addRandomMarker();
			// L.marker([ 1.3521, 103.8198 ])
			// 	.addTo(this.map)
			// 	.bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
			// 	.openPopup();
		}
	}

	private addRandomMarker() {
		let i = 0;
		while (i < 10) {
			const lat = Math.random() * 0.1 + 1.3521;
			const lng = Math.random() * 0.1 + 103.8198;
			this.markers.push(L.marker([ lat, lng ]).addTo(this.map));
			i++;
		}
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
