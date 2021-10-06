class WhatsAppRepository{
    constructor(client, groupTarget){
        this.groupTarget = groupTarget;
        this.client = client;
    }
    async send(message){
        await this.client.sendText(this.groupTarget, message);
    }
}

module.exports = WhatsAppRepository;