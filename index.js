import express from 'express'

import usuarioRoutes from './routes/usuarioRoutes.js'

//crear la app

const app = express()

//habilitar pug
app.set('view engine', 'pug')
app.set('views', './views')

//carpeta publica
app.use(express.static('public'))



//Routing
app.use('/auth',usuarioRoutes )





//definir el puerto y arrancar el proyecto
const port = 3001;

app.listen(port, ()=> {
    console.log(`El servidor esta funcionando en el puerto ${port} `);
})



