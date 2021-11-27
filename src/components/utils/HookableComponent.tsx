import { Hook } from './Hook';
import { Component, JSX } from 'preact';

export abstract class HookableComponent<TProps, THook extends Hook<TProps, TModel>, TModel> extends Component<TProps> {
	private _render: () => JSX.Element = this.init.bind(this);
	protected hook: THook;

	public abstract rendering(): JSX.Element;
	public abstract getDefaultHook(): THook;

	private init(): JSX.Element {
		this.hook = this.getDefaultHook();
		this._render = this.rendering.bind(this);
		return this.rendering();
	}

	render() {
		return this._render();
	}

	componentDidMount() {
		this.hook.didMount(this.props);
	}

	componentDidUpdate(prevProps: TProps) {
		this.hook.didUpdate(prevProps, this.props);
	}

	componentWillUnmount() {
		this.hook.unmount();
	}
}
