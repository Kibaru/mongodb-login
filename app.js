const express = require('express');

const app = express();

app.get('/', function(req, res){
  res.send('Hello Kibaru');
});

app.listen(3000, function(){
  console.log('Server started on port 3000...');
});