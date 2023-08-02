/**load library multer */
const multer = require(`multer`)
/**config of storage */
const configStorage = multer.diskStorage({
    destination: (request, file, callback) => {
        callback(null, `./menu_image`)
    },
    filename: (request, file, callback) => {
        callback(null, `image-${Date.now()}-${file.originalname}`)
    }
})
/**define function upload */
const upload = multer({
    storage: configStorage,
    /**file filter */
    fileFilter: (request, file, callback) => {
        const extension = [`image/jpg`, 'image/png','image/jpeg']
        /**chek the extension */
        if (!extension.includes(file.mimetype)) {
            /**refuse upload */
            callback(null, false)
            return callback(null, `invalid type of file`)
        }
        /**filter size limit */
        /**define max size */
        const maxSize = (1 * 1024 * 1024)
        const fileSize = request.headers['content-length']
        if (fileSize > maxSize) {
            callback(null, false)
            return callback(null, `size is over`)
        }
        callback(null, true)
    }
})
/**export function */
module.exports = upload