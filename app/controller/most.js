var gramophone = require("gramophone");
var request = require('request');
function test(){
	this.getMost = (req, res, next)=>{
		var stream = gramophone.transformStream({from: 'text', to: 'keywords'});
		stream.write({ text: 'foo and bar and foo'},{ text: 'aku aku aku dia aaaa'});
		stream.listener((s)=>{
			console.log(s);
		});
		stream.end();

	}
}

module.exports = new test();

