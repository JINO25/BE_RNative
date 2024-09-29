/* eslint-disable */
const express = require('express');
const morgan = require('morgan');
const userRouter = require('./routers/userRouter');
const reviewRouter = require('./routers/reviewRouter');
const hotelRouter = require('./routers/hotelRouter');
const viewRouter = require('./routers/viewRouter');
const cors = require('cors')

const app = express();
const ErrorHandler = require('./middlewares/errorHandle');

app.use(cors({
    origin: 'http://localhost:3000/*', // Change this to match your client's origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // If you need to send cookies or authentication headers
}));

app.use(morgan('dev'));
app.use(express.json());

app.use('/api/user', userRouter);
app.use('/api/hotel', hotelRouter);
app.use('/api/review', reviewRouter);
app.use('/BE_React', viewRouter);
app.use(ErrorHandler);

module.exports = app;