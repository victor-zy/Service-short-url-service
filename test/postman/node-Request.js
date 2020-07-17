// eslint-disable-next-line strict
var request = require('request');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
function getCookie() {
    let name = 'csrfToken';
  var arr,reg = new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    global.document = new JSDOM().window.document;
	// eslint-disable-next-line no-undef
	if(arr = document.cookie.match(reg)) {
		console.log(unescape(arr[2]));
    } 
   else {
		return null;
	}
}
var options = {
  'method': 'POST',
  'url': 'http://127.0.0.1:7001/shorturl',
  'headers': {
    'Content-Type': 'application/x-www-form-urlencoded',
    'x-csrf-token': getCookie("csrfToken"),
  },
  form: {
      'url': 'www.gaoding.com'
  }
};
request(options, function (error, response) { 
  if (error) throw new Error(error);
  console.log(response.body);
});
