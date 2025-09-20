require('dotenv').config();

module.exports = {
    db: {
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DB,
        port: process.env.DB_PORT || 3306
    },
    app: {
        port: process.env.PORT || 4000
    }
};