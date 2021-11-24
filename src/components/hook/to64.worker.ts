const ctx: Worker = self as any;

// Respond to message from parent thread
ctx.addEventListener('message', (event) => {
	const data = atob(event.data);
	const array = Uint8Array.from(data, (b) => b.charCodeAt(0));
	const blob = new Blob([ array ], { type: 'image/jpg' });
	ctx.postMessage(blob);
});
