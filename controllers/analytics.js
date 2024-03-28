import db from "../server.js";

export const barchart = async(req, res) => {
    const { yr } = req.query;

    if (!yr || yr == "" || yr == undefined || yr == null) {
        db.query(`SELECT months.month, YEAR(CURRENT_DATE()) AS year, IFNULL(orders.total, 0) AS amountmade, IFNULL(orders.ordercount, 0) AS ordercount FROM (SELECT 1 AS month UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10 UNION SELECT 11 UNION SELECT 12) AS months LEFT JOIN (SELECT MONTH(orderdate) AS month, COUNT(*) AS ordercount, SUM(orders.amount) AS total FROM orders WHERE YEAR(orderdate) = YEAR(CURRENT_DATE()) GROUP BY MONTH(orderdate)) AS orders ON months.month = orders.month ORDER BY months.month`, [], (err, result) => {
            if(err) throw err;
            const data = (result.length > 0 ? result.map((info, index) => {
                return { 
                    month: (info.month == 1 ? "Jan" :
                    info.month == 2 ? "Feb" : 
                    info.month == 3 ? "Mar" : 
                    info.month == 4 ? "Apr" : 
                    info.month == 5 ? "May" : 
                    info.month == 6 ? "Jun" : 
                    info.month == 7 ? "Jul" : 
                    info.month == 8 ? "Aug" : 
                    info.month == 9 ? "Sep" : 
                    info.month == 10 ? "Oct" : 
                    info.month == 11 ? "Nov" : 
                    info.month == 12 ? "Dec" : null), 
                    year: `${info.year}`, 
                    orders: info.ordercount}
            }): [])
            res.json(data)
            return;
        })
    } else {
        db.query(`SELECT months.month, YEAR(CURRENT_DATE()) AS year, IFNULL(orders.total, 0) AS amountmade, IFNULL(orders.ordercount, 0) AS ordercount FROM (SELECT 1 AS month UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10 UNION SELECT 11 UNION SELECT 12) AS months LEFT JOIN (SELECT MONTH(orderdate) AS month, COUNT(*) AS ordercount, SUM(orders.amount) AS total FROM orders WHERE YEAR(orderdate) = ? GROUP BY MONTH(orderdate)) AS orders ON months.month = orders.month ORDER BY months.month`, [ yr ], (err, result) => {
            if(err) throw err;
            const data = (result.length > 0 ? result.map((info, index) => {
                return { 
                    month: (info.month == 1 ? "Jan" :
                    info.month == 2 ? "Feb" : 
                    info.month == 3 ? "Mar" : 
                    info.month == 4 ? "Apr" : 
                    info.month == 5 ? "May" : 
                    info.month == 6 ? "Jun" : 
                    info.month == 7 ? "Jul" : 
                    info.month == 8 ? "Aug" : 
                    info.month == 9 ? "Sep" : 
                    info.month == 10 ? "Oct" : 
                    info.month == 11 ? "Nov" : 
                    info.month == 12 ? "Dec" : null), 
                    year: yr, 
                    orders: info.ordercount}
            }): [])
            res.json(data)
            return;
        })
    }

}

export const piechart = async(req, res) => {
    const { yr } = req.query;

    if (!yr || yr == "" || yr == undefined || yr == null) {
        db.query(`SELECT services.service, YEAR(CURRENT_DATE()) AS year, IFNULL(orders.total, 0) AS amountmade, IFNULL(orders.ordercount, 0) AS ordercount FROM (SELECT "pot" AS service UNION SELECT "casual" UNION SELECT "special" UNION SELECT "chops") AS services LEFT JOIN (SELECT COUNT(*) AS ordercount, SUM(orders.amount) AS total, orders.type AS type FROM orders WHERE YEAR(orderdate) = YEAR(CURRENT_DATE()) GROUP BY orders.type) AS orders ON services.service = orders.type ORDER BY services.service`, [], (err, result) => {
            if(err) throw err;
            const data = (result.length > 0 ? result.map((info, index) => {
                return { 
                    type: info.service, 
                    year: `${info.year}`, 
                    orders: info.ordercount
                }
            }): [])
            res.json(data)
            return;
        })
    } else {
        db.query(`SELECT services.service, YEAR(CURRENT_DATE()) AS year, IFNULL(orders.total, 0) AS amountmade, IFNULL(orders.ordercount, 0) AS ordercount FROM (SELECT "pot" AS service UNION SELECT "casual" UNION SELECT "special" UNION SELECT "chops") AS services LEFT JOIN (SELECT COUNT(*) AS ordercount, SUM(orders.amount) AS total, orders.type AS type FROM orders WHERE YEAR(orderdate) = ? GROUP BY orders.type) AS orders ON services.service = orders.type ORDER BY services.service`, [ yr ], (err, result) => {
            if(err) throw err;
            const data = (result.length > 0 ? result.map((info, index) => {
                return { 
                    type: info.service, 
                    year: yr, 
                    orders: info.ordercount}
            }): [])
            res.json(data)
            return;
        })
    }

}
