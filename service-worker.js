const CACHE_NAME = 'anjo-cache-v1';
const ASSETS_TO_CACHE = [
	'./',
	'./index.html',
	'./styles.css',
	'./app.js',
	'./content.json',
	'./manifest.json',
	'./assets/logo.svg',
	'./assets/cover.svg'
];

self.addEventListener('install', event => {
	event.waitUntil(
		caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS_TO_CACHE))
	);
});

self.addEventListener('activate', event => {
	event.waitUntil(
		caches.keys().then(keys => {
			return Promise.all(
				keys.filter(key => key !== CACHE_NAME)
					.map(key => caches.delete(key))
			);
		})
	);
});

self.addEventListener('fetch', event => {
	event.respondWith(
		caches.match(event.request).then(response => {
			return response || fetch(event.request);
		})
	);
});
