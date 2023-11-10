import express from 'express';

import cors from 'cors';
import usuarioRouter from './routes/usuario_routes';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

app.get('/', (_req, res) => {
  res.send('Hello World!');
});


app.use('/', usuarioRouter);

app.listen(port, () => {
  console.log(`Servidor en ejecución en http://localhost:${port} `);
});

