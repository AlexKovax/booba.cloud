async function handleRequest(request) {
	const headers = {
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Methods': 'GET',
		'Access-Control-Allow-Headers': 'Content-Type'
	};

	try {

		const url = new URL(request.url);
		var formatParameter = null;
		if (url.searchParams.get('format')) {
			formatParameter = url.searchParams.get('format').toLocaleLowerCase().split('/')[0];
			if (formatParameter != 'json' && formatParameter != 'text') {
				return new Response('Invalid format parameter. Refer to https://kanye.rest', {
					status: 400,
					headers: {
						...headers
					}
				});
			}
		}
		const acceptHeader = request.headers.get('Accept');


		let quotes = require('./quotes.json');
		const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

		if (formatParameter !== 'text' && acceptHeader !== 'text/plain') {
			return new Response(JSON.stringify({ quote: randomQuote }), {
				headers: {
					...headers,
					'Content-Type': 'application/json'
				}
			});
		} else {
			return new Response(randomQuote, {
				headers: {
					...headers,
					'Content-Type': 'text/plain'
				}
			});
		}
	} catch (error) {
		console.log(error);
		return new Response('An unexpected error ocurred', {
			status: 500,
			headers: {
				...headers
			}
		});
	}
}

addEventListener('fetch', (event) => {
	return event.respondWith(handleRequest(event.request));
});
