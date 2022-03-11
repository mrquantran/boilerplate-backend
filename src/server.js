require('make-promises-safe')
const path = require('path')
const fastify = require('fastify')
const cors = require('fastify-cors')
const helmet = require('fastify-helmet')
const swagger = require('fastify-swagger')
const underPressure = require('under-pressure')
const autoload = require('fastify-autoload')
const routes = require('api/app/routes')
const lib = require('api/lib')
const {
    requestContext,
    onResponse,
    appendPayloadToResponse,
} = require('api/hooks')

const underPressureConfig = () => {
    return {
        healthCheck: async function () {
            // TODO: Add database connection check
            return true
        },
        message: 'Under Pressure 😯',
        exposeStatusRoute: '/status',
        healthCheckInterval: 5000,
    }
}

const swaggerConfig = () => {
    return {
        routePrefix: '/documentation',
        swagger: {
            info: {
                title: 'Backend Boilerplate',
                description:
                    'A full blown production ready boilerplate to build APIs with Fastify',
                version: '1.0.0',
            },
            consumes: ['application/json'],
            produces: ['application/json'],
        },
        exposeRoute: true,
    }
}

const init = async ({ config }) => {
    const { logger, uuid } = lib
    const app = fastify({
        logger,
        genReqId: (req) => req.headers['x-request-id'] || uuid(),
        disableRequestLogging: true,
    })
    app.decorate('config', config)
    app.register(cors)
    app.register(helmet, {
        noCache: true,
        policy: 'same-origin',
        contentSecurityPolicy: {
            useDefaults: true,
            directives: {
                imgSrc: ["'self'", 'data:'],
                scriptSrc: ["'self' 'unsafe-inline'"],
            },
        },
    })
    app.register(underPressure, underPressureConfig())
    app.register(require('fastify-formbody'))
    app.register(swagger, swaggerConfig())
    // console.log(path.join(__dirname, 'api/plugins'))
    app.register(autoload, {
        dir: path.join(__dirname, 'api/plugins'),
        ignorePattern: /^(__tests__)/,
    })
    app.register(routes)
    app.addHook('preValidation', requestContext)
    app.addHook('preSerialization', appendPayloadToResponse)
    app.addHook('onResponse', onResponse)
    await app.ready()
    logger.info('Everything is Loaded..!')
    return app
}

const run = (app) => app.listen(app.config.PORT, app.config.HOST)
module.exports = { init, run }
