import {check, validationResult} from 'express-validator'
import bcrypt from 'bcrypt'
import Usuario from "../models/Usuario.js"
import { generarId } from '../helpers/tokens.js'
import {emailRegistro,emailOlvidePassword} from '../helpers/emails.js'


const  formularioLogin  = (req,res)=>{
    res.render('auth/login',{
        pagina: "Iniciar Sesion"
    })
}

const  formularioRegistro  = (req,res)=>{
    
    res.render('auth/registro',{
        pagina: "Crear Cuenta",
        csrfToken: req.csrfToken()
    })
}

const  registrar = async(req,res)=>{
    //validacion
    await check('nombre').notEmpty().withMessage('El nombre es obligatorio').run(req)
    await check('email').isEmail().withMessage('Eso no es un email').run(req)
    await check('password').isLength({ min:6 }).withMessage('El Password debe ser de al menos 6 caracteres').run(req)
    await check('repetir_password').equals(req.body.password).withMessage('Los Password no son iguales').run(req)

    let resultado = validationResult(req)
    
    //verificar que el resultado este vacio
    if(!resultado.isEmpty()){
        //Errores
      return res.render('auth/registro',{
            pagina: "Crear Cuenta",
            csrfToken: req.csrfToken(),
            errores: resultado.array(),
            usuario:{
                nombre: req.body.nombre,
                email:req.body.email
            }
        })
    }


    //Extraer los datos
    const {nombre, email,password} = req.body

    //verificar que el usuario no este duplicado
    const existeUsuario = await Usuario.findOne({where: {email}})

    if(existeUsuario){
        return res.render('auth/registro',{
            pagina: "Crear Cuenta",
            csrfToken: req.csrfToken(),
            errores: [{msg: 'El usuario ya esta registrado'}],
            usuario:{
                nombre: req.body.nombre,
                email:req.body.email
            }
        })
    }

    //Alamacenar un usuario
    const usuario = await Usuario.create({
        nombre,
        email,
        password,
        token: generarId()
    })

    //envia email de confirmacion
    emailRegistro({
        nombre: usuario.nombre,
        email: usuario.email,
        token: usuario.token
    })


    //Mostrar msj de confirmacion
    res.render('templates/mensaje',{
        pagina:'Cuenta Creada Correctamente',
        mensaje: 'Hemos enviado un email de confirmacion, presiona en el enlace'
    })

}




/* Funciona que comprueba una cuenta */
const confirmar= async (req,res)=> {
    const {token}= req.params

    

    //verificar si el token es valido
        const usuario =  await Usuario.findOne({where: {token}})

        if(!usuario){
            return res.render('auth/confirmar-cuenta',{
                pagina:'Error al confirmar tu cuenta',
                mensaje: 'Hubo un error al confirmar tu cuenta intenta de nuevo',
                error: true
            })
        }


    //confirmar cuenta
    usuario.token = null;
    usuario.confirmado=true;

    await usuario.save();

    res.render('auth/confirmar-cuenta',{
        pagina:'Cuenta Confirmada',
        mensaje: 'La cuenta se confirmo correctamente',
       
    })



    


    
}

const  formularioOlvidePassword = (req,res)=>{
    res.render('auth/olvide-password',{
        pagina: "Recupera tu acceso a Bienes Raices",
        csrfToken: req.csrfToken(),
    })
}


const resetPassword = async (req,res)=>{
       //validacion
       await check('email').isEmail().withMessage('Eso no es un email').run(req)
      
   
       let resultado = validationResult(req)
       
       //verificar que el resultado este vacio
       if(!resultado.isEmpty()){
           //Errores
         return res.render('auth/olvide-password',{
            pagina: "Recupera tu acceso a Bienes Raices",
            csrfToken: req.csrfToken(),
            errores : resultado.array()
             
           })
       }


       //buscar el usuario
       const {email} = req.body
       const usuario = await Usuario.findOne({where : {email}})

       if(!usuario){
        return res.render('auth/olvide-password',{
            pagina: "Recupera tu acceso a Bienes Raices",
            csrfToken: req.csrfToken(),
            errores : [{msg: 'El email no pertenece a ningun usuario'}]
             
           })
       }

       /* Generar un token y enviar el mail  */
        usuario.token= generarId();
        await usuario.save()

        /* enviar mail */
        emailOlvidePassword({
            email:usuario.email,
            nombre: usuario.nombre,
            token: usuario.token
        })


        /* Renderizar Usuario */
        res.render('templates/mensaje',{
            pagina:'Restablece tu password',
            mensaje: 'Hemos enviado un email con las instruciones, presiona en el enlace'
        })

}

const comprobarToken = async (req, res) => {
   const { token} = req.params

   const usuario =  await Usuario.findOne({where: {token}})

   if(!usuario){
    return res.render('auth/confirmar-cuenta',{
        pagina:'Reestable tu password',
        mensaje: 'Hubo un error al validar tu informacion , intenta de nuevo ',
        error: true
    })
}

    //Mostrar formulario para modificar el pass
    res.render('auth/reset-password', {
        pagina:'Reestablece tu password',
        csrfToken: req.csrfToken(),


    })

   
}


const nuevoPassword = async (req, res) => {
    //validar password
    await check('password').isLength({ min:6 }).withMessage('El Password debe ser de al menos 6 caracteres').run(req)

    let resultado = validationResult(req)
    
    //verificar que el resultado este vacio
    if(!resultado.isEmpty()){
        //Errores
      return res.render('auth/reset-password',{
            pagina: "Reestablece tu password",
            csrfToken: req.csrfToken(),
            errores: resultado.array(),
           
        })
    }




    const {token} = req.params
    const {password} = req.body

        //identificar quien hace el cambio
        const usuario =  await Usuario.findOne({where: {token}})

        //hashear password
        const salt = await bcrypt.genSalt(10)
        usuario.password=await bcrypt.hash(password, salt)
        usuario.token= null

    await usuario.save()

    res.render('auth/confirmar-cuenta',{
        pagina: 'Password reestablecido ',
        mensaje: 'El password se guardo correctamente'
    })

}








export {
    formularioLogin,
    formularioRegistro,
    registrar,
    confirmar,
    formularioOlvidePassword,
    resetPassword,
    comprobarToken,
    nuevoPassword
}