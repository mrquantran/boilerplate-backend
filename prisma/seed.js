const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const bcrypt = require('bcrypt')
const { users, roles } = require('./data')
const { v4: uuid } = require('uuid')

// A `main` function so that we can use async/await
async function main() {
    // delete all data
    await prisma.user.deleteMany({})
    await prisma.session.deleteMany({})
    await prisma.role.deleteMany({})
    // users
    for (const user of users) {
        const saltRounds = await bcrypt.genSalt(10)
        const hash = bcrypt.hashSync(user.password, saltRounds)
        await prisma.user.create({
            data: {
                username: user.username,
                email: user.email,
                name: user.name,
                password: hash,
                active: true,
            },
        })
    }

    // roles
    for (const role of roles) {
        await prisma.role.create({
            data: {
                name: role.name,
                pagesAllowed: role.pagesAllowed,
                permissions: role.permissions,
                user: {
                    connect: {
                        email: role.user,
                    },
                },
            },
        })
    }
}

main()
    .catch((e) => {
        // eslint-disable-next-line no-console
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        // Disconnect Prisma Client
        await prisma.$disconnect()
    })
