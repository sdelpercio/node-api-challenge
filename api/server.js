const express = require('express');
const cors = require('cors');
const projectRouter = require('../projects/projects-router');
const actionRouter = require('../actions/actions-router');

const server = express();
server.use(logger);
server.use(cors());
server.use(express.json());

server.use('/api/projects', projectRouter);
server.use('/api/actions', actionRouter);

server.get('/', (req, res) => {
	res.status(200).send('API Sprint!!');
});

//custom middleware
function logger(req, res, next) {
	const method = req.method;
	const path = req.originalUrl;
	console.log(`Request logged: ${method} to ${path}`);
	next();
}

module.exports = server;
