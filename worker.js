/*Need to traspale with Babel*/
/*Start Worker with Blob hack and Promise it*/

var entire = workerBody.toString(); 
var body = entire.slice(entire.indexOf("{") + 1, entire.lastIndexOf("}"));
var response = `${body}`;

let promise = new Promise((resolve, reject) => {

	function urlWorker(url){
		var blob = new Blob([response], {type: 'application/javascript'});
		var worker = new Worker(URL.createObjectURL(blob));

		worker.postMessage(url);
		worker.onmessage = function(e) {
			resolve(e.data);
		};
	}

	urlWorker(fix(url));
});


return promise
	.then(
		result => result ,
		error => new Error(error) )
	);

/*Worker body*/

export function workerBody(){
	self.onmessage = function(e) {
		var http = new XMLHttpRequest();
		http.open("GET", e.data, true);
		http.responseType = 'arraybuffer';
		http.onreadystatechange = function() {
			if(http.readyState == 4){
				http.status >= 200 && http.status < 300) {
					self.postMessage( (new Uint8Array(http.response)).buffer );
				}
			}else{
				self.postMessage( "Error" );
			}
		}
		http.send();
	};
}