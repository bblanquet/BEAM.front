import { StateUpdater } from 'preact/hooks';

export abstract class Hook<T> {
	public constructor(public state: T, protected setState: StateUpdater<T>) {}

	protected update(setter: (state: T) => void): void {
		setter(this.state);
		this.setState({ ...this.state });
		this.stateChanged();
	}

	protected abstract stateChanged(): void;

	public abstract unmount(): void;
}
