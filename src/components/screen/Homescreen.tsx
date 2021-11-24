import { h } from 'preact';
import { HomeState } from '../model/HomeState';
import { HookedComponent } from '../utils/HookedComponent';
import { HomeHook } from '../Hook/HomeHook';
import { useState } from 'preact/hooks';
export default class HomeScreen extends HookedComponent<{}, HomeHook, HomeState> {
	getDefaultHook() {
		return new HomeHook(useState(HomeHook.defaultState()));
	}

	rendering() {
		return <div id="map" />;
	}
}
