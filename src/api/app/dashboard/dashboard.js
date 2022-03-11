module.exports = async (fastify) => {
    fastify.route({
        method: 'GET',
        url: '/dashboard',
    })
}
