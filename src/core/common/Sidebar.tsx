import { Component, h } from 'preact';
import Icon from './Icon';
import Switch from './Switch';
import './Sidebar.css';

export default class Sidebar extends Component<{}, { isSidebarVisible: boolean }> {
	private sidebar: HTMLElement;
	private sidebarBtn: HTMLElement;

	componentDidUpdate() {
		this.sidebar.style.width = this.state.isSidebarVisible ? `${this.getWidth()}px` : '0px';
		this.sidebarBtn.style.left = this.state.isSidebarVisible ? `${this.getWidth()}px` : '0px';
	}

	private getWidth(): number {
		if (this.isMobile()) {
			return 175;
		} else {
			return 250;
		}
	}

	private isMobile() {
		return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
	}

	render() {
		return (
			<div class="sidebar" ref={(e) => (this.sidebar = e)}>
				<div class="btn-sidebar" ref={(e) => (this.sidebarBtn = e)}>
					<button
						type="button"
						class={this.state.isSidebarVisible ? 'btn btn-light' : 'btn btn-primary'}
						onClick={(e) => {
							this.setSidebar();
						}}
					>
						<Switch
							isLeft={this.state.isSidebarVisible}
							left={<Icon value="fas fa-arrow-left" />}
							right={<Icon value="fas fa-bars" />}
						/>
					</button>
				</div>
				<div style="padding:5px">{this.props.children}</div>
			</div>
		);
	}
	setSidebar() {
		this.setState({
			isSidebarVisible: !this.state.isSidebarVisible
		});
	}
}
