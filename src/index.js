const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');

const app = express();
app.use(express.json());
const port = 3000;

mongoose.connect('mongodb://db:27017/mydatabase', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Erro de conexão com o MongoDB:'));
db.once('open', function () {
  console.log('Conectado ao MongoDB');
});

app.use('/api/v1', routes);

app.listen(port, () => {
  console.log(`App rodando na porta ${port}`);
});
