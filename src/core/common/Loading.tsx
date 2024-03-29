import { Component, h } from 'preact';
import { RequestState } from '../model/RequestState';
import Visible from './Visible';
import Icon from './Icon';

export default class Loading extends Component<{ value: RequestState }, {}> {
	render() {
		return (
			<div>
				<Visible isVisible={this.props.value === RequestState.LOADING}>
					<ul class="list-group">
						<li class="list-group-item list-group-item-light">
							<Icon value="fas fa-spinner fa-spin" />
							<span style="margin:5px">Loading...</span>
						</li>
					</ul>
				</Visible>
				<Visible isVisible={this.props.value === RequestState.ERROR}>
					<span class="sm-m">
						<Icon value="fas fa-exclamation-triangle" />
					</span>
					Sorry, we could not retrieve the data.
				</Visible>
				<Visible isVisible={this.props.value === RequestState.LOADED}>{this.props.children}</Visible>
			</div>
		);
	}
}
