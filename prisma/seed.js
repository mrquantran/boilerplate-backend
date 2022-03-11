const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const bcrypt = require('bcrypt')
const { users } = require('./data')
// A `main` function so that we can use async/await
async function main() {
    // delete all data
    await prisma.user.deleteMany({})

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
