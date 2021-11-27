import { h } from 'preact';
import { HookableComponent } from '../utils/HookableComponent';
import { useState } from 'preact/hooks';
import { MapHook } from '../hook/MapHook';
import { MapState } from '../model/MapState';

export default class Map extends HookableComponent<{}, MapHook, MapState> {
	getDefaultHook() {
		return new MapHook(useState(new MapState()));
	}

	rendering() {
		return <div id="map" />;
	}
}
