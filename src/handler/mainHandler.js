const Cache = require('../cache/cache');
const SessionData = require('../model/sessiondata');
const User = require('../model/user');

const NewMessageHandler = require('./newMessageHandler');
const RegisterDonorHandler = require('./registerDonorHandler');
const RequestDonorHandler = require('./requestDonorHandler');

class MainHandler {
    constructor(client, dbRepository, reqDonorWaRepository){
        this.sessionCache = new Cache();
        var registerDonorHandler = new RegisterDonorHandler(client);
        var requestDonorHandler = new RequestDonorHandler(client, dbRepository, reqDonorWaRepository);
        var newMessageHandler = new NewMessageHandler(client, requestDonorHandler);
        this.handlers = {
            0 : newMessageHandler,
            1 : requestDonorHandler,
            2 : registerDonorHandler
        };
        this.client = client;
    };
    async handle(message) {
        
        if (message.from == undefined)
            return;
        var sessionData = this.sessionCache.get(message.from);
        if ( sessionData == undefined)
        {
            var newSessionData = new SessionData(new User(message.from, message.sender.pushname), 0, 0);
            this.sessionCache.set(message.from, newSessionData, 3600);
            sessionData = newSessionData;
        }
        await this.handlers[sessionData.step].handle(sessionData, message);
        
        if (sessionData.step == -1)
            this.sessionCache.del(message.from);
        else
            this.sessionCache.set(message.from, sessionData, 3600);
    }
}


module.exports = MainHandler;