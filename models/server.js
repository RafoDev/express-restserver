const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');

class Server {
    constructor() {
        this.port = process.env.PORT;
        this.app = express();
        this.userPath = '/api/users';
        this.authPath = '/api/auth';
        // db connection
        this.DBconnection();
        // Middlewares
        this.middlewares();
        // Aplication routes 
        this.routes();
    }
    async DBconnection() {
        await dbConnection();
    }
    middlewares() {
        this.app.use(cors());
        this.app.use(express.static('public'));
        // parse body content to json
        this.app.use(express.json());
    }
    routes() {
        this.app.use(this.userPath, require('../routes/user'));
        this.app.use(this.authPath, require('../routes/auth'));
    }
    listen() {
        this.app.listen(this.port, () => {
            console.log('Listen at http://localhost:' + this.port);
        })
    }
}
module.exports = Server;