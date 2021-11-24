import { Component, h } from 'preact';
import * as L from 'leaflet';

export default class HomeScreen extends Component<{}, {}> {
	private map: any;

	componentDidMount() {
		if (this.map === undefined) {
			this.map = L.map('map').setView([ 1.3521, 103.8198 ], 13);
			L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
				attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
			}).addTo(this.map);

			L.marker([ 1.3521, 103.8198 ])
				.addTo(this.map)
				.bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
				.openPopup();
		}
	}

	render() {
		return <div id="map" />;
	}
}
