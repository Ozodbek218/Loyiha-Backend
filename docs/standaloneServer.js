const express = require('express');
const cors = require('cors');
const path = require('path');
const swaggerRoutes = require('../routes/swaggerRoutes');

const app = express();
const PORT = process.env.SWAGGER_PORT || 5050;

app.use(cors());
app.use(express.json());

// Serve Swagger UI on root and /api-docs
app.use('/api-docs', swaggerRoutes);
app.use('/', swaggerRoutes);

app.listen(PORT, () => {
  console.log('========================================================');
  console.log(`🚀 [CORELY Dedicated Swagger UI] Running independently!`);
  console.log(`👉 Dedicated URL: http://localhost:${PORT}`);
  console.log(`👉 API Docs URL:  http://localhost:${PORT}/api-docs`);
  console.log(`👉 JSON Spec:     http://localhost:${PORT}/api-docs/swagger.json`);
  console.log('========================================================');
});
