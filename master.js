require('dotenv').config();
const fastify = require('fastify')();
const amqp = require('amqplib');

const port = process.env.MASTER_PORT || 4000;

(async function() {
    const connection = await amqp.connect('amqp://user:password@localhost');
    const channel = await connection.createChannel();
    setInterval(() => {
        channel.assertQueue('cpuInfo_queue');

        channel.consume('cpuInfo_queue', async (msg) => {
            console.log(msg.content.toString())
            channel.ack(msg);
        })
    })

    fastify.listen({
        port: port
    }, (error) => {
        if (error) {
            fastify.log.error(err);
            process.exit(1);
        }
        console.log(`Server is listening on port ${port}`);
    })
})();