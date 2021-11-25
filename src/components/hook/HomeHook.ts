import { HomeState } from '../model/HomeState';
import { Hook } from '../utils/Hook';
import { StateUpdater } from 'preact/hooks';
import { SingletonKey, Singletons } from '../../tools/singleton/Singletons';
import { IApiService } from '../../services/IApiService';
import { INotificationService } from '../../services/INotificationService';
import { InfoState } from '../model/InfoState';
import { LogKind } from '../../tools/logger/LogKind';
import * as L from 'leaflet';
import { Scooter } from '../model/Scooter';
import { NearScooterPayload } from '../model/NearScooterPayload';
import { NearScooter } from '../model/NearScooter';

export class HomeHook extends Hook<HomeState> {
	private apiSvc: IApiService;
	private notificationSvc: INotificationService;
	private map: L.Map;
	private markers: L.Marker[] = [];
	private circle: L.Circle;
	private innerCircle: L.Circle;
	private animateSidebar: (e: boolean) => void;

	constructor(d: [HomeState, StateUpdater<HomeState>], animateSidebar: (e: boolean) => void) {
		super(d[0], d[1]);
		this.animateSidebar = animateSidebar;
		this.apiSvc = Singletons.Load<IApiService>(SingletonKey.api);
		this.notificationSvc = Singletons.Load<INotificationService>(SingletonKey.notification);
		this.all();
	}

	public didMount(): void {
		if (this.map === undefined) {
			this.map = L.map('map', { zoomControl: false }).setView([ 1.3521, 103.8198 ], 13);
			L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(this.map);
			this.map.on('click', (e: any) => {
				if (this.circle) {
					this.circle.remove();
					this.innerCircle.remove();
				}

				if (this.innerCircle) {
					this.innerCircle.remove();
				}

				this.circle = L.circle([ e.latlng.lat, e.latlng.lng ], {
					color: 'purple',
					fillColor: '#625EAA',
					fillOpacity: 0.5,
					radius: this.state.radius
				}).addTo(this.map);

				this.innerCircle = L.circle([ e.latlng.lat, e.latlng.lng ], {
					color: 'white',
					fillColor: '#fff',
					fillOpacity: 0.5,
					radius: 5
				}).addTo(this.map);

				this.close(e.latlng.lat, e.latlng.lng, this.state.radius);
			});
		}
	}

	public unmount(): void {}

	protected stateChanged(): void {}

	private close(latitude: number, longitude: number, radius: number): void {
		this.apiSvc.get<NearScooterPayload, Array<NearScooter>>(
			'Scooter/close',
			{ latitude, longitude, radius },
			(r) => {
				this.update((s) => {
					s.selected = r;
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

	private all(): void {
		this.apiSvc.get<null, Array<Scooter>>(
			'Scooter/all',
			null,
			(r) => {
				if (0 < this.markers.length) {
					this.markers.forEach((m) => {
						m.remove();
					});
					this.markers = [];
				}

				r.forEach((scooter) => {
					this.markers.push(
						L.marker([ scooter.latitude, scooter.longitude ])
							.bindPopup(`<b>Hello!</b><br>I am #${scooter.id}.`)
							.addTo(this.map)
					);
				});
				this.update((s) => {
					s.all = r;
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

	setSidebar() {
		const value = !this.state.isSidebarVisible;
		this.update((s) => {
			s.isSidebarVisible = value;
		});
		this.animateSidebar(value);
	}

	setRadius(value: any): void {
		this.update((s) => {
			s.radius = value;
		});
	}

	setScooter(value: any): void {
		this.update((s) => {
			s.scooterCount = value;
		});
	}
}
