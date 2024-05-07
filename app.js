const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose  = require('mongoose');
const indexRouter = require('./routes/v1');
const index_v2Router = require('./routes/v2/index');
const loginRouter = require('./routes/v1/login');
const assignmentRouter = require('./routes/v1/assignment');
const statsRouter = require('./routes/v1/stats');
const app = express();
const cors = require('cors');
const limiter = require("./middleware/rate-limiter");
const dotenvConfigOutput = require('./config/dot_env_config');
mongoose.connect(dotenvConfigOutput.parsed["MONGO_URI"] ?? 'mongodb://localhost:27017/edu-go-sandbox');
mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB');
});
mongoose.connection.on('error', (err) => {
    console.log('Error connecting to MongoDB', err);
    mongoose.connect(dotenvConfigOutput.parsed["MONGO_URI"] ?? 'mongodb://localhost:27017/edu-go-sandbox');
});

app.use(cors({credentials: true, origin: true}));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(limiter);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(dotenvConfigOutput.parsed["ROUTE_PREFIX_2"], index_v2Router);
app.use(dotenvConfigOutput.parsed["ROUTE_PREFIX_1"]+'/', indexRouter);
app.use(dotenvConfigOutput.parsed["ROUTE_PREFIX_1"]+'/login', loginRouter);
app.use(dotenvConfigOutput.parsed["ROUTE_PREFIX_1"]+'/assignment', assignmentRouter);
app.use(dotenvConfigOutput.parsed["ROUTE_PREFIX_1"]+'/stats', statsRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(401);
  res.send("Unauthorized");
});

module.exports = app;
