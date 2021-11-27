import { ILiteEvent } from '../events/ILiteEvent';

export interface IStore<T> {
	get(): T;
	set(value: T): void;
	onChange: ILiteEvent<T>;
}
