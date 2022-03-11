'use strict'
const envSchema = require('env-schema')

const { init, run } = require('./server')
const { config: envConfig } = require('./config/environmentVariables')
const lib = require('api/lib')

;(async () => {
    const config = envSchema(envConfig)
    const { logger } = lib
    try {
        const server = await init({ config })
        await run(server)
    } catch (err) {
        logger.error(err, 'Error While Starting the Server')
    }
})()
