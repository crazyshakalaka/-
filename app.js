const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());

app.use('/api/v1',require('./routers/express'));

app.listen(3001,()=>{
    console.log('http://localhost:3001');
})