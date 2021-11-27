import { Point } from '../../model/Point';
import { Scooter } from '../../model/Scooter';

export class MapState {
	point: Point;
	all: Array<Scooter> = [];
	radius: number;
	id: number | undefined;
}
