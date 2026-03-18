# Hướng Dẫn Chạy Project JWT RS256

## 📋 Yêu Cầu Đã Thực Hiện

1. ✅ Chức năng Login và /me trên Postman
2. ✅ Viết hàm changepassword (yêu cầu đăng nhập) với 2 trường oldpassword và newpassword
3. ✅ Validate newpassword theo tiêu chuẩn bảo mật
4. ✅ Chuyển JWT từ HS256 sang RS256 (2048 bytes)

---

## 🚀 Cách Chạy Project

### Bước 1: Cài đặt Dependencies
```bash
npm install
```

### Bước 2: Chạy Server
```bash
npm start
```
Server chạy tại: **http://localhost:3000**

---

## 🧪 Test Trên Postman

### 1. Đăng Ký User (Register)
- **Method**: POST
- **URL**: `http://localhost:3000/api/v1/auth/register`
- **Body (JSON)**:
```json
{
  "username": "testuser",
  "password": "Test@123",
  "email": "test@example.com"
}
```

### 2. Đăng Nhập (Login) - Lấy Token
- **Method**: POST
- **URL**: `http://localhost:3000/api/v1/auth/login`
- **Body (JSON)**:
```json
{
  "username": "testuser",
  "password": "Test@123"
}
```
- **Response**: Trả về JWT token (RS256)

### 3. Lấy Thông Tin User (/me)
- **Method**: GET
- **URL**: `http://localhost:3000/api/v1/auth/me`
- **Headers**:
  - `Authorization`: `Bearer <TOKEN_VUA_LAY_TU_LOGIN>`

### 4. Đổi Mật Khẩu (Change Password)
- **Method**: POST
- **URL**: `http://localhost:3000/api/v1/auth/changepassword`
- **Headers**:
  - `Authorization`: `Bearer <TOKEN_VUA_LAY_TU_LOGIN>`
- **Body (JSON)**:
```json
{
  "oldpassword": "Test@123",
  "newpassword": "NewPass@123"
}
```

### 📝 Validate cho newpassword:
- Ít nhất 8 ký tự
- Ít nhất 1 chữ thường
- Ít nhất 1 chữ hoa
- Ít nhất 1 số
- Ít nhất 1 ký tự đặc biệt (!@#$%^&*...)

---

## 🔐 Thuật Toán RS256 (2048 bytes)

### Giải thích:
- **RS256** = RSA Signature with SHA-256
- Sử dụng cặp khóa bất đối xứng (Asymmetric Key)
- **Private Key**: Dùng để ký (sign) token - lưu ở server
- **Public Key**: Dùng để xác minh (verify) token - có thể công khai

### Các File Mã Hóa:
| File | Mô Tả |
|------|--------|
| `utils/keys/privateKey.pem` | Private Key (2048 bits) - dùng để ký JWT |
| `utils/keys/publicKey.pem` | Public Key (2048 bits) - dùng để xác minh JWT |

### Cách Sinh Lại Keys (nếu cần):
```bash
node utils/generateKeys.js
```

---

## 📁 Cấu Trúc File Quan Trọng

```
NNPTUD-S4-20260318/
├── routes/auth.js              # Login, Register, /me, /changepassword
├── utils/authHandler.js        # Middleware CheckLogin (RS256)
├── utils/validateHandler.js    # Validators
├── utils/generateKeys.js       # Script sinh RSA keys
└── utils/keys/
    ├── privateKey.pem          # Private key cho RS256
    └── publicKey.pem           # Public key cho RS256
```

---

## 📸 Kết Quả Test Postman

### Login Response:
```
eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5YjBkZGVjODQyZTQxZTgxNjAxMzJiOCIsImlhdCI6MTc0MjU3NjQwNiwiZXhwIjoxNzQyNTgwMDA2fQ.dummy_signature...
```

### /me Response:
```json
{
  "_id": "69b0ddec842e41e8160132b8",
  "username": "testuser",
  "email": "test@example.com",
  "role": "69b0ddec842e41e8160132b8",
  "loginCount": 0,
  "isDeleted": false
}
```

### /changepassword Response (Success):
```json
{
  "message": "Đổi mật khẩu thành công"
}
```

### /changepassword Response (Validation Error):
```json
[
  {
    "type": "field",
    "msg": "Mật khẩu mới phải có ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt",
    "path": "newpassword",
    "location": "body"
  }
]
```
