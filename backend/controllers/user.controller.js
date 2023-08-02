/**load  model of user */
const userModel = require(`../models/index`).user
/**joi */
const joi = require(`joi`)
/**load op from squelize library */
const { Op } = require("sequelize")
/**loasd md5 libabry */
const md5 = require(`md5`)
/**create validation fungction */
let validateUser = async (input) => {
    let rules = joi.object().keys({
        nama_user: joi.string().required(),
        role: joi.string()
            .validate(`kasir`, `admin`, `manager`),
        username: joi.string().required(),
        password: joi.string().min(3)
    })
    /**process validate */
    let { error } = rules.validate(input)
    /**check error validate */
    if (error) {
        let message = error
            .details
            .map(item => item.message)
            .join(",")
        return {
            status: false,
            message: message
        }
    }
    return {
        status: true
    }

}
/**create and export func to get all user */
exports.getUser = async (request, response) => {
    try {
        /**get all user using model */
        let result = await userModel.findAll()
        return response.json({
            status: true,
            data: result
        })
    } catch (error) {
        return response.json({
            status: false,
            message: error.message
        })
    }
}

/**create and e */
exports.findUser = async (request, response) => {
    try {
        /**get keyword search */
        let keyword = request.body.keyword
        /**get user based on keyword using model */
        let result = await userModel.findAll({
            where: {
                [Op.or]: {
                    nama_user: { [Op.substring]: keyword },
                    role: { [Op.substring]: keyword },
                    username: { [Op.substring]: keyword },
                }
            }
        })
        /**give a response  */
        return response.json({
            status: true,
            data: result
        })
    } catch (error) {
        return response.json({
            status: true,
            message: error.message
        })
    }
}
/**create and export funcction to add user */
exports.addUser = async (request, response) => {
    try {
        let resultValidation = validateUser(request.body)
        if (response.status === false) {
            return response.json({
                status: false,
                message: resultValidation.message
            })
        }
        /**convert a password to md5 */
        request.body.password = md5(
            request.body.password
        )
        /**execute insert user using model */
        await userModel.create(request.body)
        /**give response */
        return response.json({
            status: true,
            message: `data user berhasil ditambahkan`
        })
    } catch (error) {
        return response.json({
            status: false,
            message: error.message
        })
    }
}
/**create and export func to update user */
exports.updateUser = async (request, response)=>{
    try {
        /**get id userthat will be update */
        let id_user = request.params.id_user
        /**validate request body */
        let resultValidation = validateUser(request.body)
        if(resultValidation.status === false){
            return response.json({
                status: false,
                message: (await resultValidation).message
            })
        }
        /**cover pw to md 5 if it exist */
        if (request.body.password){
            request.body.password= md5(
                request.body.password
            )
        }
        /**execute update user using model */
        await userModel.update(
            request.body,
            {where :{id_user:id_user}}
        )
        /**give a response */
        return response.json({
            status: true,
            message: `data user berhasil diubah`
        })
    } catch (error) {
        return response.json({
            status: false,
            message: error.message
        })
    }
}
/**create and export */
exports.deleteUser = async(request, response)=>{
    try {
        /**get id user that will be delete */
        let id_user= request.params.id_user
        /**execute delete user model */
        await userModel.destroy({
            where:{id_user:id_user}
        })
        /**give reonse */
        return response.json({
            status: true,
            message: `data user telaah dihapus`
        })
    } catch (error) {
        return response.json({
            status: false,
            message: error.message
        })
    }
}