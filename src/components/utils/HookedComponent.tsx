import { Hook } from './Hook';
import { Component, JSX } from 'preact';

export abstract class HookedComponent<T1, T2 extends Hook<T3>, T3> extends Component<T1> {
	private _render: () => JSX.Element = this.init.bind(this);
	protected hook: T2;

	public abstract rendering(): JSX.Element;
	public abstract getDefaultHook(): T2;

	private init(): JSX.Element {
		this.hook = this.getDefaultHook();
		this._render = this.rendering.bind(this);
		return this.rendering();
	}

	render() {
		return this._render();
	}

	componentWillUnmount() {
		this.hook.unmount();
	}
}
