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
import { Point } from '../model/Point';
import { Dictionary } from '../../tools/collections/Dictionary';

const SINGAPORE_LATITUDE = 1.3521;
const SINGAPORE_LONGITUDE = 103.8198;

export class HomeHook extends Hook<HomeState> {
	private apiSvc: IApiService;
	private notificationSvc: INotificationService;
	private map: L.Map;
	private markers: Dictionary<L.Marker> = new Dictionary<L.Marker>();
	private circle: L.Circle;
	private innerCircle: L.Circle;
	private timeout: NodeJS.Timeout;

	constructor(d: [HomeState, StateUpdater<HomeState>]) {
		super(d[0], d[1]);
		this.apiSvc = Singletons.Load<IApiService>(SingletonKey.api);
		this.notificationSvc = Singletons.Load<INotificationService>(SingletonKey.notification);
	}

	public didMount(): void {
		if (this.map === undefined) {
			this.map = L.map('map', { zoomControl: false }).setView([ SINGAPORE_LATITUDE, SINGAPORE_LONGITUDE ], 13);
			L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(this.map);
			this.map.on('click', (e: any) => {
				this.update((s) => {
					s.point = new Point(e.latlng.lat, e.latlng.lng);
				});
				this.updateCircle();
				this.tryToGetNear();
			});
			this.all();
		}
	}

	public setView(id: number) {
		const scooter = this.state.selected.find((s) => s.scooter.id === id).scooter;
		if (scooter) {
			this.markers.Get(id.toString()).openPopup();
		}
	}

	private updateCircle(): void {
		if (this.state.point !== undefined) {
			if (this.circle) {
				this.circle.remove();
				this.innerCircle.remove();
			}

			if (this.innerCircle) {
				this.innerCircle.remove();
			}

			this.circle = L.circle([ this.state.point.latitude, this.state.point.longitude ], {
				color: 'purple',
				fillColor: '#625EAA',
				fillOpacity: 0.5,
				radius: this.state.radius
			}).addTo(this.map);

			this.innerCircle = L.circle([ this.state.point.latitude, this.state.point.longitude ], {
				color: 'white',
				fillColor: '#fff',
				fillOpacity: 0.5,
				radius: 5
			}).addTo(this.map);
		}
	}

	public unmount(): void {}

	protected stateChanged(): void {}

	private getNear(): void {
		if (this.state.point !== undefined) {
			this.apiSvc.get<NearScooterPayload, Array<NearScooter>>(
				'Scooter/near',
				{
					latitude: this.state.point.latitude,
					longitude: this.state.point.longitude,
					radius: this.state.radius,
					scooterCount: this.state.scooterCount
				},
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
	}

	private all(): void {
		this.apiSvc.get<null, Array<Scooter>>(
			'Scooter/all',
			null,
			(scooters) => {
				if (0 < this.markers.Count()) {
					this.markers.Values().forEach((m) => {
						m.remove();
					});
					this.markers.Clear();
				}
				this.update((s) => {
					s.all = scooters;
				});
				scooters.forEach((scooter) => {
					this.markers.Add(
						scooter.id.toString(),
						L.marker([ scooter.latitude, scooter.longitude ])
							.bindPopup(`<b>Hello!</b><br>I am #${scooter.id}.`)
							.addTo(this.map)
					);
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

	setRadius(value: any): void {
		this.update((s) => {
			s.radius = value;
		});
		this.updateCircle();
		this.tryToGetNear();
	}

	setScooter(value: any): void {
		this.update((s) => {
			s.scooterCount = value;
		});
		this.tryToGetNear();
	}

	private tryToGetNear() {
		if (this.timeout) {
			clearTimeout(this.timeout);
			this.timeout = null;
		}
		this.timeout = setTimeout(() => {
			this.getNear();
		}, 500);
	}
}
