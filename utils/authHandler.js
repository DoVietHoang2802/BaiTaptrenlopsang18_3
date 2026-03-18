let userController = require('../controllers/users')
let jwt = require('jsonwebtoken')
let fs = require('fs');

// Đọc public key cho RS256
const publicKey = fs.readFileSync(__dirname + '/keys/publicKey.pem', 'utf8');

module.exports = {
    CheckLogin: async function (req, res, next) {
        try {
            if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer")) {
                res.status(404).send({
                    message: "ban chua dang nhap"
                })
                return;
            }
            let token = req.headers.authorization.split(" ")[1];
            // Sử dụng RS256 với public key
            let result = jwt.verify(token, publicKey, {
                algorithms: ['RS256']
            })
            if (result.exp * 1000 < Date.now) {
                res.status(404).send({
                    message: "ban chua dang nhap"
                })
                return;
            }
            let user = await userController.GetAnUserById(result.id);
            if (!user) {
                res.status(404).send({
                    message: "ban chua dang nhap"
                })
                return;
            }
            req.user = user;
            next()
        } catch (error) {
            res.status(404).send({
                message: "ban chua dang nhap"
            })
        }

    }
}