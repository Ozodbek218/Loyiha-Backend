const path = require('path');
const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CORELY Marketplace API Documentation',
      version: '1.0.0',
      description: 'CORELY E-Commerce Platform API Documentation. Barcha endpointlar JSDoc Swagger bilan hujjatlashtirilgan.',
      contact: {
        name: 'Jamshid Nazarov',
        email: 'nazarovjamshid522@gmail.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'CORELY Asosiy Backend Serveri (Port 5000)'
      },
      {
        url: 'http://localhost:5050',
        description: 'CORELY Standalone Swagger Serveri (Port 5050)'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT tokenni kiriting: Bearer <token>'
        }
      }
    }
  },
  apis: [
    './backend/routes/*.js',
    './routes/*.js',
    path.join(__dirname, '../routes/*.js').replace(/\\/g, '/')
  ]
};

const swaggerSpec = swaggerJSDoc(options);

// Explicitly remove schemas if any were parsed
if (swaggerSpec.components) {
  delete swaggerSpec.components.schemas;
}

module.exports = swaggerSpec;
