import { io } from "../socket.js";
import db from "../server.js";

export const allorders = async(req, res) => {
    let { start, limit, filter, value } = req.query;
    let next = true;
    let prev = false;

    if (!start || !limit) {
        res.json({ error: true, status: 401, table: { total: 0, next: false, prev,  orders: [] } })
        return;
    }

    if(!filter || filter == "" || filter == undefined || filter == null) {
        db.query('SELECT COUNT(id) AS total FROM orders', [], (err, result) => {
            if (err) throw err;
            const total = result[0].total;
            if ((result[0].total - (start)) < 10) {
                next = false;
            }
            if (start > 0) {
                prev = true
            }

            db.query(`SELECT id, receipt, customer AS customerid, firstname, lastname, email, mealid, photo, title, meat, combo, type, method, itemcount, quantity, size, amount, country, city, district, address, tel, prepaid, stage, printed, DATE_FORMAT(orderdate, '%D %M, %Y') AS date_ordered FROM orders ORDER BY id DESC LIMIT ? OFFSET ?`, [ parseInt(limit), parseInt(start) ], (err, result) => {
                if(err) throw err;
                io.emit("neworder", 0)
                res.json({ error: false, status: 200, table: { total, next, prev,  orders: result } })
                return;
            })
        })
    }

    if (filter == "country") {
        if (!value) {
            res.json({ error: true, status: 401, table: { total: 0, next: false, prev,  orders: [] } })
            return;
        }
        db.query('SELECT COUNT(id) AS total FROM orders WHERE country=?', [value], (err, result) => {
            if (err) throw err;
            const total = result[0].total;
            if ((result[0].total - (start)) < 10) {
                next = false;
            }
            if (start > 0) {
                prev = true
            }

            db.query(`SELECT id, receipt, customer AS customerid, firstname, lastname, email, mealid, photo, title, meat, combo, type, method, itemcount, quantity, size, amount, country, city, district, address, tel, prepaid, stage, printed, DATE_FORMAT(orderdate, '%D %M, %Y') AS date_ordered FROM orders WHERE country=? ORDER BY id DESC LIMIT ? OFFSET ?`, [ value, parseInt(limit), parseInt(start) ], (err, result) => {
                if(err) throw err;
                // console.log({ orders: result } );
                res.json({ error: false, status: 200, table: { total, next, prev,  orders: result } })
                return;
            })
        })
    }

    if (filter == "city") {
        if (!value) {
            res.json({ error: true, status: 401, table: { total: 0, next: false, prev,  orders: [] } })
            return;
        }
        db.query('SELECT COUNT(id) AS total FROM orders WHERE city=?', [value], (err, result) => {
            if (err) throw err;
            const total = result[0].total;
            if ((result[0].total - (start)) < 10) {
                next = false;
            }
            if (start > 0) {
                prev = true
            }

            db.query(`SELECT id, receipt, customer AS customerid, firstname, lastname, email, mealid, photo, title, meat, combo, type, method, itemcount, quantity, size, amount, country, city, district, address, tel, prepaid, stage, printed, DATE_FORMAT(orderdate, '%D %M, %Y') AS date_ordered FROM orders WHERE city=? ORDER BY id DESC LIMIT ? OFFSET ?`, [ value, parseInt(limit), parseInt(start) ], (err, result) => {
                if(err) throw err;
                // console.log({ orders: result } );
                res.json({ error: false, status: 200, table: { total, next, prev,  orders: result } })
                return;
            })
        })
    }

    if (filter == "district") {
        if (!value) {
            res.json({ error: true, status: 401, table: { total: 0, next: false, prev,  orders: [] } })
            return;
        }
        db.query('SELECT COUNT(id) AS total FROM orders WHERE district=?', [value], (err, result) => {
            if (err) throw err;
            const total = result[0].total;
            if ((result[0].total - (start)) < 10) {
                next = false;
            }
            if (start > 0) {
                prev = true
            }

            db.query(`SELECT id, receipt, customer AS customerid, firstname, lastname, email, mealid, photo, title, meat, combo, type, method, itemcount, quantity, size, amount, country, city, district, address, tel, prepaid, stage, printed, DATE_FORMAT(orderdate, '%D %M, %Y') AS date_ordered FROM orders WHERE district=? ORDER BY id DESC LIMIT ? OFFSET ?`, [ value, parseInt(limit), parseInt(start) ], (err, result) => {
                if(err) throw err;
                // console.log({ orders: result } );
                res.json({ error: false, status: 200, table: { total, next, prev,  orders: result } })
                return;
            })
        })
    }
}

export const allcustomerorders = async(req, res) => {
    const { email, start, limit } = req.query;

    if (!start || !limit) {
        res.json({ error: true, status: 401, orders: [] })
        return;
    }

    db.query(`SELECT orders.id AS orderid, orders.receipt, orders.customer AS customerid, orders.mealid, orders.photo, orders.title, orders.meat, orders.combo, orders.type, orders.method, orders.itemcount, orders.quantity, orders.amount, orders.country, orders.city, orders.district, orders.address, orders.tel, orders.prepaid, orders.stage, users.firstname, users.lastname, users.email, DATE_FORMAT(orders.orderdate, '%D %M, %Y') AS date_ordered FROM orders LEFT JOIN users on orders.email=users.email WHERE orders.email=? ORDER BY orders.id DESC LIMIT ? OFFSET ?`, [ email, parseInt(limit), parseInt(start)], (err, result) => {
        if(err) throw err;
        console.log(result)
        res.json({ error: false, status: 200, orders: result })
        return;
    })
}

export const addcustomerorders = async(req, res) => {
    const { method, eligible } = req.query;
    const items = req.body;
    const itemlength = items.length;

    if (method == "cash" || method == "card") {
        try {
            await Promise.all(items.map((item, index) => {
                db.query(`INSERT INTO orders (mobile, receipt, customer, firstname, lastname, email, mealid, photo, title, meat, combo, type, method, itemcount, quantity, size, amount, bulkamount, country, city, district, address, postalcode, tel, prepaid, stage, printed, orderdate) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?, NOW())`, [item.mobile, item.receipt, item.customerId, item.firstname, item.lastname, item.email, item.mealId, item.photo, item.name, item.meat, item.combo, item.type, item.method, itemlength, item.quantity, item.size, item.price, item.amount, item.country, item.city, item.district, item.address, item.postalcode, item.tel, item.prepaid, 1, false], (err, result) => {
                    if (err) throw err;
                })
            }))
            if (eligible == true) {
                if (items[0].mobile) {
                    db.query(`UPDATE users SET bonuslevel=? WHERE id=?`, [2, items[0].customerId], (err, result) => {
                        if (err) throw err;
                    })
                } else {
                    db.query(`UPDATE users SET bonuslevel=? WHERE id=?`, [1, items[0].customerId], (err, result) => {
                        if (err) throw err;
                    })
                }
            }
            console.log("Was not eligible")
        } catch (error) {
            console.log(error.message)
        }
        io.emit("neworder", 1)
        return res.json({ error: false, status: 200, receipt: items[0].receipt })
    }

    return res.json({ error: true, status: 405 })
}

export const printorders = async(req, res) => {
    const { items } = req.body;

    try {
        await Promise.all(items.map((item, index) => {
            db.query(`UPDATE orders SET printed=? WHERE id=? AND stage=?`, [true, item.id, 1], (err, result) => {
                if (err) throw err;
            })
        }))
    } catch (error) {
        console.log(error.message)
    }
    return res.json({ error: false, status: 200 })
}

export const searchorder = async(req, res) => {
    const { role, country, city, district } = req.body;
    const { userid } = req.params;

    if ( !role || !city || !country || !district ) {
        res.json({ error: true, status: 401, message: "Please, fill in all fields!"})
        return;
    }

    db.query("SELECT id FROM users WHERE id=? and role=?", [userid, "customer"], (err, result) => {
        if (err) throw err;
        if (result.length < 1) {
            res.json({ error: true, status: 401, message: "No such user in our database!"})
            return;
        } else {
            db.query("UPDATE users SET role=?, country=?, city=?, district=? WHERE id=?", [role, country, city, district, userid], (err, result) => {
                if(err) throw err;
                res.json({ error: false, status: 200, message: "User successfully employed!" })
                return;
            })
        }
    })
}

export const searchcustomerorder = async(req, res) => {
    const { role, country, city, district } = req.body;
    const { userid } = req.params;

    if ( !role || !city || !country || !district ) {
        res.json({ error: true, status: 401, message: "Please, fill in all fields!"})
        return;
    }

    db.query("SELECT id FROM users WHERE id=? and role !=?", [userid, "customer"], (err, result) => {
        if (err) throw err;
        if (result.length < 1) {
            res.json({ error: true, status: 401, message: "No such user in our database!"})
            return;
        } else {
            db.query("UPDATE users SET role=?, country=?, city=?, district=? WHERE id=?", [role, country, city, district, userid], (err, result) => {
                if(err) throw err;
                res.json({ error: false, status: 200, message: "Staff has been promoted!" })
                return;
            })
        }
    })
}

export const changestatus = async(req, res) => {
    const { receipt } = req.params;
    const { stage } = req.query;

    if (!receipt) {
        res.json({ error: true, status: 401, message: "Order does not exist!"})
        return;
    }

    if (!stage) {
        res.json({ error: true, status: 401, message: "Order does not exist!"})
        return;
    }

    db.query(`UPDATE orders SET stage=? WHERE receipt=?`, [ stage, receipt ], (err, result) => {
        if (err) throw err;
        res.json({ error: false, status: 200, message: "successfully updated"})
        return;
    })

}