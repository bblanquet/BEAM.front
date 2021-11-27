import { NearScooter } from '../../model/NearScooter';
import { Point } from '../../model/Point';
import { RequestState } from '../../model/RequestState';

export class ScooterListState {
	RequestState: RequestState = RequestState.LOADED;
	selected: Array<NearScooter> = [];
	radius: number;
	count: number;
	point: Point;
}
