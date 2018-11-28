import React, {Component} from 'react'
import { hubConnection } from 'signalr-no-jquery';

var connection = hubConnection('http://localhost:3001');
var playHubProxy = connection.createHubProxy('playHub');

function startConnection(func, params){
    connection.start().done(function(){
        playHubProxy.invoke(func, params);
        console.log(params);
    });
}

export default startConnection
export var connection = hubConnection('http://localhost:3001'), playHubProxy = connection.createHubProxy('playHub');