const fp = require('fastify-plugin')
const Ajv = require('ajv')
const AjvErrors = require('ajv-errors')
const addFormats = require('ajv-formats')

/**
 * Source: https://ajv.js.org/guide/why-ajv.html
 * Ensure your data is valid as soon as it's received
 */
async function ajvCompiler(fastify, options) {
    const ajv = new Ajv({
        removeAdditional: true,
        useDefaults: true,
        coerceTypes: true,
        allErrors: true,
        allowUnionTypes: true,
    })
    AjvErrors(ajv)
    addFormats(ajv)
    fastify.setValidatorCompiler(({ schema }) => {
        return ajv.compile(schema)
    })
}

module.exports = fp(ajvCompiler, {
    fastify: '>=3.0.0',
    name: 'ajv-compiler',
})
