const express = require(`express`)
const app = express()
/**allow to read a request from b
 * ody 
 * with json format
 */
app.use(express.json())
/**load controller of user */
const userController = require(`../controllers/user.controller`)
const {authorization}  = require(`../controllers/auth.controller`)
/**create route for get all user */
app.get(`/user`,authorization(["admin","kasir"]) , userController.getUser)
app.post(`/user/find`,authorization(["admin","kasir",]) , userController.findUser)
app.post(`/user`,authorization(["admin","kasir",]) , userController.addUser)
app.put(`/user/:id_user`,authorization(["admin","kasir",]) , userController.updateUser)
app.delete(`/user/:id_user`, authorization(["admin","kasir",]) ,userController.deleteUser)

module.exports= app