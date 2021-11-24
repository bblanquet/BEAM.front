import { InfoState } from '../components/model/InfoState';
import { LiteEvent } from '../tools/events/LiteEvent';
import { INotificationService } from './INotificationService';

export class NotificationService implements INotificationService {
	public onNotification: LiteEvent<InfoState> = new LiteEvent<InfoState>();
}
