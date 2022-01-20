'use strict';

// 3rd Party Resources
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');


// Esoteric Resources
const errorHandler = require('./error-handlers/500.js');
const notFound = require('./error-handlers/404.js');

//Routes
const authRoutes = require('./routes/user.routes.js');
const v1Routes = require('./routes/v1.routes.js');
const v2Routes = require('./routes/v2.routes.js');


// Prepare the express app
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// App Level MW
app.use(cors());
app.use(morgan('dev'));



// Routes
app.use(authRoutes);
app.use('/api/v1', v1Routes);
app.use('/api/v2', v2Routes);

// Catchalls
app.use(notFound);
app.use(errorHandler);

module.exports = {
  server: app,
  start: port => {
    if (!port) { throw new Error('Missing Port'); }
    app.listen(port, () => console.log(`Listening on ${port}`));
  },
};
