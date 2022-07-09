import express from "express"
import {admin, crear, guardar} from '../controllers/propiedadController.js'

import {body, validationResult} from 'express-validator'


const router = express.Router()

router.get('/mis-propiedades',admin)
router.get('/propiedades/crear',crear)
router.post('/propiedades/crear',
    body('titulo').notEmpty().withMessage('El titulo del anuncio es Obligatorio'),
    body('descripcion')
        .notEmpty().withMessage('La descripcion del anuncio es Obligatorio')
        .isLength({max:200}).withMessage('La descripcion es muy larga, solo 200 caracteres'),
    body('categoria').isNumeric().withMessage('selecciona una categoria'),
    body('precio').isNumeric().withMessage('selecciona un rango de precio'),
    body('habitaciones').isNumeric().withMessage('selecciona la cantidad de habitaciones'),
    body('estacionamiento').isNumeric().withMessage('selecciona  los estacionamientos'),
    body('wc').isNumeric().withMessage('selecciona los wc'),
    body('lat').notEmpty().withMessage('Ubica la Propiedad en el mapa '),
    guardar
)


export default router