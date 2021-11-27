import { Component, h } from 'preact';
import Notification from '../components/notification/Notification';
import Map from '../components/map/Map';
import Sidebar from '../common/Sidebar';
import { Panel } from '../components/panel/Panel';
import ScooterList from '../components/scooterList/ScooterList';
import { IStore } from '../../tools/store/IStore';
import { NotificationState } from '../components/notification/NotificationState';
import { Singletons, SingletonKey } from '../../tools/singleton/Singletons';
import { LogKind } from '../../tools/logger/LogKind';

export default class HomeScreen extends Component<{}, {}> {
	private notificationStore: IStore<NotificationState>;
	constructor() {
		super();
		this.notificationStore = Singletons.Load<IStore<NotificationState>>(SingletonKey.notification);
	}

	componentDidMount() {
		this.notificationStore.set(
			new NotificationState(LogKind.info, `Welcome to the BEAM! Please click on the map to get a position.`)
		);
	}

	render() {
		return (
			<div>
				<Sidebar>
					<Panel />
					<ScooterList />
				</Sidebar>
				<Map />
				<Notification />
			</div>
		);
	}
}
