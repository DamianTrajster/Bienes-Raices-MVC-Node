import express from 'express'

//crear la app

const app = express()


//Routing
app.get('/', function(req,res){
    res.send('Hola mundo en express')
})

app.get('/nosotros', function(req,res){
    res.send('Informacion de Nosotros')
})


//definir el puerto y arrancar el proyecto
const port = 3001;

app.listen(port, ()=> {
    console.log(`El servidor esta funcionando en el puerto ${port} `);
})

