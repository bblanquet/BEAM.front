import { h, render } from 'preact';
import HomeScreen from './components/screen/Homescreen';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/js/solid';
import '@fortawesome/fontawesome-free/js/regular';
import '@fortawesome/fontawesome-free/js/brands';
import './common.css';
import './animation.css';
import Router from 'preact-router';
import { SingletonContainer } from './tools/singleton/SingletonContainer';

new SingletonContainer().Register();

render(<HomeScreen />, document.body);

const App = (e: any) => {
	return (
		<Router>
			<HomeScreen path={'home'} default />
		</Router>
	);
};

render(<App />, document.body);
