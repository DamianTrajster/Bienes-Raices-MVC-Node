import express from 'express'
import csrf from 'csurf'
import cookieParser from 'cookie-parser'
import usuarioRoutes from './routes/usuarioRoutes.js'
import propiedadesRoutes from './routes/propiedadesRoutes.js'
import db  from './config/db.js'

//crear la app
const app = express()


//habilitar lectura datos del form
app.use(express.urlencoded({extended:true}))


//habilitar cookie parser
app.use(cookieParser())

//Habilitar Csrf
app.use(csrf({cookie:true}))

//conexion a la Base de datos
try {
    await db.authenticate();
    db.sync()
    console.log('conexion correcta');

    
} catch (error) {
    console.log(error);
}




//habilitar pug
app.set('view engine', 'pug')
app.set('views', './views')

//carpeta publica
app.use(express.static('public'))



//Routing
app.use('/auth',usuarioRoutes )
app.use('/',propiedadesRoutes)





//definir el puerto y arrancar el proyecto
const port = process.env.PORT || 3001;

app.listen(port, ()=> {
    console.log(`El servidor esta funcionando en el puerto ${port} `);
})



