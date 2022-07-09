import Propiedad from './Propiedad.js'
import Precio from './Precio.js'
import Categoria from './Categoria.js'
import Usuario from './Usuario.js'


/* Asociaciones */
/* Una propiedaad va a tener un precio */
Propiedad.belongsTo(Precio, {foreignKey: 'precioId'})

/* una propiedad va a tener una categoria */
Propiedad.belongsTo(Categoria, {foreignKey: 'categoriaId'})

/* una propuedad va a tener un usuario */
Propiedad.belongsTo(Usuario, {foreignKey: 'usuarioId'})











export {
    Propiedad,
    Precio,
    Categoria,
    Usuario
}

