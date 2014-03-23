var http = require('http'),
	url = require('url'),
	SerialPort = require('serialport').SerialPort ;

var serialPort;
var portName = '/dev/tty.usbserial-A600entp'; //change this to your Arduino port

// handle contains locations to browse to (vote and poll); pathnames.
function startServer()
{
	// on request event
	function onRequest(request, response) {
	  // parse the requested url into pathname. pathname will be compared
	  // in route.js to handle (var content), if it matches the a page will 
	  // come up. Otherwise a 404 will be given. 
	  var pathname = url.parse(request.url).pathname;
	  sendCommand(pathname) ;
	  response.end() ;
	}
	
	http.createServer(onRequest).listen(1337, function(){
		console.log('Listening at: http://localhost:1337');
		console.log('Server is up');
	});
	serialListener();

}

// Listen to serial port
function serialListener()
{
    serialPort = new SerialPort(portName, {
        baudrate: 9600,
        // defaults for Arduino serial communication
         dataBits: 8,
         parity: 'none',
         stopBits: 1,
         flowControl: false
    },false);
	var rxData = '' ;
    serialPort.open(function (err) {
		if (err) return console.log(err) ;
		serialPort.on('data', function(data) {
			if (data){
				rxData += data ;
				if (data.toString().indexOf('\n') > -1){
					var jsonData = JSON.parse(rxData) ;
					console.log(jsonData) ;
					rxData = '' ;
				}
			}
		});
    });
}

function sendCommand(command){
	command = command.slice(1) + '\n' ;
	console.log(command) ;
	serialPort.write(command);
}

startServer();