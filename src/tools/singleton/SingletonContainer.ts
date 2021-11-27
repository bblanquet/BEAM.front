import { NotificationState } from '../../core/components/notification/NotificationState';
import { Point } from '../../core/model/Point';
import { ApiService } from '../../services/ApiService';
import { Store } from '../store/Store';
import { Singletons, SingletonKey } from './Singletons';

export class SingletonContainer {
	Register(): void {
		Singletons.Register(SingletonKey.notification, new Store<NotificationState>(undefined));
		Singletons.Register(SingletonKey.location, new Store<Point>(undefined));
		Singletons.Register(SingletonKey.scooterId, new Store<number>(undefined));
		Singletons.Register(SingletonKey.scooterCount, new Store<number>(5));
		Singletons.Register(SingletonKey.radius, new Store<number>(700));
		Singletons.Register(SingletonKey.api, new ApiService());
	}
}
