const express = require(`express`)
const app =express()
/**load controller menu */
const menuController =require ('../controllers/menu.controller')
const {authorization}  = require(`../controllers/auth.controller`)
/**route to add menu */
app.post(`/menu`,authorization(["admin"]) , menuController.addMenu)
/**create rote  for get all menu */
app.get(`/menu`, authorization(["admin","kasir","manajer"]) ,menuController.getMenu)
/**create rote  for seratch menu */
app.post(`/menu/find`,authorization(["admin"]) , menuController.findMenu)
/**create route to update */
app.put(`/menu/:id_menu`,authorization(["admin"]) , menuController.updateMenu)
/**create rote  for delete menu */
app.delete(`/menu/:id_menu`,authorization(["admin",]) , menuController.deleteMenu)
module.exports = app