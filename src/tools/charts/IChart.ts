import { LiteEvent } from '../events/LiteEvent';

export interface IChart<T> {
	GetCanvas(key: string, model: T): HTMLCanvasElement;
	OnClickElement: LiteEvent<string>;
}
