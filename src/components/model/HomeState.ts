import { NearScooter } from './NearScooter';
import { Point } from './Point';
import { Scooter } from './Scooter';

export class HomeState {
	point: Point;
	radius: number = 700;
	scooterCount: number = 5;
	all: Array<Scooter> = [];
	selected: Array<NearScooter> = [];
}
