import express from 'express';

import cors from 'cors';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json()); //middleware que transforma req.body a json
app.use(cors());


app.listen(port, () => {
  console.log(`Servidor en ejecución en http://localhost:${port}`);
});