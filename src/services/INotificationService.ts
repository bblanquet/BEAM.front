import { InfoState } from '../components/model/InfoState';
import { LiteEvent } from '../tools/events/LiteEvent';

export interface INotificationService {
	onNotification: LiteEvent<InfoState>;
}
