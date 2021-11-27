import { Component, h } from 'preact';
import { HomeState } from '../model/HomeState';
import Notification from '../common/Notification';
import Map from '../common/Map';
import Sidebar from '../common/Sidebar';
import ScooterList from '../common/ScooterList';
import { Panel } from '../common/Panel';

export default class HomeScreen extends Component<{}, {}> {
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
