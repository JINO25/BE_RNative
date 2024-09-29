/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-require-imports */
const app = require('./app');
require('dotenv').config();
const mongoose = require('mongoose');

const port = process.env.PORT || 3000

const DB = process.env.DATABASE.replace('<db_password>', process.env.PASSWORD);


mongoose.connect(DB).then(() => console.log('DB connected successfully')).catch(e => console.log(e));

const server = app.listen(port, () => {
    console.log(`App running on port ${port}`);
});

process.on('unhandledRejection', err => {
    console.log(err.name, "\n", err.message);
    server.close(() => {
        process.exit(1);
    })
});
