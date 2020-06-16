const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const moment = require('moment');

const app = express();
app.use(bodyParser.json());

///////////////****************APP CONSTANTS *************/////////////////////

const urls = {
	stk: '',
	simulate: '',
	b2c: '',
	base_url: '',
};

///////////////****************ROUTES *************/////////////////////

app.get('/', (req, res) => {
	console.log('SERVER CONNECTED');
	res.status(200).json({
		message: 'SERVER CONNECTED ',
	});
});

app.get('/access_token', access_token, (req, res) => {
	res.status(200).json({ access_token: req.access_token });
});

///////////////****************REPONSE ENDPOINTS REGISTRATION*************/////////////////////

app.get('/register', access_token, (req, resp) => {
	let url = 'https://sandbox.safaricom.co.ke/mpesa/c2b/v1/registerurl';
	let auth = 'Bearer ' + req.access_token;

	request(
		{
			url: url,
			method: 'POST',
			headers: {
				Authorization: auth,
			},
			json: {
				ShortCode: '600384',
				ResponseType: 'Complete',
				ConfirmationURL: 'http://YOUR_IP:80/confirmation',
				ValidationURL: 'http://YOUR_IP:80/validation',
			},
		},
		function (error, response, body) {
			if (error) {
				console.log(error);
			}
			resp.status(200).json(body);
		}
	);
});

app.post('/confirmation', (req, res) => {
	console.log('....................... confirmation .............');
	console.log(req.body);
	console.log('....................... confirmation .............');
});

app.post('/validation', (req, resp) => {
	console.log('....................... validation .............');
	console.log(req.body);
	console.log('....................... validation .............');
});

app.get('/simulate', access_token, (req, res) => {
	let url = 'https://sandbox.safaricom.co.ke/mpesa/c2b/v1/simulate';
	let auth = 'Bearer ' + req.access_token;

	request(
		{
			url: url,
			method: 'POST',
			headers: {
				Authorization: auth,
			},
			json: {
				ShortCode: '600384',
				CommandID: 'CustomerPayBillOnline',
				Amount: '1',
				Msisdn: 'YOUR_PHONE_NO @+254...',
				BillRefNumber: 'TestAPI',
			},
		},
		function (error, response, body) {
			if (error) {
				console.log(error);
			} else {
				res.status(200).json(body);
				console.log('....................... validation .............');
				console.log(body);
				console.log('....................... validation .............');
			}
		}
	);
});

app.get('/balance', access, (req, resp) => {
	let url = 'https://sandbox.safaricom.co.ke/mpesa/accountbalance/v1/query';
	let auth = 'Bearer ' + req.access_token;

	request(
		{
			url: url,
			method: 'POST',
			headers: {
				Authorization: auth,
			},
			json: {
				Initiator: 'apitest342',
				SecurityCredential: 'YOUR_CREDENTIALS',
				CommandID: 'AccountBalance',
				PartyA: '601342',
				IdentifierType: '4',
				Remarks: 'bal',
				QueueTimeOutURL: 'http://YOUR_IP:80/bal_timeout',
				ResultURL: 'http://YOUR_IP:80/bal_result',
			},
		},
		function (error, response, body) {
			if (error) {
				console.log(error);
			} else {
				resp.status(200).json(body);
			}
		}
	);
});

app.get('/stk', access_token, (req, res) => {
	const url = 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
		auth = 'Bearer ' + req.access_token;
	const timestamp = moment().format('YYYYMMDDHHmmss');

	const password = new Buffer.from('174379' + 'YOUR_PUBLIC_KEY' + timestamp).toString(
		'base64'
	);

	request(
		{
			url: url,
			method: 'POST',
			headers: {
				Authorization: auth,
			},
			json: {
				BusinessShortCode: '174379',
				Password: password,
				Timestamp: timestamp,
				TransactionType: 'CustomerPayBillOnline',
				Amount: '1',
				PartyA: 'YOUR_PHONE_NO',
				PartyB: '174379',
				PhoneNumber: 'YOUR_PHONE_NO',
				CallBackURL:
					'http://159acd8c67fc.ngrok.io/stk_callback **SPIN UP AN NGROK SERVER FOR THE RESPONSE',
				AccountReference: 'Test',
				TransactionDesc: 'TestPay',
			},
		},
		function (error, response, body) {
			if (error) {
				console.log(error);
			} else {
				res.status(200).json(body);
			}
		}
	);
});

app.get('/b2c', access, (req, res) => {
	const url = 'https://sandbox.safaricom.co.ke/mpesa/b2c/v1/paymentrequest',
		auth = 'Bearer ' + req.access_token;

	request(
		{
			method: 'POST',
			url: url,
			headers: {
				Authorization: auth,
			},
			json: {
				InitiatorName: 'apitest342',
				SecurityCredential: '',
				CommandID: 'BusinessPayment',
				Amount: '200',
				PartyA: '601342',
				PartyB: 'PHONE_NO',
				Remarks: 'please pay',
				QueueTimeOutURL: 'http://YOUR_IP:80/b2c_timeout_url',
				ResultURL: 'http://YOUR_IP:80/b2c_result_url',
				Occasion: 'endmonth',
			},
		},
		function (error, response, body) {
			if (error) {
				console.log(error);
			} else {
				res.status(200).json(body);
			}
		}
	);
});

app.get('/reverse', access, (req, res) => {
	const url = 'https://sandbox.safaricom.co.ke/mpesa/reversal/v1/request',
		auth = 'Bearer ' + req.access_token;

	request(
		{
			method: 'POST',
			url: url,
			headers: {
				Authorization: auth,
			},
			json: {
				Initiator: 'apitest342',
				SecurityCredential: '',
				CommandID: 'TransactionReversal',
				TransactionID: 'NLJ11HAY8V',
				Amount: '100',
				ReceiverParty: '601342',
				RecieverIdentifierType: '11',
				ResultURL: 'http://YOUR_IP:80/reverse_result_url',
				QueueTimeOutURL: 'http://YOUR_IP:80/reverse_timeout_url',
				Remarks: 'Wrong Num',
				Occasion: 'sent wrongly',
			},
		},
		function (error, response, body) {
			if (error) {
				console.log(error);
			} else {
				res.status(200).json(body);
			}
		}
	);
});

app.post('/reverse_result_url', (req, res) => {
	console.log('--------------------Reverse Result -----------------');
	console.log(JSON.stringify(req.body.Result.ResultParameters));
});

app.post('/reverse_timeout_url', (req, res) => {
	console.log('-------------------- Reverse Timeout -----------------');
	console.log(req.body);
});

app.post('/b2c_result_url', (req, res) => {
	console.log('-------------------- B2C Result -----------------');
	console.log(JSON.stringify(req.body.Result));
});

app.post('/b2c_timeout_url', (req, res) => {
	console.log('-------------------- B2C Timeout -----------------');
	console.log(req.body);
});

app.post('/stk_callback', (req, res) => {
	console.log('.......... STK Callback ..................');
	console.log(JSON.stringify(req.body.Body.stkCallback));
	// console.log(JSON.stringify(req.body));
	console.log('.......... STK Callback ..................');
});

app.post('/bal_result', (req, resp) => {
	console.log('.......... Account Balance ..................');
	console.log(req.body);
});

app.post('/bal_timeout', (req, resp) => {
	console.log('.......... Timeout..................');
	console.log(req.body);
});

function access_token(req, res, next) {
	// access token
	const consumerKey = '';
	const consumerSecret = '';

	let url =
		'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';
	let auth = new Buffer.from(consumerKey + ':' + consumerSecret).toString('base64');

	request(
		{
			url: url,
			headers: {
				Authorization: 'Basic ' + auth,
			},
		},
		(error, response, body) => {
			if (error) {
				console.log(error);
			} else {
				// let resp =
				req.access_token = JSON.parse(body).access_token;
				next();
			}
		}
	);
}

///////////////****************GET ACESS TOKEN *************/////////////////////

let port = process.env.PORT || 80;

app.listen(port, (err, live) => {
	if (err) {
		console.error(err);
	}
	console.log('Server running on port 80');
});
