import { hubConnection } from 'signalr-no-jquery';

export var connection = hubConnection('http://localhost:3001'), playHubProxy = connection.createHubProxy('playHub');

function startConnection(params){
    connection.start().done(function(){
        playHubProxy.invoke('connect', params);
        console.log(params);
    });
}

export default startConnection