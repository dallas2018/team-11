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