import { h, render } from 'preact';
import HomeScreen from './components/screen/Homescreen';
import './common.css';
import './animation.css';
import Router from 'preact-router';

const App = (e: any) => {
	return (
		<Router>
			<HomeScreen path={'home'} default />
		</Router>
	);
};

render(<App />, document.body);
