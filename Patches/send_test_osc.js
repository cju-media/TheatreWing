const { Client } = require('node-osc');
const client = new Client('127.0.0.01', 2224);
client.send('/scene/current', 1.5, () => {
    client.close();
    console.log("Sent OSC message to /scene/current with id 1.5");
});
