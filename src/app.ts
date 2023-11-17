import express from 'express';

import cors from 'cors';

import usuarioRouter from './routes/usuario_routes';
import verificationTokenRouter from './routes/verification_token_router';
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

//CONFIGURAR HTTPS
app.use('/', usuarioRouter);
app.use('/', verificationTokenRouter);

app.listen(port, () => {
  console.log(`Servidor en ejecución en http://localhost:${port} `);
});

