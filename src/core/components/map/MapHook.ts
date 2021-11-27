import L from 'leaflet';
import { isEqual } from 'lodash';
import { StateUpdater } from 'preact/hooks';
import { IApiService } from '../../../services/IApiService';
import { Dictionary } from '../../../tools/collections/Dictionary';
import { LogKind } from '../../../tools/logger/LogKind';
import { Singletons, SingletonKey } from '../../../tools/singleton/Singletons';
import { IStore } from '../../../tools/store/IStore';
import { NotificationState } from '../notification/NotificationState';
import { MapState } from './MapState';
import { Point } from '../../model/Point';
import { Scooter } from '../../model/Scooter';
import { Hook } from '../../framework/Hook';

const SINGAPORE_LATITUDE = 1.3521;
const SINGAPORE_LONGITUDE = 103.8198;

export class MapHook extends Hook<{}, MapState> {
	private apiSvc: IApiService;
	private notificationStore: IStore<NotificationState>;
	private pointStore: IStore<Point>;
	private radiusStore: IStore<number>;
	private scooteridStore: IStore<number>;

	private map: L.Map;
	private markers: Dictionary<L.Marker> = new Dictionary<L.Marker>();
	private circle: L.Circle;
	private innerCircle: L.Circle;

	constructor(d: [MapState, StateUpdater<MapState>]) {
		super(d[0], d[1]);
		this.apiSvc = Singletons.Load<IApiService>(SingletonKey.api);
		this.pointStore = Singletons.Load<IStore<Point>>(SingletonKey.location);
		this.radiusStore = Singletons.Load<IStore<number>>(SingletonKey.radius);
		this.scooteridStore = Singletons.Load<IStore<number>>(SingletonKey.scooterId);
		this.notificationStore = Singletons.Load<IStore<NotificationState>>(SingletonKey.notification);

		this.update((s) => {
			s.id = this.scooteridStore.get();
			s.radius = this.radiusStore.get();
			s.point = this.pointStore.get();
		});

		this.pointStore.onChange.on((src: any, point: Point) => {
			if (!isEqual(point, this.state.point)) {
				this.update((s) => {
					s.point = point;
				});
				this.updateCircle();
			}
		});
		this.radiusStore.onChange.on((src: any, point: number) => {
			if (point !== this.state.radius) {
				this.update((s) => {
					s.radius = point;
				});
				this.updateCircle();
			}
		});
		this.scooteridStore.onChange.on((src: any, id: number) => {
			if (id !== this.state.id) {
				this.update((s) => {
					s.id = id;
				});
				this.openPopup(id);
			}
		});
	}

	public didMount(): void {
		if (this.map === undefined) {
			this.map = L.map('map', { zoomControl: false }).setView([ SINGAPORE_LATITUDE, SINGAPORE_LONGITUDE ], 13);
			L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(this.map);
			this.map.on('click', (e: any) => {
				this.pointStore.set(new Point(e.latlng.lat, e.latlng.lng));
			});
			this.all();
		}
	}

	public openPopup(id: number) {
		if (this.markers.Exist(id.toString())) {
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
				this.notificationStore.set(new NotificationState(LogKind.error, `${e.name} - ${e.description}`));
			}
		);
	}
}
