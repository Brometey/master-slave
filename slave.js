const amqp = require('amqplib');
const os = require('node-os-utils');

(async function() {
    const connection  = await amqp.connect('amqp://user:password@localhost')
    const channel = await connection.createChannel();

    const cpuInfo = 'cpuInfo_queue';
    await channel.assertQueue(cpuInfo);

    setInterval(async ()=>{
        os.cpu.usage().then((info) => {
            console.log(info);
            channel.sendToQueue(cpuInfo,Buffer.from(info.toString()));
        })

    },1000)

})();
