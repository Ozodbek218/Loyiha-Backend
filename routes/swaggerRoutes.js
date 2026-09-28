const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('../docs/swaggerSpec');

const router = express.Router();

// Serve the raw JSON spec
router.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// Swagger UI options - completely hide Schemas/Models block
const swaggerUiOptions = {
  customCss: `
    .swagger-ui .topbar { display: none !important; }
    .swagger-ui .info { margin: 20px 0; }
    .swagger-ui section.models { display: none !important; }
    .swagger-ui .models { display: none !important; }
    .swagger-ui .wrapper:has(section.models) section.models { display: none !important; }
  `,
  customSiteTitle: 'CORELY API Docs | Swagger UI',
  swaggerOptions: {
    defaultModelsExpandDepth: -1,
    docExpansion: 'list',
    persistAuthorization: true,
    displayRequestDuration: true,
    filter: true
  }
};

// Mount Swagger UI using standalone spec without touching route files
router.use('/', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions));

module.exports = router;
