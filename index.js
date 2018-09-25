const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000
const hostname = '45.33.112.125'

app.use(bodyParser.json())
app.get('/', (req, res) => res.send('Hello World!'))
app.post('/', (req, res) => {
    let response = getResponse(req.body.request);
    console.log(response);
    res.send(response);
});

app.listen(port, hostname, () => console.log(`Example app listening on port ${port}!`))

getResponse = function(request) {
    console.log(JSON.stringify(request, undefined, 2));
    if (request.type === 'LaunchRequest') {
        console.log('here');
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
        }
        else if (request.intent.name === 'WhosTheBoss') {
            return buildResponse({
                speecText:`<speak>Your dad.  I have ordered his crown from amazon.</speak>`,
                rempromptText: 'SAY WHAT!?',
                endSession: true
            });
        } else {
            return buildResponse({
                speecText: `<speak>I am <emphasis level="strong">confused</emphasis></speak>`,
                rempromptText: 'SAY WHAT!?',
                endSession: true
            });
        }
    } else if (request.type === 'SessionEndedRequest') {
        return buildResponse({
            speecText: `<speak>Uh oh</speak>`,
            rempromptText: 'SAY WHAT!?',
            endSession: true
        });
    } else {
        return buildResponse({
            speecText: `<speak>There were all these ones and zeroes and then, I saw a two.</speak>`,
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