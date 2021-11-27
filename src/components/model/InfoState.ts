import { LogKind } from '../../tools/logger/LogKind';

export class NotificationContent {
	constructor(public kind: LogKind, public message: string) {}
}
