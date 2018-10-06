const functions = require('firebase-functions');

var Swagger = require('swagger-client');
var open = require('open');
var rp = require('request-promise');

// config items
var pollInterval = 1000;
var directLineSecret = 'XQDzMRPGIs8.cwA.ifw.NmE1zazCH0_4uKkygAxL_TkbRSpCeA1wHogj6mNtKpQ';
var directLineClientName = 'Will';
var directLineSpecUrl = 'https://docs.botframework.com/en-us/restapi/directline3/swagger.json';
var curConversationId = '';
var curBotResponse = '...';

var directLineClient = rp(directLineSpecUrl)
    .then(function (spec) {
        // client
        return new Swagger({
            spec: JSON.parse(spec.trim()),
            usePromise: true
        });
    })
    .then(function (client) {
        // add authorization header to client
        client.clientAuthorizations.add('AuthorizationBotConnector', new Swagger.ApiKeyAuthorization('Authorization', 'Bearer ' + directLineSecret, 'header'));
        return client;
    })
    .catch(function (err) {
        console.error('Error initializing DirectLine client', err);
    });

// once the client is ready, create a new conversation 
directLineClient.then(function (client) {
    client.Conversations.Conversations_StartConversation()                          // create conversation
        .then(function (response) {
        	console.log("Created new conversation ", response.obj.conversationId);
            return response.obj.conversationId;
        })                            // obtain id
        .then(function (conversationId) {
        	curConversationId = conversationId;
        });
});

// Read from console (stdin) and send input to conversation using DirectLine client
function sendMessageFromConsole(client, conversationId, message) {
	console.log("Sending message to conversation " + conversationId);
    // send message
    client.Conversations.Conversations_PostActivity(
        {
            conversationId: conversationId,
            activity: {
                textFormat: 'plain',
                text: message,
                type: 'message',
                from: {
                    id: directLineClientName,
                    name: directLineClientName
                }
            }
        }).catch(function (err) {
            console.error('Error sending message:', err);
        });
}

// Poll Messages from conversation using DirectLine client
function pollMessages(client, conversationId) {
    console.log('Starting polling message for conversationId: ' + conversationId);
    var watermark = null;
    setInterval(function () {
        client.Conversations.Conversations_GetActivities({ conversationId: conversationId, watermark: watermark })
            .then(function (response) {
                watermark = response.obj.watermark;                                 // use watermark so subsequent requests skip old messages 
                return response.obj.activities;
            })
            .then(printMessages);
    }, pollInterval);
}

// Helpers methods
function printMessages(activities) {
    if (activities && activities.length) {
        // ignore own messages
        activities = activities.filter(function (m) { return m.from.id !== directLineClientName });
		activities.forEach(printMessage);
    }
}

function printMessage(activity) {
    if (activity.text) {
        console.log("current response is ", activity.text);
        curBotResponse = activity.text;
    }
}

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.receivedQuery = functions.database.ref('/conversations/-L-EhR3Ps0OXpU6hvhYP/{id}').onCreate(event => {

	const messageId = event.params.id;
	const message = event.data.val().content;
	const time = Math.floor(Date.now() / 1000);

	console.log("Message ID is ", messageId);
	console.log("Message is ", message);

	if(messageId.indexOf("Bot Response") != -1) {
		return console.log("Bot already responded");
	}

	if(message.indexOf("status") != -1) {
		curBotResponse = "The Agate 9H well completion is proceeding normally. \n1. Treating Pressure is at 4.3 psi (+16.3%) \n2. Friction Reducer output is at 1.5 (+8.2%) \n3. Sand consumption is at 243 kg/min (-4.2%) \n4. Water consumption is at 3,304 gal/min (+7.5%) \n5. Slurry rate is at 0.107 bbl/min (-12.3%)"
	}
	else if(message.indexOf("far away") != -1) {
		curBotResponse = "The USFleet LM1022 hauler is 46 miles away. Would you like to call the driver?";
		time2 = time + 1;
		const response1 = {
			content : curBotResponse,
			fromID : "1vj712KhmheBF6sPdXY9wdOfKyj1",
			toID : "sNVP4BfozOZhmeXk9KVIhkpuGq52",
			isRead : false,
			type : "text",
			timestamp : time
		};
		const response2 = {
			content : "35.2552909944809:-97.5015119968978",
			fromID : "1vj712KhmheBF6sPdXY9wdOfKyj1",
			toID : "sNVP4BfozOZhmeXk9KVIhkpuGq52",
			isRead : false,
			type : "location",
			timestamp : time2
		};

		return event.data.ref.parent.child('Bot Response - '.concat(time.toString())).set(response1).then(function() {
			event.data.ref.parent.child('Bot Response - '.concat(time2.toString())).set(response2)
		});
	} else if(message.indexOf("Show me") != -1) {
		curBotResponse = "Here's Treating Pressure over the last hour:";
		time2 = time + 1;
		const response1 = {
			content : curBotResponse,
			fromID : "1vj712KhmheBF6sPdXY9wdOfKyj1",
			toID : "sNVP4BfozOZhmeXk9KVIhkpuGq52",
			isRead : false,
			type : "text",
			timestamp : time
		};
		const response2 = {
			content : "https://firebasestorage.googleapis.com/v0/b/rudy-881bb.appspot.com/o/messagePics%2Fgraph.png?alt=media&token=6f683f5a-cf53-4aa3-a852-7850f9bb2e36",
			fromID : "1vj712KhmheBF6sPdXY9wdOfKyj1",
			toID : "sNVP4BfozOZhmeXk9KVIhkpuGq52",
			isRead : false,
			type : "photo",
			timestamp : time2
		};
		return event.data.ref.parent.child('Bot Response - '.concat(time.toString())).set(response1).then(function() {
			event.data.ref.parent.child('Bot Response - '.concat(time2.toString())).set(response2)
		});
	} else if(message.indexOf("No thanks") != -1) {
		curBotResponse = "Ok";
	} else {
		curBotResponse = "I'm sorry. I couldn't understand your query.";
	}

	// once the client is ready, create a new conversation 
	directLineClient.then(function (client) {
    	sendMessageFromConsole(client, curConversationId, curBotResponse);
    });

    const response = {
		content : curBotResponse,
		fromID : "1vj712KhmheBF6sPdXY9wdOfKyj1",
		toID : "sNVP4BfozOZhmeXk9KVIhkpuGq52",
		isRead : false,
		type : "text",
		timestamp : time
	};

	return event.data.ref.parent.child('Bot Response - '.concat(time.toString())).set(response);
});

exports.receivedQuery2 = functions.database.ref('/conversations/-L-KIgfpDygBldHEKtZa/{id}').onCreate(event => {

	const messageId = event.params.id;
	const message = event.data.val().content;
	const time = Math.floor(Date.now() / 1000);

	console.log("Message ID is ", messageId);
	console.log("Message is ", message);

	if(messageId.indexOf("Bot Response") != -1) {
		return console.log("Bot already responded");
	}

	if(message.indexOf("Hi") != -1) {
		curBotResponse = "Good morning. I'm excited to help you complete Well Agate 9H today. You can ask me any questions about chemical and mechanical metrics, job costs, material supplies, and much more!"
	}
	else if(message.indexOf("status") != -1) {
		curBotResponse = "The Agate 9H well completion is proceeding normally. \n1. Treating Pressure is at 4.3 psi (+16.3%) \n2. Friction Reducer output is at 1.5 (+8.2%) \n3. Sand consumption is at 243 kg/min (-4.2%) \n4. Water consumption is at 3,304 gal/min (+7.5%) \n5. Slurry rate is at 0.107 bbl/min (-12.3%)"
	}
	else if(message.indexOf("far away") != -1) {
		curBotResponse = "The USFleet LM1022 hauler is 46 miles away. Would you like to call the driver?";
		time2 = time + 1;
		const response1 = {
			content : curBotResponse,
			fromID : "1vj712KhmheBF6sPdXY9wdOfKyj1",
			toID : "ySqfyMvNzoXw39b4bXcjy5xcqlj2",
			isRead : false,
			type : "text",
			timestamp : time
		};
		const response2 = {
			content : "35.2552909944809:-97.5015119968978",
			fromID : "1vj712KhmheBF6sPdXY9wdOfKyj1",
			toID : "ySqfyMvNzoXw39b4bXcjy5xcqlj2",
			isRead : false,
			type : "location",
			timestamp : time2
		};

		return event.data.ref.parent.child('Bot Response - '.concat(time.toString())).set(response1).then(function() {
			event.data.ref.parent.child('Bot Response - '.concat(time2.toString())).set(response2)
		});
	} else if(message.indexOf("Show me") != -1) {
		curBotResponse = "Here's Treating Pressure over the last hour:";
		time2 = time + 1;
		const response1 = {
			content : curBotResponse,
			fromID : "1vj712KhmheBF6sPdXY9wdOfKyj1",
			toID : "ySqfyMvNzoXw39b4bXcjy5xcqlj2",
			isRead : false,
			type : "text",
			timestamp : time
		};
		const response2 = {
			content : "https://firebasestorage.googleapis.com/v0/b/rudy-881bb.appspot.com/o/messagePics%2Fgraph.png?alt=media&token=6f683f5a-cf53-4aa3-a852-7850f9bb2e36",
			fromID : "1vj712KhmheBF6sPdXY9wdOfKyj1",
			toID : "ySqfyMvNzoXw39b4bXcjy5xcqlj2",
			isRead : false,
			type : "photo",
			timestamp : time2
		};
		return event.data.ref.parent.child('Bot Response - '.concat(time.toString())).set(response1).then(function() {
			event.data.ref.parent.child('Bot Response - '.concat(time2.toString())).set(response2)
		});
	} else if(message.indexOf("No thanks") != -1) {
		curBotResponse = "Ok";
	} else {
		curBotResponse = "I'm sorry. I couldn't understand your query.";
	}

	// once the client is ready, create a new conversation 
	directLineClient.then(function (client) {
    	sendMessageFromConsole(client, curConversationId, curBotResponse);
    });

    const response = {
		content : curBotResponse,
		fromID : "1vj712KhmheBF6sPdXY9wdOfKyj1",
		toID : "ySqfyMvNzoXw39b4bXcjy5xcqlj2",
		isRead : false,
		type : "text",
		timestamp : time
	};

	return event.data.ref.parent.child('Bot Response - '.concat(time.toString())).set(response);
});