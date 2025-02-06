const express = require('express');
const server = express();

server.use(express.json());

const actionsRouter = require('./actions/actions-router.js');
const projectsRouter = require('./projects/projects-router.js');

server.use('/api/actions', actionsRouter);
server.use('/api/projects', projectsRouter);

module.exports = server;
