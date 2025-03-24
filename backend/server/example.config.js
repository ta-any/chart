import mysql from 'mysql2/promise';

class BD {
    // Создаём пул соединений
    pool(){
        return  mysql.createPool({
            port: process.env.DATABASE_PORT || 3306,
            host: process.env.DB_HOST || 'db',
            user: process.env.DB_USER || 'user',
            password: process.env.DB_PASSWORD || 'password',
            database: process.env.DB_NAME || 'my_bd',
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });
    }
    create(){
        return  mysql.createPool({
            host: process.env.DB_HOST || 'db',
            user: process.env.DB_USER || 'user',
            password: process.env.DB_PASSWORD || 'password',
            database: process.env.DB_NAME || 'my_bd',
        });
    }


}
const bd = new BD()
export const pool =  bd.pool()
