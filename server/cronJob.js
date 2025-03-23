// cronJob.js
import cron from 'node-cron';
import axios from 'axios';
import { pool } from './config.js';

class API {
    _formatData(unixTime){
        const date = new Date(unixTime * 1000);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    async fetchAndSaveOneData(response) {
        console.log(1110);
        try {
            console.log(response);

            const price = (response.high + response.low) / 2;
            const priceLow = Number(response.low);
            const priceHigh = Number(response.high);
            const data = this._formatData(response.time)

            const [total] = await pool.execute(
                'INSERT INTO tprices (price, pricesLow, pricesHigh, data) VALUES (?, ?, ?, ?)',
                [price, priceLow, priceHigh, data]
            );
            return total
        } catch (error) {
            console.error('Ошибка при получении данных:', error);
        }
    }
    async getLimitData(limit) {
        console.log("Start getLimitData")
        try {
            const response = await axios.get(
                `https://min-api.cryptocompare.com/data/v2/histoday?fsym=BTC&tsym=USD&limit=${limit}`
            );

            const lst = response.data.Data.Data
            console.log(lst.length)
            if(lst.length >= 0){
                if(limit === 1){
                    await this.fetchAndSaveOneData(lst[1])
                } else {
                    for(let res of lst){
                        await this.fetchAndSaveOneData(res)
                    }
                }
            } else {
                console.log("ERROR")
            }
        } catch (error) {
            console.error('Ошибка при получении данных:', error);
            return [];
        }
    }

    async createOneNodeEveryDay(){
         cron.schedule('0 12 * * *', async () => {
             console.log('Задача запущена в 10:00 утра по Москве');
             await this.getLimitData(1);
         }, {
             timezone: 'Europe/Moscow'
         });
    }
}

const api = new API()
export const back =  api.createOneNodeEveryDay()

// Для тестирования можно вызвать функцию вручную
// fetchAndSaveWeather();
