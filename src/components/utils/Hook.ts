import { StateUpdater } from 'preact/hooks';

export abstract class Hook<TProps, TModel> {
	protected props: TProps;
	public constructor(public state: TModel, protected setState: StateUpdater<TModel>) {}

	protected update(setter: (state: TModel) => void): void {
		setter(this.state);
		this.setState({ ...this.state });
	}

	public unmount(): void {}

	public didMount(props: TProps): void {
		this.props = props;
	}

	public didUpdate(prevProps: TProps, props: TProps) {
		this.props = props;
	}
}
