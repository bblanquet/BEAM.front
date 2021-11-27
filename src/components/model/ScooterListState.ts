import { NearScooter } from './NearScooter';
import { Point } from './Point';
import { RequestState } from './RequestState';

export class ScooterListState {
	RequestState: RequestState = RequestState.LOADED;
	selected: Array<NearScooter> = [];
	radius: number;
	count: number;
	point: Point;
}
