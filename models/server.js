const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');

class Server {
    constructor() {
        this.port = process.env.PORT;
        this.app = express();
        this.paths = {
            userPath: '/api/users',
            authPath: '/api/auth',
            categoriesPath: '/api/categories',
            productsPath: '/api/products',
            searchPath:'/api/search'
        }
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
        this.app.use(this.paths.userPath, require('../routes/user'));
        this.app.use(this.paths.authPath, require('../routes/auth'));
        this.app.use(this.paths.categoriesPath, require('../routes/categories'));
        this.app.use(this.paths.productsPath, require('../routes/products'));
        this.app.use(this.paths.searchPath, require('../routes/search'));
    }
    listen() {
        this.app.listen(this.port, () => {
            console.log('Listen at http://localhost:' + this.port);
        })
    }
}
module.exports = Server;