import App from './App.svelte';

const app = new App({
	target: document.body,
	props: {
		processUrl: 'http://localhost:8080/api/json-to-html'
	}
});

export default app;
