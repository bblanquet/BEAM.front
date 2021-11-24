import { LogKind } from '../../tools/logger/LogKind';

export class InfoState {
	constructor(public kind: LogKind, public message: string) {}
}
