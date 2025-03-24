import mysql from 'mysql2/promise';

class BD {
    // Создаём пул соединений
     pool(){
         return  mysql.createPool({
             port: process.env.DATABASE_PORT || 3306,
             host: process.env.DB_HOST || 'db',
             user: process.env.DB_USER || 'root',
             password: process.env.DB_PASSWORD || 'root',
             database: process.env.DB_NAME || 'tprices',
             waitForConnections: true,
             connectionLimit: 10,
             queueLimit: 0
         });
     }
     create(){
         return  mysql.createPool({
             host: process.env.DB_HOST || 'db',
             user: process.env.DB_USER || 'root',
             password: process.env.DB_PASSWORD || 'root',
             database: process.env.DB_NAME || 'tprices',
         });
     }


}
const bd = new BD()
export const pool =  bd.pool()
