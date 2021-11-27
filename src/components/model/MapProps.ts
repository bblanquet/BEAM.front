import { Point } from './Point';

export class MapProps {
	onPointChanged: (point: Point) => void;
	radius: number;
	id: number;
}
