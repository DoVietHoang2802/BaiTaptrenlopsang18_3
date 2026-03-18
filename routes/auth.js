var express = require("express");
var router = express.Router();
let userController = require('../controllers/users')
let bcrypt = require('bcrypt')
let jwt = require('jsonwebtoken')
let fs = require('fs');
const { CheckLogin } = require("../utils/authHandler");
const { body, validationResult } = require('express-validator');

// Đọc private key cho RS256
const privateKey = fs.readFileSync(__dirname + '/../utils/keys/privateKey.pem', 'utf8');

router.post('/register', async function (req, res, next) {
    try {
        let { username, password, email } = req.body;
        let newUser = await userController.CreateAnUser(
            username, password, email, "69b0ddec842e41e8160132b8"
        )
        res.send(newUser)
    } catch (error) {
        res.status(404).send(error.message)
    }

})
router.post('/login', async function (req, res, next) {
    try {
        let { username, password } = req.body;
        let user = await userController.GetAnUserByUsername(username);
        if (!user) {
            res.status(404).send({
                message: "thong tin dang nhap sai"
            })
            return;
        }
        if (user.lockTime > Date.now()) {
            res.status(404).send({
                message: "ban dang bi ban"
            })
            return
        }
        if (bcrypt.compareSync(password, user.password)) {
            loginCount = 0;
            await user.save()
            // Sử dụng RS256 với private key
            let token = jwt.sign({
                id: user._id
            }, privateKey, {
                algorithm: 'RS256',
                expiresIn: '1h'
            })
            res.send(token)
        } else {
            user.loginCount++;
            if (user.loginCount == 3) {
                user.loginCount = 0;
                user.lockTime = Date.now() + 3600 * 1000
            }
            await user.save()
            res.status(404).send({
                message: "thong tin dang nhap sai"
            })
        }
    } catch (error) {
        res.status(404).send({
            message: error.message
        })
    }

})
router.get('/me',CheckLogin,function(req,res,next){
    res.send(req.user)
})

// Route đổi mật khẩu - yêu cầu đăng nhập
router.post('/changepassword', CheckLogin, [
    body('oldpassword').notEmpty().withMessage("Mật khẩu cũ không được để trống"),
    body('newpassword').notEmpty().withMessage("Mật khẩu mới không được để trống").bail()
        .isStrongPassword({
            minLength: 8,
            minLowercase: 1,
            minNumbers: 1,
            minSymbols: 1,
            minUppercase: 1
        }).withMessage("Mật khẩu mới phải có ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt")
], async function (req, res) {
    try {
        // Kiểm tra validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).send(errors.array());
            return;
        }

        let { oldpassword, newpassword } = req.body;
        let user = req.user; // Lấy từ middleware CheckLogin

        // Kiểm tra mật khẩu cũ
        if (!bcrypt.compareSync(oldpassword, user.password)) {
            res.status(400).send({
                message: "Mật khẩu cũ không đúng"
            });
            return;
        }

        // Mã hóa mật khẩu mới
        let salt = bcrypt.genSaltSync(10);
        let hashedPassword = bcrypt.hashSync(newpassword, salt);

        // Cập nhật mật khẩu
        user.password = hashedPassword;
        await user.save();

        res.send({
            message: "Đổi mật khẩu thành công"
        });
    } catch (error) {
        res.status(500).send({
            message: error.message
        });
    }
})



module.exports = router;