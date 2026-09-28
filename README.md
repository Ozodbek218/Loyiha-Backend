# Loyiha-Backend

CORELY zamonaviy elektronika va gadjetlar internet-do'koni (Marketplace) uchun ishlab chiqilgan to'liq funksional RESTful Backend API tizimi.

---

## 🚀 Texnologiyalar to'plami (Tech Stack)

- **Backend Runtime:** [Node.js](https://nodejs.org/) (v18+)
- **Web Framework:** [Express.js](https://expressjs.com/) (v4.21+)
- **Ma'lumotlar bazasi:** [PostgreSQL](https://www.postgresql.org/) (Relational Database)
- **ORM:** [Sequelize](https://sequelize.org/) (v6.37)
- **Autentifikatsiya:** JWT (JSON Web Tokens), `bcryptjs`
- **Hujjatlashtirish:** Swagger UI, `swagger-jsdoc`, `swagger-ui-express` (OpenAPI 3.0)
- **Fayl yuklash:** `multer`
- **Xavfsizlik & Utility:** `cors`, `dotenv`, `morgan`, `slugify`

---

## 📁 Loyiha Strukturasi

```text
backend/
├── config/             # Tizim va Swagger konfiguratsiyalari
│   ├── database.js     # PostgreSQL Sequelize ulanishi
│   └── swagger.js      # Swagger JSDoc sozlamalari
├── controllers/        # Biznes mantiq kontrollerlari
├── docs/               # Standalone Swagger serveri
├── middleware/         # Auth, Error handler, Upload middlewarelari
├── models/             # Sequelize ma'lumotlar modellari
├── routes/             # API yo'nalishlari va Swagger annotatsiyalari
├── seeds/              # Baza uchun dastlabki mahsulotlar va ma'lumotlar
├── uploads/            # Yuklangan rasmlar
├── .env.example        # Muhit o'zgaruvchilari namunasi
├── app.js              # Asosiy Express server kirish fayli
├── package.json        # Paketlar ro'yxati va skriptlar
└── README.md           # Hujjat
```

---

## 🛠 O'rnatish va Ishga Tushirish

### 1. Repozitoriyani yuklab olish va paketlarni o'rnatish:
```bash
git clone https://github.com/Ozodbek218/Loyiha-Backend.git
cd Loyiha-Backend
npm install
```

### 2. Muhit o'zgaruvchilarini sozlash (`.env`):
`.env.example` faylidan nusxa olib `.env` faylini yarating:
```bash
cp .env.example .env
```
O'zingizning PostgreSQL parolingiz va ma'lumotlaringizni kiriting:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

DB_HOST=localhost
DB_PORT=5432
DB_NAME=corely
DB_USER=postgres
DB_PASSWORD=your_postgres_password

JWT_SECRET=your_jwt_secret_key
SWAGGER_PORT=5050
```

### 3. Ma'lumotlar bazasini yaratish va to'ldirish (Seed):
PostgreSQL'da `corely` nomli bo'sh baza oching, so'ngra:
```bash
npm run seed
```

### 4. Serverni ishga tushirish:
```bash
# Asosiy API serverini ishga tushirish (Port 5000)
npm run dev
```

---

## 📖 Interaktiv Swagger API Hujjatlari

Loyihada har bir route va model uchun alohida OpenAPI 3.0 JSDoc annotatsiyalari yozilgan.

### Alohida Swagger serverini ishga tushirish:
```bash
npm run swagger
```

* 🌐 **Alohida Swagger porti:** [http://localhost:5050](http://localhost:5050)
* 🌐 **Asosiy serverdagi Swagger:** [http://localhost:5000/api-docs](http://localhost:5000/api-docs)
* 📄 **OpenAPI JSON Spec:** [http://localhost:5050/api-docs/swagger.json](http://localhost:5050/api-docs/swagger.json)

---

## 🔑 Asosiy API Yo'nalishlari (36 ta endpoint)

- **Auth (`/api/auth`):** Ro'yxatdan o'tish, kirish, profil yangilash, parolni tiklash
- **Users (`/api/users`):** Foydalanuvchilarni boshqarish (Admin)
- **Products (`/api/products`):** Mahsulotlar katalogi, qidiruv, filtrlar, baholar
- **Categories (`/api/categories`):** Kategoriyalar va bo'limlar
- **Cart (`/api/cart`):** Savatcha operatsiyalari
- **Orders (`/api/orders`):** Buyurtma berish, kuzatish va holatini yangilash
- **Favorites (`/api/favorites`):** Sevimli mahsulotlar (Wishlist)
- **Reviews (`/api/reviews`):** Mahsulot sharhlari va baholash
- **Notifications (`/api/notifications`):** Xabarnomalar
- **Settings (`/api/settings`):** Do'konning global sozlamalari
- **Analytics (`/api/admin/analytics`):** Sotuvlar va tahlillar (Admin)
- **Upload (`/api/upload`):** Rasm yuklash

---

## 👤 Muallif

- GitHub: [@Ozodbek218](https://github.com/Ozodbek218)
- Email: [nazarovjamshid522@gmail.com](mailto:nazarovjamshid522@gmail.com)
