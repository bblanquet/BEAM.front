import { h } from 'preact';
import { HookableComponent } from '../../framework/HookableComponent';
import { useState } from 'preact/hooks';
import { MapHook } from './MapHook';
import { MapState } from './MapState';

export default class Map extends HookableComponent<{}, MapHook, MapState> {
	getDefaultHook() {
		return new MapHook(useState(new MapState()));
	}

	rendering() {
		return <div id="map" />;
	}
}
