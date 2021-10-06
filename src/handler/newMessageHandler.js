class NewMessageHandler {
    constructor(client, reqDonorHandler){
        this.client = client;
        this.reqDonorHandler = reqDonorHandler;
    }
    async handle(sessionData, message){
        if (sessionData.substep == 0){
            await this.client.sendText(message.from, 
                "Selamat Datang di pusat layanan Covid19. Silahkan membalas pesan ini untuk memilih menu. \n" +
                "Menu : \n" + 
                "1. Butuh Donor\n" +
                //"2. Daftar Sebagai Pendonor \n" + 
                "2. Keluar"
            );
            sessionData.substep = 1;
        } else if (sessionData.substep == 1){
            if (message.body.toLowerCase() == '1'){
                sessionData.step = 1;
                sessionData.substep = 0;
                await this.reqDonorHandler.handle(sessionData, message);
            }
            /*else if(message.body.toLowerCase() == '2'){
                sessionData.step = 2;
                sessionData.substep = 0;
            }*/
            else if (message.body.toLowerCase() == '2'){
                await this.client.sendText(message.from, "Terima kasih.")
                sessionData.step = -1;
            }
        }
    }
}

module.exports = NewMessageHandler;