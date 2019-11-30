const express = require('express');

var bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(express.json());

app.use('/api/v2',require('./routers/user-register'));
app.use('/api/v1',require('./routers/express'));

app.listen(3001,()=>{
    console.log('http://localhost:3001');
})