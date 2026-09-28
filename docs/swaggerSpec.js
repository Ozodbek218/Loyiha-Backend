/**
 * OpenAPI 3.0.3 Specification for CORELY Electronics Marketplace
 * Comprehensive Model Schemas and API Endpoints
 */

const swaggerSpec = {
  openapi: '3.0.3',
  info: {
    title: 'CORELY Electronics Marketplace API',
    version: '1.0.0',
    description: `
### CORELY RESTful API Documentation & Data Models
Full documentation of all database models (Sequelize + PostgreSQL) and API routes for CORELY Marketplace.

- **Frontend Client:** [http://localhost:5173](http://localhost:5173)
- **Backend API Server:** [http://localhost:5000](http://localhost:5000)
- **Official Contact & Administrator:** [nazarovjamshid522@gmail.com](mailto:nazarovjamshid522@gmail.com)
    `,
    contact: {
      name: 'CORELY Engineering Team',
      email: 'nazarovjamshid522@gmail.com',
      url: 'http://localhost:5173'
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT'
    }
  },
  servers: [
    {
      url: 'http://localhost:5000',
      description: 'Localhost Development Backend Server'
    }
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter your JWT token obtained from `/api/auth/login` or `/api/auth/register`'
      }
    },
    schemas: {
      // 1. USER MODEL
      User: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          firstName: { type: 'string', example: 'Alexander' },
          lastName: { type: 'string', example: 'Vance' },
          email: { type: 'string', format: 'email', example: 'admin@corely.com' },
          phone: { type: 'string', example: '+998 90 123 45 67' },
          role: { type: 'string', enum: ['user', 'admin'], example: 'admin' },
          avatar: { type: 'string', example: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb' },
          isActive: { type: 'boolean', example: true },
          firebaseUid: { type: 'string', nullable: true, example: null },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      },

      // 2. PRODUCT MODEL
      Product: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          name: { type: 'string', example: 'Keychron X401K Wireless Mechanical Keyboard' },
          name_uz: { type: 'string', nullable: true, example: 'Keychron X401K Mexanik Klaviatura' },
          name_ru: { type: 'string', nullable: true, example: 'Беспроводная клавиатура Keychron X401K' },
          name_en: { type: 'string', nullable: true, example: 'Keychron X401K Wireless Mechanical Keyboard' },
          slug: { type: 'string', example: 'keychron-x401k-wireless-mechanical-keyboard' },
          sku: { type: 'string', example: 'KB-KCH-401K' },
          description: { type: 'string', example: 'Compact 75% hot-swappable wireless mechanical keyboard engineered for maximum tactile precision.' },
          description_uz: { type: 'string', nullable: true },
          description_ru: { type: 'string', nullable: true },
          description_en: { type: 'string', nullable: true },
          category_id: { type: 'integer', example: 2 },
          brand: { type: 'string', example: 'Keychron' },
          price: { type: 'number', format: 'float', example: 89.0 },
          comparePrice: { type: 'number', format: 'float', example: 119.0 },
          costPrice: { type: 'number', format: 'float', example: 50.0 },
          discount: { type: 'integer', example: 25 },
          stock: { type: 'integer', example: 45 },
          lowStockThreshold: { type: 'integer', example: 8 },
          images: {
            type: 'array',
            items: { type: 'string' },
            example: ['https://images.unsplash.com/photo-1587829741301-dc798b83add3']
          },
          mainImage: { type: 'string', example: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3' },
          colors: {
            type: 'array',
            items: { type: 'string' },
            example: ['Black', 'White', 'Orange']
          },
          rating: { type: 'number', format: 'float', example: 4.8 },
          reviewCount: { type: 'integer', example: 38 },
          specifications: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: { type: 'string', example: 'Connectivity' },
                value: { type: 'string', example: 'Bluetooth 5.2 / Type-C Wired / 2.4GHz' }
              }
            }
          },
          features: {
            type: 'array',
            items: { type: 'string' },
            example: ['QMK/VIA programmable firmware', 'South-facing RGB backlighting']
          },
          tags: {
            type: 'array',
            items: { type: 'string' },
            example: ['keychron', 'keyboard', 'gaming', 'wireless']
          },
          warranty: { type: 'string', example: '1 Year Manufacturer Warranty' },
          shippingInfo: {
            type: 'string',
            enum: ['Regular', 'Economic', 'Next Day', 'Instant'],
            example: 'Next Day'
          },
          shippingClass: { type: 'string', example: 'Express Standard' },
          deliveryTime: { type: 'string', example: '1-2 Days' },
          location: { type: 'string', example: 'Corely Flagship Warehouse' },
          isFeatured: { type: 'boolean', example: true },
          isOnSale: { type: 'boolean', example: true },
          isNewArrival: { type: 'boolean', example: true },
          isActive: { type: 'boolean', example: true },
          seoTitle: { type: 'string', example: 'Buy Keychron X401K in Tashkent' },
          metaDescription: { type: 'string', example: 'Best price on Keychron wireless mechanical keyboards' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      },

      // 3. CATEGORY MODEL
      Category: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          name: { type: 'string', example: 'Gaming' },
          name_uz: { type: 'string', example: "O'yinlar va Kiber Sport" },
          name_ru: { type: 'string', example: 'Гейминг и Киберспорт' },
          name_en: { type: 'string', example: 'Gaming' },
          slug: { type: 'string', example: 'gaming' },
          description: { type: 'string', example: 'Competitive gaming mice, mechanical keyboards, custom controllers.' },
          image: { type: 'string', example: 'https://images.unsplash.com/photo-1612287233207-6b45f1b6a22f' },
          featured: { type: 'boolean', example: true },
          productCount: { type: 'integer', example: 14 },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      },

      // 4. ORDER & ORDERITEM MODELS
      Order: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 101 },
          orderNumber: { type: 'string', example: 'COR-894721' },
          user_id: { type: 'integer', example: 2 },
          totalAmount: { type: 'number', format: 'float', example: 249.50 },
          subtotal: { type: 'number', format: 'float', example: 220.00 },
          shippingFee: { type: 'number', format: 'float', example: 5.00 },
          tax: { type: 'number', format: 'float', example: 24.50 },
          discountAmount: { type: 'number', format: 'float', example: 0.00 },
          status: {
            type: 'string',
            enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
            example: 'processing'
          },
          paymentMethod: {
            type: 'string',
            enum: ['card', 'cash', 'transfer', 'payme', 'click', 'uzum'],
            example: 'card'
          },
          paymentStatus: {
            type: 'string',
            enum: ['pending', 'paid', 'failed', 'refunded'],
            example: 'paid'
          },
          shippingAddress: {
            type: 'object',
            properties: {
              fullName: { type: 'string', example: 'Alexander Vance' },
              phone: { type: 'string', example: '+998 90 123 45 67' },
              address: { type: 'string', example: 'Amir Temur Avenue 45' },
              city: { type: 'string', example: 'Tashkent' },
              postalCode: { type: 'string', example: '100000' }
            }
          },
          trackingNumber: { type: 'string', example: 'TRK-UZ-984210' },
          notes: { type: 'string', example: 'Please call before arrival' },
          items: {
            type: 'array',
            items: { $ref: '#/components/schemas/OrderItem' }
          },
          createdAt: { type: 'string', format: 'date-time' }
        }
      },
      OrderItem: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          order_id: { type: 'integer', example: 101 },
          product_id: { type: 'integer', example: 1 },
          quantity: { type: 'integer', example: 2 },
          price: { type: 'number', format: 'float', example: 89.00 },
          color: { type: 'string', example: 'Space Black' }
        }
      },

      // 5. CART & CARTITEM MODELS
      Cart: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          user_id: { type: 'integer', example: 2 },
          items: {
            type: 'array',
            items: { $ref: '#/components/schemas/CartItem' }
          }
        }
      },
      CartItem: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 5 },
          cart_id: { type: 'integer', example: 1 },
          product_id: { type: 'integer', example: 1 },
          quantity: { type: 'integer', example: 1 },
          color: { type: 'string', example: 'Black' },
          price: { type: 'number', format: 'float', example: 89.00 },
          product: { $ref: '#/components/schemas/Product' }
        }
      },

      // 6. REVIEW MODEL
      Review: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          user_id: { type: 'integer', example: 2 },
          product_id: { type: 'integer', example: 1 },
          rating: { type: 'integer', minimum: 1, maximum: 5, example: 5 },
          comment: { type: 'string', example: 'Incredible keyboard build quality and battery life!' },
          likes: { type: 'integer', example: 12 },
          images: {
            type: 'array',
            items: { type: 'string' }
          },
          verifiedPurchase: { type: 'boolean', example: true },
          user: {
            type: 'object',
            properties: {
              firstName: { type: 'string', example: 'Sophia' },
              lastName: { type: 'string', example: 'Chen' },
              avatar: { type: 'string' }
            }
          },
          createdAt: { type: 'string', format: 'date-time' }
        }
      },

      // 7. SETTING MODEL
      Setting: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          storeName: { type: 'string', example: 'CORELY' },
          tagline: { type: 'string', example: 'Technology that fits your world.' },
          storeEmail: { type: 'string', format: 'email', example: 'nazarovjamshid522@gmail.com' },
          storePhone: { type: 'string', example: '+998 71 200 00 00' },
          announcementText: { type: 'string', example: 'Spring Drop: Free express delivery across Uzbekistan!' },
          announcementEnabled: { type: 'boolean', example: false },
          heroBadge: { type: 'string', example: 'Next-Generation Electronics & Workstations' },
          heroTitle: { type: 'string', example: 'Kundalik texnologiyangizni yangilang.' },
          heroSubtitle: { type: 'string', example: 'Aniq mexanik klaviaturalar, yengil o\'yin sichqonchalari va zamonaviy ish stoli uskunalari.' },
          currency: { type: 'string', example: 'USD' },
          taxRate: { type: 'number', format: 'float', example: 8.5 },
          freeShippingThreshold: { type: 'number', format: 'float', example: 100 },
          standardShippingFee: { type: 'number', format: 'float', example: 5 },
          expressShippingFee: { type: 'number', format: 'float', example: 15 },
          sameDayShippingFee: { type: 'number', format: 'float', example: 25 },
          address: { type: 'string', example: '45 Silicon Valley Way, Tech District, Tashkent' },
          allowGuestCheckout: { type: 'boolean', example: false }
        }
      },

      // 8. SUPPORTMESSAGE MODEL
      SupportMessage: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          name: { type: 'string', example: 'Jamshid Nazarov' },
          email: { type: 'string', format: 'email', example: 'nazarovjamshid522@gmail.com' },
          phone: { type: 'string', example: '+998 90 999 88 77' },
          subject: { type: 'string', example: 'Order Inquiry / Delivery Status' },
          orderNumber: { type: 'string', example: 'COR-894721' },
          message: { type: 'string', example: 'When will my order arrive in Samarkand?' },
          targetEmail: { type: 'string', example: 'nazarovjamshid522@gmail.com' },
          status: { type: 'string', enum: ['new', 'in_progress', 'resolved'], example: 'new' },
          createdAt: { type: 'string', format: 'date-time' }
        }
      },

      // 9. NOTIFICATION MODEL
      Notification: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          user_id: { type: 'integer', example: 1 },
          title: { type: 'string', example: 'New Order Received' },
          message: { type: 'string', example: 'Order #COR-894721 has been placed by Sophia Chen' },
          type: { type: 'string', enum: ['order', 'system', 'support', 'stock'], example: 'order' },
          link: { type: 'string', example: '/admin' },
          isRead: { type: 'boolean', example: false },
          createdAt: { type: 'string', format: 'date-time' }
        }
      },

      // 10. FAVORITE MODEL
      UserFavorite: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          user_id: { type: 'integer', example: 2 },
          product_id: { type: 'integer', example: 1 },
          createdAt: { type: 'string', format: 'date-time' }
        }
      },

      // API Error Response
      ErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string', example: 'Invalid credentials or resource not found' }
        }
      }
    }
  },
  paths: {
    // ---------------- AUTHENTICATION ----------------
    '/api/auth/register': {
      post: {
        tags: ['Authentication'],
        summary: 'Register a new customer account',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['firstName', 'lastName', 'email', 'password'],
                properties: {
                  firstName: { type: 'string', example: 'Alexander' },
                  lastName: { type: 'string', example: 'Vance' },
                  email: { type: 'string', format: 'email', example: 'alexander@example.com' },
                  phone: { type: 'string', example: '+998 90 123 45 67' },
                  password: { type: 'string', example: 'SecurePassword123!' }
                }
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Account created successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsIn...' },
                    user: { $ref: '#/components/schemas/User' }
                  }
                }
              }
            }
          },
          400: { description: 'Validation error or email already in use', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      }
    },
    '/api/auth/login': {
      post: {
        tags: ['Authentication'],
        summary: 'User & Admin login with email and password',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', example: 'admin@corely.com' },
                  password: { type: 'string', example: 'Admin123!' }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Authenticated successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    token: { type: 'string' },
                    user: { $ref: '#/components/schemas/User' }
                  }
                }
              }
            }
          },
          401: { description: 'Invalid email or password' }
        }
      }
    },
    '/api/auth/me': {
      get: {
        tags: ['Authentication'],
        summary: 'Get current authenticated user profile',
        security: [{ BearerAuth: [] }],
        responses: {
          200: {
            description: 'User profile retrieved',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    user: { $ref: '#/components/schemas/User' }
                  }
                }
              }
            }
          },
          401: { description: 'Unauthorized' }
        }
      }
    },

    // ---------------- PRODUCTS ----------------
    '/api/products': {
      get: {
        tags: ['Products'],
        summary: 'List products with filters, search, pagination, and sorting',
        parameters: [
          { name: 'search', in: 'query', schema: { type: 'string' }, description: 'Search title, brand, description, tags' },
          { name: 'category', in: 'query', schema: { type: 'string' }, description: 'Category slug (e.g. gaming, computers, audio)' },
          { name: 'brand', in: 'query', schema: { type: 'string' }, description: 'Filter by brand (e.g. Apple, Keychron)' },
          { name: 'minPrice', in: 'query', schema: { type: 'number' } },
          { name: 'maxPrice', in: 'query', schema: { type: 'number' } },
          { name: 'sort', in: 'query', schema: { type: 'string', enum: ['newest', 'popular', 'price_asc', 'price_desc', 'rating'] } },
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 12 } }
        ],
        responses: {
          200: {
            description: 'List of matching products',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    total: { type: 'integer', example: 78 },
                    page: { type: 'integer', example: 1 },
                    totalPages: { type: 'integer', example: 7 },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Product' }
                    }
                  }
                }
              }
            }
          }
        }
      },
      post: {
        tags: ['Products'],
        summary: 'Create a new product (Admin Only)',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Product' }
            }
          }
        },
        responses: {
          201: { description: 'Product created successfully' },
          403: { description: 'Requires Administrator privileges' }
        }
      }
    },
    '/api/products/{id}': {
      get: {
        tags: ['Products'],
        summary: 'Get single product details by ID or Slug',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Product ID or Slug' }
        ],
        responses: {
          200: {
            description: 'Product details',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/Product' }
                  }
                }
              }
            }
          },
          404: { description: 'Product not found' }
        }
      },
      patch: {
        tags: ['Products'],
        summary: 'Update existing product (Admin Only)',
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Product' }
            }
          }
        },
        responses: {
          200: { description: 'Product updated successfully' }
        }
      },
      delete: {
        tags: ['Products'],
        summary: 'Delete a product (Admin Only)',
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
        ],
        responses: {
          200: { description: 'Product deleted' }
        }
      }
    },

    // ---------------- CATEGORIES ----------------
    '/api/categories': {
      get: {
        tags: ['Categories'],
        summary: 'List all store categories with product counts',
        responses: {
          200: {
            description: 'List of categories',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Category' }
                    }
                  }
                }
              }
            }
          }
        }
      },
      post: {
        tags: ['Categories'],
        summary: 'Create category (Admin Only)',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Category' }
            }
          }
        },
        responses: {
          201: { description: 'Category created' }
        }
      }
    },

    // ---------------- CART ----------------
    '/api/cart': {
      get: {
        tags: ['Cart'],
        summary: 'Get active user shopping cart',
        security: [{ BearerAuth: [] }],
        responses: {
          200: {
            description: 'Current cart items',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/Cart' }
                  }
                }
              }
            }
          }
        }
      },
      post: {
        tags: ['Cart'],
        summary: 'Add item to cart',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['productId'],
                properties: {
                  productId: { type: 'integer', example: 1 },
                  quantity: { type: 'integer', default: 1, example: 1 },
                  color: { type: 'string', example: 'Space Black' }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Item added to cart' }
        }
      }
    },

    // ---------------- ORDERS ----------------
    '/api/orders': {
      get: {
        tags: ['Orders'],
        summary: 'Get order history (Customer or Admin)',
        security: [{ BearerAuth: [] }],
        responses: {
          200: {
            description: 'List of orders',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Order' }
                    }
                  }
                }
              }
            }
          }
        }
      },
      post: {
        tags: ['Orders'],
        summary: 'Place and checkout order',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['items', 'shippingAddress', 'paymentMethod'],
                properties: {
                  items: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        productId: { type: 'integer', example: 1 },
                        quantity: { type: 'integer', example: 1 },
                        color: { type: 'string', example: 'Default' }
                      }
                    }
                  },
                  shippingAddress: {
                    type: 'object',
                    properties: {
                      fullName: { type: 'string', example: 'Alexander Vance' },
                      phone: { type: 'string', example: '+998 90 123 45 67' },
                      address: { type: 'string', example: 'Amir Temur St. 45' },
                      city: { type: 'string', example: 'Tashkent' }
                    }
                  },
                  paymentMethod: { type: 'string', example: 'card' },
                  notes: { type: 'string', example: 'Call before delivery' }
                }
              }
            }
          }
        },
        responses: {
          201: { description: 'Order created successfully' }
        }
      }
    },

    // ---------------- REVIEWS ----------------
    '/api/reviews': {
      post: {
        tags: ['Reviews'],
        summary: 'Submit customer product review and rating',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['productId', 'rating', 'comment'],
                properties: {
                  productId: { type: 'integer', example: 1 },
                  rating: { type: 'integer', minimum: 1, maximum: 5, example: 5 },
                  comment: { type: 'string', example: 'Superb precision and responsive mechanical tactile feedback!' }
                }
              }
            }
          }
        },
        responses: {
          201: { description: 'Review posted' }
        }
      }
    },

    // ---------------- SETTINGS ----------------
    '/api/settings': {
      get: {
        tags: ['Store Settings'],
        summary: 'Get global store configuration & hero texts',
        responses: {
          200: {
            description: 'Store settings',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/Setting' }
                  }
                }
              }
            }
          }
        }
      },
      patch: {
        tags: ['Store Settings'],
        summary: 'Update store configuration (Admin Only)',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Setting' }
            }
          }
        },
        responses: {
          200: { description: 'Store settings updated' }
        }
      }
    },

    // ---------------- SUPPORT & CONTACT ----------------
    '/api/support': {
      post: {
        tags: ['Support & Contact'],
        summary: 'Submit customer help inquiry (Dispatched to nazarovjamshid522@gmail.com)',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email', 'subject', 'message'],
                properties: {
                  name: { type: 'string', example: 'Jamshid Nazarov' },
                  email: { type: 'string', format: 'email', example: 'nazarovjamshid522@gmail.com' },
                  phone: { type: 'string', example: '+998 90 999 88 77' },
                  subject: { type: 'string', example: 'Delivery question for Tashkent' },
                  orderNumber: { type: 'string', example: 'COR-894721' },
                  message: { type: 'string', example: 'Please clarify delivery time for my order.' }
                }
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Message logged and routed to target email',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Xabaringiz qabul qilindi va nazarovjamshid522@gmail.com manziliga yuborildi!' },
                    targetEmail: { type: 'string', example: 'nazarovjamshid522@gmail.com' }
                  }
                }
              }
            }
          }
        }
      }
    },

    // ---------------- ANALYTICS ----------------
    '/api/admin/analytics': {
      get: {
        tags: ['Analytics & Admin'],
        summary: 'Fetch live store performance KPI stats (Admin Only)',
        security: [{ BearerAuth: [] }],
        responses: {
          200: {
            description: 'Revenue, orders, customer metrics',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'object',
                      properties: {
                        totalRevenue: { type: 'number', example: 12450.0 },
                        totalOrders: { type: 'integer', example: 84 },
                        totalUsers: { type: 'integer', example: 42 },
                        totalProducts: { type: 'integer', example: 78 }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};

module.exports = swaggerSpec;
