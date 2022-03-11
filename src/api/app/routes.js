const { errorHandler } = require('api/error/handler')
const authRoutes = require('./auth')

module.exports = async (fastify) => {
    fastify.setErrorHandler(errorHandler)
    // fastify.register(todoRoutes, { prefix: '/v1/todos' })
    fastify.register(authRoutes, { prefix: '/v1/auth' })
}
