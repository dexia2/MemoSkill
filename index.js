"use strict";
var Alexa = require('alexa-sdk');
var axios = require('axios');
var HELP_MESSAGE = 'つぶやきたい言葉をささやいてください';
var SUCCESS_MESSAGE = 'メモを保存しました';
var FAILED_MESSAGE = '保存に失敗しました';

var handlers = {
    'LaunchRequest': function () {
        this.emit('AMAZON.HelpIntent');
    },
    'AMAZON.HelpIntent': function () {
        this.emit(':tell', HELP_MESSAGE);
    },
    'MemoIntent': function () {
        var memo = this.event.request.intent.slots.Memo.value;
        if(!memo) {
            this.emit(':tell', FAILED_MESSAGE);
            return;
        }
        axios.get(
            'https://slack.com/api/chat.postMessage',
            { 
                params:{
                    token: process.env.BOT_TOKEN,
                    channel: process.env.CHANNEL,
                    text: memo
                }
            })
            .then(res => {
                this.emit(':tell', SUCCESS_MESSAGE);
                console.log(res);
            })
            .catch(err => {
                this.emit(':tell', FAILED_MESSAGE);
                console.log(err);
            });
    }
};

exports.handler = function (event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.appId = process.env.APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};