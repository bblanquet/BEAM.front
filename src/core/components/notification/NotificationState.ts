import { LogKind } from '../../../tools/logger/LogKind';

export class NotificationState {
	constructor(public kind: LogKind, public message: string) {}
}
