const users = [
    {
        email: 'quantran2381@gmail.com',
        name: 'Quan Tran',
        username: 'quan238',
        password: '123456',
    },
]

const roles = [
    {
        name: 'master_admin',
        pagesAllowed: ['dashboard'],
        permissions: ['create_accounts'],
        user: 'quantran2381@gmail.com',
    },
]

module.exports = { users, roles }
