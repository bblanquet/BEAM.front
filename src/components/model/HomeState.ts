import { NearScooter } from './NearScooter';
import { Scooter } from './Scooter';

export class HomeState {
	isSidebarVisible: boolean = false;
	radius: number = 10000;
	scooterCount: number = 5;
	all: Array<Scooter> = [];
	selected: Array<NearScooter> = [];
}
