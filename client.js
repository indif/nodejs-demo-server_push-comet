
window.onload = function() {

	var nick = prompt( 'Enter your name' );
	var input = document.getElementById( 'input' );

	input.focus();

	var chat = new EventSource( '/chat' );
	chat.onmessage = function( event ) {

		var msg = event.data;
		var node = document.createTextNode( msg );
		var div = document.createElement( 'div' );
		div.appendChild( node );
		document.body.insertBefore( div, input );

	};

	// 捕获其他类型的事件
	// 注意：如果服务端发送的消息没有data:，则这里捕获不到事件
	chat.addEventListener( 'connected', function( event ) {

		var msg = event.data;
		var node = document.createTextNode( msg );
		var div = document.createElement( 'div' );
		div.appendChild( node );
		document.body.insertBefore( div, input );

	} );

	input.onchange = function() {

		var msg = nick + ': ' + input.value;
		var xhr = new XMLHttpRequest();
		xhr.open( 'POST', '/chat' );
		xhr.setRequestHeader( 'Content-Type', 'text/plain;charset=UTF-8' );
		xhr.send( msg );

		input.value = '';

	};

};
