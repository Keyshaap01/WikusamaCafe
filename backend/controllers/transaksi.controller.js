
const transaksiModel = require(`../models/index`).transaksi
const detailModel = require(`../models/index`).detail_transaksi
const menuModel = require(`../models/index`).menu
const userModel = require(`../models/index`).user
/**create and export func  */
exports.addTransaksi = async (request, response) => {
    try {
        /** prepare data to add in to transaksi  */
        let newTransaksi = {
            tgl_transaksi: request.body.tgl_transaksi,
            id_user: request.body.id_user,
            id_meja: request.body.id_meja,
            nama_pelanggan: request.body.nama_pelanggan,
            status: `belum_bayar`

        }
        let insertTransaksi =
            await transaksiModel.create(newTransaksi)
        //get the lates id of new transaksi
        let latesID = insertTransaksi.id_transaksi
        //insert last id in each detail
        let arrDetail = request.body.detail_transaksi
        /**assume that arrdetail is arry type */

        /**loap each arrdetail to insert id and harga */
        for (let i = 0; i < arrDetail.length; i++) {
            arrDetail[i].id_transaksi = latesID

            //get selected menu based on id 
            let selectedMenu = await menuModel.findOne(
                {
                    where: { id_menu: arrDetail[i].id_menu }
                }
            )
            //add harga in each of detail
            arrDetail[i].harga = selectedMenu?.harga

        }
        //execute insert detail transaksi using model, bulkcreta= create dlm jumlah bsr
        await detailModel.bulkCreate(arrDetail)
        //give a response
        return response.json({
            status: true,
            message: `data transaksi berhasil ditambahkan`
        })


    } catch (error) {
        return response.json({
            status: false,
            message: error.message
        })
    }
}
//create to edit transaksi
exports.updateTransaksi = async(request, response) => {
    try {
        // get id that will be update
        let id = request.params.id_transaksi

        // prepare data updated transaksi
        let dataTransaksi = {
            tgl_transaksi: request.body.tgl_transaksi,
            id_user: request.body.id_user,
            id_meja: request.body.id_meja,
            nama_pelanggan: request.body.nama_pelanggan,
            status: request.body.status
        }

        // execute update transaksi using model
        await transaksiModel.update(
            dataTransaksi,
            {where: {id_transaksi: id}}
        )

        // execute
        await detailModel.destroy({
            where: {id_transaksi: id}
        })

        let arrDetail = request.body.detail_transaksi
        // loop each arrdetail to insert last id
        for (let i = 0; i < arrDetail.length; i++) {
            arrDetail[i].id_transaksi = id
            // get selected menu based on id_menu
            let selectedMenu = await menuModel.findOne({where: {id_menu: arrDetail[i].id_menu}})
            arrDetail[i].harga = selectedMenu?.harga
        }

        // insert new detail using model
        await detailModel.bulkCreate(arrDetail)

        // give a response
        return response.json({
            status: true,
            message: `Data berhasil diubah`
        })
    } catch (error) {
        return response.json({
            status: false,
            message: error.message
        })
    }
} 
//create and export func to delete transaksi
exports.deleteTransaksi= async(request,response)=>{
    try {
      //get id trannsaksi
      let id_transaksi = request.params.id_transaksi
      //execute delete detail using modekl
      await detailModel.destroy({
        where:{id_transaksi:id_transaksi}
      })  
      //execute delete transaksi using model
      await transaksiModel.destroy({
        where:{id_transaksi:id_transaksi}
      })  
      //give a response
      return response.json({
        status: true,
        message: `dataa transaksi telah dihapus`
    })
    
    } catch (error) {
        return response.json({
            status: false,
            message: error.message
        })
        
    }
}
//create to getall transaksi
exports.getTransaksi = async(request,response)=>{
    try {
        // get all data using model
        let result = await transaksiModel.findAll({
            include: [
                "meja","user",{
                    model:detailModel,
                    as:"detail_transaksi",
                    include:["menu"]
                }
            ],
            order :[
                ['tgl_transaksi','DESC']
            ]
        })

        return response.json({
            status: true,
            data: result
        })
    } catch (error) {
         return response.json({
            status: false,
            message: error.message
        })
        
        //give a response
        return response.json({
            status: false,
            message: result
        })
    }
}
exports.findTransaksi= async(request,response)=>{
    try {
        let keyword = request.body.keyword
        let result = await transaksiModel.findAll({
            include:[
                "meja",
                {
                    model:userModel, as:"user", where:{
                        [Op.or]:{
                            nama_user:{[Op.substring]:keyword}
                        }
                    }
                },
                {model:detailModel, as:"detail_transaksi",include:["menu"]}
            ]
        })
        //response
        return response.json({
            status:true,
            data:result
        })
    } catch (error) {
        return response.json({
            status:false,
            data:error.message
        })
        
    }
}