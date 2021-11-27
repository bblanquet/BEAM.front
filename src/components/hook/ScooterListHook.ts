import { isEqual } from 'lodash';
import { StateUpdater } from 'preact/hooks';
import { IApiService } from '../../services/IApiService';
import { LogKind } from '../../tools/logger/LogKind';
import { Singletons, SingletonKey } from '../../tools/singleton/Singletons';
import { IStore } from '../../tools/store/IStore';
import { NotificationContent } from '../model/InfoState';
import { NearScooter } from '../model/NearScooter';
import { NearScooterPayload } from '../model/NearScooterPayload';
import { Point } from '../model/Point';
import { RequestState } from '../model/RequestState';
import { ScooterListState } from '../model/ScooterListState';
import { Hook } from '../utils/Hook';

export class ScooterListHook extends Hook<{}, ScooterListState> {
	private timeout: NodeJS.Timeout;
	private apiSvc: IApiService;
	private notificationStore: IStore<NotificationContent>;
	private pointStore: IStore<Point>;
	private countStore: IStore<number>;
	private radiusStore: IStore<number>;
	private scooterStore: IStore<number>;

	public constructor(d: [ScooterListState, StateUpdater<ScooterListState>]) {
		super(d[0], d[1]);
		this.apiSvc = Singletons.Load<IApiService>(SingletonKey.api);
		this.notificationStore = Singletons.Load<IStore<NotificationContent>>(SingletonKey.notification);
		this.pointStore = Singletons.Load<IStore<Point>>(SingletonKey.location);
		this.countStore = Singletons.Load<IStore<number>>(SingletonKey.scooterCount);
		this.radiusStore = Singletons.Load<IStore<number>>(SingletonKey.radius);
		this.scooterStore = Singletons.Load<IStore<number>>(SingletonKey.scooterId);
		this.update((s) => {
			s.count = this.countStore.get();
			s.radius = this.radiusStore.get();
			s.point = this.pointStore.get();
		});
		this.pointStore.onChange.on((src: any, point: Point) => {
			if (!isEqual(point, this.state.point)) {
				this.update((s) => {
					s.point = point;
				});
				this.tryToGetNear();
			}
		});
		this.countStore.onChange.on((src: any, count: number) => {
			if (this.state.count !== count) {
				this.update((s) => {
					s.count = this.countStore.get();
				});
				this.tryToGetNear();
			}
		});
		this.radiusStore.onChange.on((src: any, radius: number) => {
			if (this.state.radius !== radius) {
				this.update((s) => {
					s.radius = this.radiusStore.get();
				});
				this.tryToGetNear();
			}
		});
	}

	public isValidState(): boolean {
		return this.state.point !== undefined && 0 < this.state.radius && 0 < this.state.count;
	}

	public setView(id: number) {
		this.scooterStore.set(id);
	}

	private tryToGetNear() {
		if (this.isValidState()) {
			this.update((s) => {
				s.RequestState = RequestState.LOADING;
			});
			if (this.timeout) {
				clearTimeout(this.timeout);
				this.timeout = null;
			}
			this.timeout = setTimeout(() => {
				this.getNear();
			}, 500);
		}
	}

	private getNear(): void {
		if (this.isValidState()) {
			this.apiSvc.get<NearScooterPayload, Array<NearScooter>>(
				'Scooter/near',
				{
					latitude: this.state.point.latitude,
					longitude: this.state.point.longitude,
					radius: this.state.radius,
					scooterCount: this.state.count
				},
				(r) => {
					this.update((s) => {
						s.selected = r;
						s.RequestState = RequestState.LOADED;
					});
				},
				(e) => {
					this.update((s) => {
						s.RequestState = RequestState.ERROR;
					});
					this.notificationStore.set(new NotificationContent(LogKind.error, `${e.name} - ${e.description}`));
				}
			);
		}
	}
}
