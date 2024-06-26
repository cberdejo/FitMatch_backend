import express from 'express';
//import fs from 'fs';
//import https = require('https');
import cors from 'cors';

import usuarioRouter from './routes/usuario_routes';
import trainer_postsRouter from './routes/plantilla_posts_routes';
import reviewRouter from './routes/review_routes';
import rutinaGuardadaRouter from './routes/rutinas_guardadas_routes';
import sesionEntrenamientoRouter from './routes/sesion_entrenamiento_routes';
import ejerciciosRouter from './routes/exercises_routes';
import registroRouter from './routes/registro_routes';
import medidasRouter from './routes/medidas_routes';
import notificacionRouter from './routes/notification_routes';
import logsRouter from './routes/log_routes';
const app = express();
const port = process.env.PORT || 3000;

//OBTENER CERTIFICADOS
//GENERAR CERTIFICADOS USANDO LET'S ENCRPYPT CUANDO ESTÉ EL BACK EN LA NUBE
// sudo certbot certonly --standalone -d tudominio.com -d www.tudominio.com

/*
let privateKey: string;
let certificate: string;
try {

  privateKey = fs.readFileSync('./certificados/private-key.pem', 'utf8');
  certificate = fs.readFileSync('./certificados/certificate.pem', 'utf8');
   
} catch (error) {
  console.error('Error al leer los archivos de certificados:', error);
  process.exit(1); // Terminar la aplicación en caso de error
}

const credentials = { key: privateKey, cert: certificate };
*/

//CONFIGURAR HTTPS
//const httpsServer = https.createServer(credentials, app);

//CONFIGURAR CORS
//const frontend_URL = process.env.FRONTEND_URL || 'https:localhost:4000/';
/* 

const corsOptions = {
  origin: frontend_URL,
  optionsSuccessStatus: 200, 
};

app.use(cors(corsOptions));*/
app.use(cors());
app.use(express.json());


app.use('/', usuarioRouter);
app.use('/', trainer_postsRouter);
app.use('/', reviewRouter);
app.use('/', rutinaGuardadaRouter);
app.use('/', sesionEntrenamientoRouter);
app.use('/', ejerciciosRouter);
app.use('/', registroRouter);
app.use('/', medidasRouter);
app.use('/', notificacionRouter);
app.use('/', logsRouter);

/*
httpsServer.listen(port, () => {
  console.log(`Servidor Https en ejecución en http://localhost:${port} `);
});
*/

app.listen(port, () => {
  console.log(`Servidor en ejecución en http://localhost:${port} `);
});
