import { Point } from './Point';
import { Scooter } from './Scooter';

export class MapState {
	point: Point;
	all: Array<Scooter> = [];
	radius: number;
	id: number | undefined;
}
