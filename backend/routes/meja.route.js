const express = require(`express`)
const app =express()
//call authorization
const {authorization}  = require(`../controllers/auth.controller`)

/**allow to read request with json type */
app.use(express.json())
/**load controller */
const mejaController= require(`../controllers/meja.controller`)
/**route to get all adat meja */
app.get(`/meja`,authorization(["admin",]) ,mejaController.getMeja)
/**rote to get availabele meja */
app.get(`/meja/available`,authorization(["admin","kasir","manajer"]) , mejaController.availableMeja)
/**route to add meja */
app.post(`/meja`, authorization(["admin",]) ,mejaController.addMeja)
/**route to update meja */
app.put(`/meja/:id_meja`,authorization(["admin","kasir"]) , mejaController.updateMeja)
/**route to delete meja */
app.delete(`/meja/:id_meja`,authorization(["admin",]) ,mejaController.deleteMeja)
/** export app object */
module.exports = app