
const DbRepository = require('./src/repositories/dbRepository');
const WhatsAppRepository = require('./src/repositories/whatsappRepository');


//initiatemysql
var mysql = require('mysql');
var config = require('./config/dbconnection');
var connection = mysql.createConnection(config);
connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
 
  console.log('connected as id ' + connection.threadId);
});
/*var config = require('./config/dbconnection');
const Sequelize = require('sequelize');
var sequelize = new Sequelize(config.database, config.user, config.password, {host : config.host, dialect: 'mysql'})
*/
const wa = require('@open-wa/wa-automate');
const Handler = require('./src/handler/mainHandler');
var handler = undefined;
const whatsappConfig = require('./config/whatsapp');
wa.create().then(client => {
  var dbRepository = new DbRepository(connection);
  var reqDonorWaGroup = new WhatsAppRepository(client, whatsappConfig.requestDonorGroup);
  handler = new Handler(client, dbRepository, reqDonorWaGroup);
  start(client);
});



function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function start(client) {
  client.onMessage(async message => {
    console.log(`${message.from}, ${message.isGroupMsg}, ${message.body}`);
    console.log(message);
    var validSender = [
      '6592462592@c.us',
      '6282277300020@c.us'
    ];
    if (!message.isGroupMsg && validSender.indexOf(message.sender.id) != -1){
      await handler.handle(message);
    }
    //
    //await client.sendText(message.from, words[getRandomInt(words.length)]);
    /*for(var i=0;i<100;i++){
      await client.sendText(message.from, "wkwkwkwkwk");
    }*/
  });
}


const words = [
  "Aku bahagia memilih berjalan denganmu. Aku rela untuk berjalan jauh asalkan selalu memegang tanganmu.",
  "Apa bedanya cincin sama kamu? Kalau cincin melekat di jari, kalau kamu melekat di hati aku.",
  "Aku rela ikut lomba lari keliling dunia, asalkan engkau yang menjadi garis finishnya.",
  "Mungkin aku kiper terburuk sedunia, membiarkan kamu membobol gawang berkali-kali dengan cintamu.",
  "Kata orang nyasar itu rugi banget, tapi aku nggak ngerasa rugi karena cintaku sudah nyasar ke hati bidadari.",
  "Jika kamu berdiri di depan cermin memegang 11 mawar, kamu akan melihat 12 bunga tercantik yang pernah ada.",
  "Sejak mengenalmu, bawaannya aku pengen belajar terus. Belajar menjadi yang terbaik buat kamu.",
  "Aku sukanya sih apel dibandingkan anggur, makanya aku suka ngapelin kamu ketimbang nganggurin kamu.",
  "Aku mau cinta kita seperti pelajaran sejarah yang selalu dikenang sampai akhir hayat.",
  "Hari Minggu itu weekend, tapi kalau cinta aku ke kamu tuh will never end.",
  "Kamu adalah orang pertama yang mampu membuat jantungku berdetak lebih lambat dan lebih cepat pada saat yang sama.",
  "Kamu memang seperti lempeng bumi, bergeser sedikit saja sudah mengguncang hatiku.",
  "Cinta aku ke kamu itu seperti kecoa, tidak akan punah dimakan oleh waktu.",
  "Kamu adalah terang yang akan selalu menyinari hatiku. Tanpamu hidupku kosong dan tidak ada apa-apanya.",
  "Kalau disuruh melupakanmu, aku akan ke kelurahan dulu. Minta surat keterangan tidak mampu.",
  "Orang kurus itu setia, makan aja tidak pernah tambah apalagi pasangan.",
  "Abjad dimulai dengan ABC, angka dimulai dengan 123. Lagu dimulai dengan do re mi. Cinta dimulai dengan aku dan kamu.",
  "Cintaku tulus seputih melati, masih engkau meragukannya? Jika ya, haruskah kurendam hatiku dengan So Klin Pemutih?",
  "Selain ada garuda di dadaku, di dadaku juga selalu ada kamu.",
  "Cinta itu ibarat lingkaran yang tidak ada titik lainnya. Aku harap, kita tetap menjadi lingkaran sampai maut yang memisahkan.",
  "Aku tanpa kamu tuh bagaikan motor tanpa roda.",
  "Setiap melihat senyumanmu aku dapat merasakan hangatnya matahari. Setiap melihatmu tertawa aku seperti melihat indahnya bintang.  ",
  "Kamu tau gak apa persamaannya kamu sama AC? Sama-sama bikin aku sejuk.",
  "Aku mohon jangan jalan-jalan terus di pikiranku, duduk yang manis di hatiku saja.",
  "Gimana aku bisa tidur kalau jam segini kamu masih nongkrong di pikiranku.",
  "Napas aku kok sesek banget ya?, karena separuh nafasku ada di kamu.",
  "Jika kamu tanya berapa kali kamu datang ke pikiranku, jujur saja, cuma sekali. Habisnya, nggak pergi-pergi sih!"
];