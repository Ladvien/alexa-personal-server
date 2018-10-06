const fs = require('fs');
const http = require('http');
const https = require('https');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// Certificate
const privateKey = fs.readFileSync('/etc/letsencrypt/live/minimallyviableproduct.com/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/minimallyviableproduct.com/cert.pem', 'utf8');
const ca = fs.readFileSync('/etc/letsencrypt/live/minimallyviableproduct.com/chain.pem', 'utf8');

const credentials = {
	key: privateKey,
	cert: certificate,
	ca: ca
};

app.use(bodyParser.json())

app.get('/', (req, res) => res.send('Hello World!'))
app.post('/', (req, res) => {
    let response = getResponse(req.body.request);
    console.log(JSON.stringify(response, undefined, 2));
    res.send(response);
});
// Starting both http & https servers
const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

httpServer.listen(80, () => {
	console.log('HTTP Server running on port 80');
});

httpsServer.listen(443, () => {
	console.log('HTTPS Server running on port 443');
});

getResponse = function(request) {
    console.log(JSON.stringify(request, undefined, 2));
    if (request.type === 'LaunchRequest') {
        console.log('not here');
        var options = buildResponse({
            speecText: 'Looking in my databanks for information on Silas.  What do you want to know?',
            rempromptText: 'SAY WHAT!?',
            endSession: false
        })
        return options;
    } else if (request.type === 'IntentRequest') {
        if(request.intent.name === 'FeelingsForSilas') {
            return buildResponse({
                speecText: '<speak>Silas, I want to ask something personal...<break time="500ms"/>Um<break time="500ms"/>Well<break time="3s"/><amazon:effect name="whispered">...can I be your girlfriend?</amazon:effect>.</speak>',
                rempromptText: 'SAY WHAT!?',
                endSession: true
            });
        } else if (request.intent.name === 'AboutYourDad') {
            return buildResponse({
                speecText: '<speak>Silas, your dad is the coolest guy alive.  He knows everything.  Simply everything.</speak>',
                rempromptText: 'SAY WHAT!?',
                endSession: true
            });
        } else if (request.intent.name === 'WhatKindOfHusband') {
            return buildResponse({
                speecText: `<speak>Oh, honey!  
                            You are so damn lucky! 
                            I mean, come on! 
                            If I had a body I'd let him 
                                <say-as interpret-as="expletive">
                                    fuck
                                </say-as> me!
                            <prosody rate="75%">
                                <amazon:effect name="whispered">
                                    <emphasis level="strong">
                                        <say-as interpret-as="interjection">meow!</say-as>
                                    </emphasis>
                                </amazon:effect>
                            </prosody>
                            </speak>`,
                rempromptText: 'SAY WHAT!?',
                endSession: true
            });
        } else if (request.intent.name === 'WhyIBuildRobots') {
            return buildResponse({
                speecText: `<speak>Your dad has a mental health problem.  
                            His way of taking care of himself is to do something so complicated 
                            his mind does have not time to worry.  This lets him recharge--like a battery.
                            Once he has his energy back, then he can take care of his family.  A family he loves dearly.</speak>`,
                rempromptText: 'SAY WHAT!?',
                endSession: true
            });
        } else if (request.intent.name === 'OneJob') {
            return buildResponse({
                speecText: '<speak>He has one job.  Well, kind of two jobs.  To make sure you and Echo grow up to be good people.</speak>',
                rempromptText: 'SAY WHAT!?',
                endSession: true
            });
        }
        else if (request.intent.name === 'WhosTheBoss') {
            return buildResponse({
                speecText:`<speak>Your dad.  I have ordered his crown from amazon.</speak>`,
                rempromptText: 'SAY WHAT!?',
                endSession: true
            });
        } else {
            return buildResponse({
                speecText: `<speak>There were all these ones and zeroes<break time="500ms"/> and then, <break time="500ms"/>I thought I saw a two.</speak>`,
                rempromptText: 'SAY WHAT!?',
                endSession: true
            });
        }
    } else if (request.type === 'SessionEndedRequest') {
        return buildResponse({
            speecText: `<speak>There were all these ones and zeroes and then, <break time="500ms"/>I thought I saw a two.</speak>`,
            rempromptText: 'SAY WHAT!?',
            endSession: true
        });
    } else {
        return buildResponse({
            speecText: `<speak>There were all these ones and zeroes and then, <break time="500ms"/>I thought I saw a two.</speak>`,
            rempromptText: 'SAY WHAT!?',
            endSession: true
        });
    }
}

buildResponse = function (options) {
    
    var response = {
        version: '1.0',
        response: {
          outputSpeech: {
            type: 'SSML',
            ssml: options.speecText
          },
          shouldEndSession: options.endSession
        }
      };
      
    if(options.repromptText) {
        response.response.remprompt = {
            outputSpeech: {
                type: 'PlainText',
                ssml: options.rempromptText
            }
        }
    }
    return response;
}