
var http = require( 'http' );
var url = require( 'url' );
var fs = require( 'fs' );

var polyfill = fs.readFileSync( 'polyfill.js' );
var clientjs = fs.readFileSync( 'client.js' );
var clientpage = [
					'<!DOCKTYPE html>',
					'<html>',
					'<head>',
					'<title>comet-demo</title>',
					'<meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">',
					'<script>',
					polyfill,
					'</script>',
					'<script>',
					clientjs,
					'</script>',
					'</head>',
					'<body>',
					'<input id="input" style="width:100%"/>',
					'</body>',
					'</html>'
				].join( '\n' );

var clients = [];

var server = http.createServer( onRequest );
server.listen( 3000 );
console.log( 'Server listenning at 3000' );

// 每20秒向客户端发送一个消息，防止客户端超时重连
setInterval( function() {

	clients.forEach( function( client ) {

		client.write( ': ping\n\n' );

	} );

}, 20000 );

function onRequest( request, response ) {

	var pathname = url.parse( request.url ).pathname;

	if ( pathname === '/' ) {

		response.writeHead( 200, {'Content-Type': 'text/html'} );
		response.write( clientpage );
		response.end();

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

				// 没有指定“event:”的事件为默认的“message”类型
				// 确保每一行的前缀都是“data:”
				// 并以两个换行符结束
				message = 'data:' + chunks.join( '' ).replace('\ndata:') + '\n\n';

				clients.forEach( function( client ) { client.write( message ); } );

			} );

		}
		else if ( request.method === 'GET' ) {

			response.writeHead( 200, {'Content-Type': 'text/event-stream'} );

			// 连接成功，发送一个“connected”类型事件
			response.write( 'event:connected\ndata:Wellcome!\n\n' );

			request.connection.on( 'end', function() {

				clients.splice( clients.indexOf( response ), 1 );
				response.end();

			} );

			clients.push( response );

		}

	}

}