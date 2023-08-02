const express = require(`express`)
const app = express()
/**allow to read a request from body 
 * with json format
 */
app.use(express.json())

/**load controller of user */
const transaksiController = require(`../controllers/transaksi.controller`)
const {authorization}=require(`../controllers/auth.controller`)
/**create route for get all user */
app.get(`/transaksi`,authorization(["manajer","kasir"]), transaksiController.getTransaksi)
app.post(`/transaksi`, authorization(["kasir"]),transaksiController.addTransaksi)
app.put(`/transaksi/:id_transaksi`,  authorization(["kasir"]),transaksiController.updateTransaksi)
app.delete(`/transaksi/:id_transaksi`, authorization(["kasir"]), transaksiController.deleteTransaksi)

module.exports= app