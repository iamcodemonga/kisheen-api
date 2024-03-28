import db from "../server.js";

export const fetchdiscount = async(req, res) => {
    db.query(`SELECT type, season, rate FROM discount`, [], (err, result) => {
        if(err) throw err;
        res.json(result[0])
        return;
    })
}

export const instructions = async(req, res) => {
    db.query(`SELECT cart, maintenance, cardpay, manualpay, closed FROM settings`, [], (err, result) => {
        if(err) throw err;
        res.json(result[0])
        return;
    })
}

export const setdiscount = async(req, res) => {
    const { type, season, rate } = req.body;

    db.query(`UPDATE discount SET type=?, season=?, rate=?`, [type, season, rate], (err, result) => {
        if(err) throw err;
        res.json({ error: false, status: 200, message: "discount info updated" })
        return;
    })
}

export const setinstructions = async(req, res) => {
    const { cart, maintenance, cardpayment, manualpayment } = req.body;

    db.query(`UPDATE settings SET cart=?, maintenance=?, cardpay=?, manualpay=?`, [cart, maintenance, cardpayment, manualpayment], (err, result) => {
        if(err) throw err;
        // console.log({ cart, maintenance, cardpayment, manualpayment });
        res.json({ error: false, status: 200, message: "settings updated" })
        return;
    })
}