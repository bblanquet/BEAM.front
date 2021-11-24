import { RecordingState } from './RecordingState';

export class HomeState {
	isOnline: boolean = false;
	recordingState: RecordingState = RecordingState.OFF;
	currentImage: string = '{{asset_path}}img/test.jpg';
}
