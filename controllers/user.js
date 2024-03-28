import db from "../server.js";

export const allcustomers = async(req, res) => {
    let { start, limit } = req.query;
    let next = true;
    let prev = false;

    if (!start || !limit) {
        res.json({ error: true, status: 401, table: { total: 0, next: false, prev, customers: [] } })
        return;
    }

    db.query(`SELECT COUNT(id) AS total FROM users WHERE role = ?`, ["customer"], (err, result) => {
        if (err) throw err;
        const total = result[0].total;
        if ((result[0].total - (start)) < 10) {
            next = false;
        }
        if (start > 0) {
            prev = true
        }

        db.query(`SELECT id, firstname, lastname, email, role, DATE_FORMAT(created_at, '%D %M, %Y') AS joined FROM users WHERE role=? ORDER BY id DESC LIMIT ? OFFSET ?`, [ "customer", parseInt(limit), parseInt(start)], (err, result) => {
            if(err) throw err;
            res.json({ error: false, status: 200, table: { total, next, prev, customers: result } })
            return;
        })
    })
}

export const allstaffs = async(req, res) => {
    let { start, limit, filter, value } = req.query;
    let next = true;
    let prev = false;

    if (!start || !limit) {
        res.json({ error: true, status: 401, table: { total: 0, next: false, prev, staffs: [] } })
        return;
    }

    if(!filter || filter == "" || filter == undefined || filter == null) {
        db.query(`SELECT COUNT(id) AS total FROM users WHERE role=? OR role=?`, ["manager", "agent"], (err, result) => {
            if (err) throw err;
            const total = result[0].total;
            if ((result[0].total - (start)) < 10) {
                next = false;
            }
            if (start > 0) {
                prev = true
            }

            db.query(`SELECT id, firstname, lastname, email, role, country, city, district, DATE_FORMAT(created_at, '%D %M, %Y') AS joined FROM users WHERE role=? OR role=? ORDER BY id DESC LIMIT ? OFFSET ?`, [ "manager", "agent", parseInt(limit), parseInt(start)], (err, result) => {
                if(err) throw err;
                res.json({ error: false, status: 200, table: { total, next, prev, staffs: result } })
                return;
            })
        })
    }

    if(filter == "country") {
        if (!value) {
            res.json({ error: true, status: 401, table: { total: 0, next: false, prev, staffs: [] } })
            return;
        }
        db.query(`SELECT COUNT(id) AS total FROM users WHERE role=? OR role=? AND country=?`, ["manager", "agent", value], (err, result) => {
            if (err) throw err;
            const total = result[0].total;
            if ((result[0].total - (start)) < 10) {
                next = false;
            }
            if (start > 0) {
                prev = true
            }

            db.query(`SELECT id, firstname, lastname, email, role, country, city, district, DATE_FORMAT(created_at, '%D %M, %Y') AS joined FROM users WHERE role=? OR role=? AND country=? ORDER BY id DESC LIMIT ? OFFSET ?`, [ "manager", "agent", value, parseInt(limit), parseInt(start)], (err, result) => {
                if(err) throw err;
                res.json({ error: false, status: 200, table: { total, next, prev, staffs: result } })
                return;
            })
        })
    }

    if(filter == "city") {
        if (!value) {
            res.json({ error: true, status: 401, table: { total: 0, next: false, prev, staffs: [] } })
            return;
        }
        db.query(`SELECT COUNT(id) AS total FROM users WHERE role=? OR role=? AND city=?`, ["manager", "agent", value], (err, result) => {
            if (err) throw err;
            const total = result[0].total;
            if ((result[0].total - (start)) < 10) {
                next = false;
            }
            if (start > 0) {
                prev = true
            }

            db.query(`SELECT id, firstname, lastname, email, role, country, city, district, DATE_FORMAT(created_at, '%D %M, %Y') AS joined FROM users WHERE role=? OR role=? AND city=? ORDER BY id DESC LIMIT ? OFFSET ?`, [ "manager", "agent", value, parseInt(limit), parseInt(start)], (err, result) => {
                if(err) throw err;
                res.json({ error: false, status: 200, table: { total, next, prev, staffs: result } })
                return;
            })
        })
    }

    if(filter == "district") {
        if (!value) {
            res.json({ error: true, status: 401, table: { total: 0, next: false, prev, staffs: [] } })
            return;
        }
        db.query(`SELECT COUNT(id) AS total FROM users WHERE role=? OR role=? AND district=?`, ["manager", "agent", value], (err, result) => {
            if (err) throw err;
            const total = result[0].total;
            if ((result[0].total - (start)) < 10) {
                next = false;
            }
            if (start > 0) {
                prev = true
            }

            db.query(`SELECT id, firstname, lastname, email, role, country, city, district, DATE_FORMAT(created_at, '%D %M, %Y') AS joined FROM users WHERE role=? OR role=? AND district=? ORDER BY id DESC LIMIT ? OFFSET ?`, [ "manager", "agent", value, parseInt(limit), parseInt(start)], (err, result) => {
                if(err) throw err;
                res.json({ error: false, status: 200, table: { total, next, prev, staffs: result } })
                return;
            })
        })
    }
}

export const myworkers = async(req, res) => {
    let { start, limit, country, city } = req.query;
    let next = true;
    let prev = false;

    if (!start || !limit || !country || !city) {
        res.json({ error: true, status: 401, table: { total: 0, next: false, prev, staffs: [] } })
        return;
    }

    db.query(`SELECT COUNT(id) AS total FROM users WHERE role=? AND country=? AND city=?`, ["agent", country, city], (err, result) => {
        if (err) throw err;
        const total = result[0].total;
        if ((result[0].total - (start)) < 10) {
            next = false;
        }
        if (start > 0) {
            prev = true
        }

        db.query(`SELECT id, firstname, lastname, email, role, country, city, district, DATE_FORMAT(created_at, '%D %M, %Y') AS joined FROM users WHERE role=? AND country=? AND city=? ORDER BY id DESC LIMIT ? OFFSET ?`, ["agent", country, city, parseInt(limit), parseInt(start)], (err, result) => {
            if(err) throw err;
            res.json({ error: false, status: 200, table: { total, next, prev, staffs: result } })
            return;
        })
    })

}

export const getuser = async(req, res) => {
    let revenue, orders, customers;
    const profile = req.user;

    if (!profile) {
        res.json({})
        return;
    }

    if (profile.role == "customer") {
        res.json({ profile })
        return;
    }
    
    if (profile.role == "board" || profile.role == "manager" || profile.role == "agent") {
        db.query(`SELECT SUM(amount) AS revenue, COUNT(id) AS orderscount FROM orders`, [ ], (err, result) => {
            if(err) throw err;
            revenue = result[0].revenue;
            orders = result[0].orderscount;
            db.query(`SELECT COUNT(id) AS customers FROM users WHERE role=?`, [ "customer" ], (err, result) => {
                if(err) throw err;
                customers = result[0].customers;
                const metrics = {
                    revenue: revenue == null ? 0 : revenue,
                    orders: orders == null ? 0 : orders,
                    customers: customers == null ? 0 : customers
                }
                res.json({ profile, metrics })
                return;
            })
        })
    }
}

export const edituser = async(req, res) => {
    const { firstname, lastname, gender } = req.body;
    const { id } = req.query;
    const fullnameRegex = /^([a-zA-Z ]+)$/;

    if (!id) {
        res.json({ error: true, status: 401, message: "You are not logged in!"})
        return;
    }

    // check for empty fields
    if ( !firstname || !lastname || !gender ) {
        res.json({ error: true, status: 401, message: "Please, fill in all fields!"})
        return;
    }

    // check for fullname REGEX
    if (!fullnameRegex.test(firstname)) {
        res.json({ error: true, status: 401, message: "Firstname format not proper!"})
        return;
    }

    if (!fullnameRegex.test(lastname)) {
        res.json({ error: true, status: 401, message: "Lastname format not proper!"})
        return;
    }

    db.query("SELECT id FROM users WHERE id=? and role=?", [id, "customer"], (err, result) => {
        if (err) throw err;
        if (result.length < 1) {
            res.json({ error: true, status: 401, message: "No such user in our database!"})
            return;
        } else {
            db.query("UPDATE users SET firstname=?, lastname=?, gender=? WHERE id=?", [firstname, lastname, gender, id], (err, result) => {
                if(err) throw err;
                res.json({ error: false, status: 200, message: "successful! You have updated your profile!" })
                return;
            })
        }
    })

}

export const employuser = async(req, res) => {
    const { position, country, city } = req.body;
    const { userid } = req.params;

    if ( !position || !city || !country ) {
        res.json({ error: true, status: 401, message: "Please, fill in all fields!"})
        return;
    }

    db.query("SELECT id FROM users WHERE id=? and role=?", [userid, "customer"], (err, result) => {
        if (err) throw err;
        if (result.length < 1) {
            res.json({ error: true, status: 401, message: "No such user in our database!"})
            return;
        } else {
            db.query("UPDATE users SET role=?, country=?, city=? WHERE id=?", [position, country, city, userid], (err, result) => {
                if(err) throw err;
                res.json({ error: false, status: 200, message: "User successfully employed!" })
                return;
            })
        }
    })
}

export const promotestaff = async(req, res) => {
    const { position, country, city } = req.body;
    const { userid } = req.params;

    if ( !position || !city || !country ) {
        res.json({ error: true, status: 401, message: "Please, fill in all fields!"})
        return;
    }

    db.query("SELECT id FROM users WHERE id=?", [userid], (err, result) => {
        if (err) throw err;
        if (result.length < 1) {
            res.json({ error: true, status: 401, message: "No such user in our database!"})
            return;
        } else {
            db.query("UPDATE users SET role=?, country=?, city=? WHERE id=?", [position, country, city, userid], (err, result) => {
                if(err) throw err;
                res.json({ error: false, status: 200, message: "Staff has been promoted!" })
                return;
            })
        }
    })
}

export const sackstaff = async(req, res) => {
    const { userid } = req.params;
    console.log(userid)

    db.query("SELECT id FROM users WHERE id=?", [userid], (err, result) => {
        if (err) throw err;
        if (result.length < 1) {
            res.json({ error: true, status: 401, message: "No such user in our database!"})
            return;
        } else {
            db.query("UPDATE users SET role=? WHERE id=?", ["customer", userid], (err, result) => {
                if(err) throw err;
                res.json({ error: false, status: 200, message: "Staff has been fired!" })
                return;
            })
        }
    })
}