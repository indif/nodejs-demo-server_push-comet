
var http = require( 'http' );
var url = require( 'url' );
var fs = require( 'fs' );

var polyfill = fs.readFileSync( 'polyfill.js' );
var clientjs = fs.readFileSync( 'client.js' );

var clients = [];

http.createServer( onRequest ).listen( 3000 );
console.log( 'Server listenning at 3000' );

// 每20秒向客户端发送一个ping，放置客户端不断超时重连
// TODO：消息类型与监听事件需要搞明白
setInterval( function() {

	clients.forEach( function( client ) {

		client.write( ':ping\n' );

	} );

}, 20000 );

function onRequest( request, response ) {

	var pathname = url.parse( request.url ).pathname;

	if ( pathname === '/' ) {

		response.writeHead( 200, {'Content-Type': 'text/html'} );
		response.write( '<!DOCKTYPE html>' );
		response.write( '<html><head><title>comet-demo</title>');
		response.write( '<meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">' );
		response.write( '<script>' + polyfill + '</script>' );
		response.write( '<script>' + clientjs + '</script>' );
		response.write( '</head>' );
		response.write( '<body><input id="input" style="width:100%"/></body></html>' );
		response.end();

		return;

	}

	if ( pathname === '/chat' ) {

		if ( request.method === 'POST' ) {

			var message, chunks = [];

			request.on( 'data', function( chunk ) {

				chunks.push( chunk );

			} );

			request.on( 'end', function() {

				response.writeHead( 200 );
				response.end();

				// data:是message事件的标识
				// /n/n强制立即发送？
				message = 'data: ' + chunks.join( '' ) + '\n\n';

				clients.forEach( function( client ) { client.write( message ); } );

			} );

		}
		else if ( request.method === 'GET' ) {

			response.writeHead( 200, {'Content-Type': 'text/event-stream'} );
			response.write( 'data: Connected\n\n' );

			request.connection.on( 'end', function() {

				clients.splice( clients.indexOf( response ), 1 );
				response.end();

			} );

			clients.push( response );

		}

	}

}