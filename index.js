const express = require('express');
const cors = require('cors');
//const routerApi = require('./routes');
const { checkApiKey } = require('./middlewares/auth.handler');
const path = require('path');

const { logErrors, ormErrorHandeler, errorHandler, boomErrorHandler } = require('./middlewares/error.handler');

process.on('uncaughtException', (err) => {
  console.error('ERROR CRÍTICO: Excepción no capturada en el proceso:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('ERROR CRÍTICO: Promesa rechazada no manejada:', reason);
});

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const whitelist = ['http://localhost:4200', 'https://myapp.co'];
const options = {
  origin: (origin, callback) => {
    if (whitelist.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('no permitido'));
    }
  }
}
app.use(cors(options));

//require('./utils/auth/')

app.get('/', (req, res) => {
  res.send('Hola mi server en express');
});

app.get('/nueva-ruta', checkApiKey, (req, res) => {
  res.send('Hola, soy una nueva ruta');
});

//routerApi(app);

app.use(logErrors);
app.use(ormErrorHandeler);
app.use(boomErrorHandler);
app.use(errorHandler);
app.use('/public', express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
  console.log('Mi port' +  port);
  console.log('¡Servidor debería estar escuchando!');
});
