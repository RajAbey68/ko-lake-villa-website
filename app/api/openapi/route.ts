import { NextResponse } from 'next/server'

export async function GET() {
  const spec = {
    openapi: '3.0.3',
    info: {
      title: 'Ko Lake Villa API',
      version: '1.0.0',
      description: 'Public API for Ko Lake Villa website'
    },
    servers: [{ url: '/' }],
    paths: {
      '/api/health': {
        get: {
          summary: 'Health check',
          responses: { '200': { description: 'OK' } }
        }
      },
      '/api/rooms': {
        get: {
          summary: 'List rooms',
          responses: { '200': { description: 'Array of rooms' } }
        }
      },
      '/api/gallery/list': {
        get: {
          summary: 'Gallery images list',
          responses: { '200': { description: 'Gallery payload' } }
        }
      },
      '/api/gallery/categories': {
        get: {
          summary: 'Gallery categories',
          responses: { '200': { description: 'Categories array' } }
        }
      },
      '/api/contact': {
        get: { summary: 'Contact endpoint health', responses: { '200': { description: 'OK' } } },
        post: {
          summary: 'Submit contact form',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    email: { type: 'string', format: 'email' },
                    phone: { type: 'string' },
                    subject: { type: 'string' },
                    message: { type: 'string' }
                  },
                  required: ['name', 'email', 'message']
                }
              }
            }
          },
          responses: { '200': { description: 'Submission accepted' }, '400': { description: 'Validation error' } }
        }
      }
    }
  }
  return NextResponse.json(spec)
}


