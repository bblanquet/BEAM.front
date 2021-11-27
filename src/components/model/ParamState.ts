import { Point } from './Point';

export class ParamState {
	public constructor(public point: Point, public radius: number = 700, public scooterCount: number = 5) {}
}
