import { NextResponse } from 'next/server';

export async function GET() {
  const openApiSpec = {
    "openapi": "3.1.0",
    "info": {
      "title": "Samui Services API",
      "description": "API for the Samui Services service directory covering Koh Samui, Phangan, and Tao.",
      "version": "1.0.0"
    },
    "servers": [
      {
        "url": "/api",
        "description": "Next.js API Routes (Local/Production)"
      }
    ],
    "paths": {
      "/businesses": {
        "get": {
          "summary": "Get all businesses",
          "description": "Retrieve a list of all businesses, optionally filtered by island or category.",
          "parameters": [
            {
              "name": "island",
              "in": "query",
              "description": "Filter by island slug",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "category",
              "in": "query",
              "description": "Filter by category slug",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "A list of businesses",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/Business"
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/businesses/{id}": {
        "get": {
          "summary": "Get a business by ID",
          "description": "Retrieve detailed information for a specific business.",
          "parameters": [
            {
              "name": "id",
              "in": "path",
              "required": true,
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "A single business object",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Business"
                  }
                }
              }
            },
            "404": {
              "description": "Business not found"
            }
          }
        }
      },
      "/islands": {
        "get": {
          "summary": "Get all islands",
          "description": "Retrieve a list of supported islands.",
          "responses": {
            "200": {
              "description": "A list of islands",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/Island"
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/categories": {
        "get": {
          "summary": "Get all categories",
          "description": "Retrieve a list of supported business categories.",
          "responses": {
            "200": {
              "description": "A list of categories",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/Category"
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "components": {
      "schemas": {
        "Business": {
          "type": "object",
          "required": [
            "id",
            "name",
            "category",
            "island",
            "rating",
            "reviews",
            "image"
          ],
          "properties": {
            "id": {
              "type": "string",
              "example": "1"
            },
            "name": {
              "type": "string",
              "example": "Samui Builders Pro"
            },
            "category": {
              "type": "string",
              "example": "construction"
            },
            "island": {
              "type": "string",
              "example": "koh-samui"
            },
            "rating": {
              "type": "number",
              "format": "float",
              "example": 4.8
            },
            "reviews": {
              "type": "integer",
              "example": 124
            },
            "image": {
              "type": "string",
              "example": "https://images.unsplash.com/photo-1541888081-3677b10214c7?auto=format&fit=crop&w=800&q=80"
            },
            "phone": {
              "type": "string",
              "example": "+66 81 234 5678"
            },
            "address": {
              "type": "string",
              "example": "123 Beach Rd, Koh Samui"
            },
            "description": {
              "type": "string",
              "example": "Professional construction and renovation services."
            }
          }
        },
        "Island": {
          "type": "object",
          "required": [
            "name",
            "slug"
          ],
          "properties": {
            "name": {
              "type": "string",
              "example": "Koh Samui"
            },
            "slug": {
              "type": "string",
              "example": "koh-samui"
            }
          }
        },
        "Category": {
          "type": "object",
          "required": [
            "name",
            "slug"
          ],
          "properties": {
            "name": {
              "type": "string",
              "example": "Construction"
            },
            "slug": {
              "type": "string",
              "example": "construction"
            }
          }
        }
      }
    }
  };

  return NextResponse.json(openApiSpec, {
    status: 200,
    headers: {
      'Content-Type': 'application/openapi+json; charset=utf-8',
      'Cache-Control': 'public, s-maxage=86400',
    }
  });
}
