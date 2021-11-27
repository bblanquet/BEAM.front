import { LiteEvent } from '../events/LiteEvent';
import { IStore } from './IStore';

export class Store<T> implements IStore<T> {
	public onChange: LiteEvent<T> = new LiteEvent<T>();
	constructor(private value: T) {}
	get(): T {
		return this.value;
	}
	set(value: T): void {
		this.value = value;
		this.onChange.invoke(this, value);
	}
}
