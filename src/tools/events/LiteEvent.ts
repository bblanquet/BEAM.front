import { ErrorHandler } from '../exception/ErrorHandler';
import { ILiteEvent } from './ILiteEvent';

export class LiteEvent<T> implements ILiteEvent<T> {
	private handlers: { (obj: any, data: T): void }[] = [];

	public on(handler: { (obj: any, data: T): void }): void {
		ErrorHandler.ThrowNullOrUndefined(handler);
		this.handlers.push(handler);
	}

	public off(handler: { (obj: any, data: T): void }): void {
		this.handlers = this.handlers.filter((h) => h !== handler);
	}

	public clear() {
		this.handlers = [];
	}

	public invoke(obj: any, data?: T) {
		this.handlers.forEach((h) => h(obj, data));
	}
}
