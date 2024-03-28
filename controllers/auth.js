import db from "../server.js";
import bcrypt from "bcrypt";

export const register = async(req, res) => {
    let { firstname, lastname, email, password } = req.body;
    let nameRegex = /^([a-zA-Z ]+)$/;
    let emailRegex = /^([a-zA-Z0-9\.\-_]+)@([a-zA-Z0-9\-]+)\.([a-z]{2,10})(\.[a-z]{2,10})?$/;

    // check for empty fields
    if (!firstname || !lastname || !email || !password) {
        res.json({ error: true, status: 401, message: "please, fill in all fields!"});
        return;
    }

    // check for firstname REGEX
    if (!nameRegex.test(firstname)) {
        res.json({ error: true, status: 401, message: "first name format not proper!"})
        return;
    }

    // check for lastname REGEX
    if (!nameRegex.test(lastname)) {
        res.json({ error: true, status: 401, message: "last name format not proper!"})
        return;
    }

    // check for email REGEX
    if (!emailRegex.test(email)) {
        res.json({ error: true, status: 401, message: "email format not proper!"})
        return;
    }

    email = email.toLowerCase().replace(/ /g, "_");
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt)

    db.query("SELECT email FROM users WHERE email=?", [email], (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
            res.json({ error: true, status: 401, message: "email address already exists!"})
            return;
        } else{
            const INSERTQUERY = `INSERT INTO users (firstname, lastname, email, role, password, bonuslevel, created_at)
            VALUES (?, ?, ?, ?, ?, ?, NOW());`;

            db.query(INSERTQUERY, [firstname, lastname, email, 'customer', hashedPassword, 0], (err, result) => {
                if (err) throw err;
                res.json({ error: false, status: 200, message: "Your account was created successfully!", user: result[0]})
            })
            return;
        }
    })
}

export const login = async(req, res) => {
    let { email, password } = req.body;
    let emailRegex = /^([a-zA-Z0-9\.\-_]+)@([a-zA-Z0-9\-]+)\.([a-z]{2,10})(\.[a-z]{2,10})?$/;

    //check for already existing user (via email)
    let checkPass = async(inputed, real) => {
        let bool = await bcrypt.compare(inputed, real);
        return bool;
    }

    // check for empty fields
    if (!email || !password) {
        res.json({ error: true, status: 401, message: "Please, fill in all fields!"})
        return;
    }

    // check for username REGEX
    if (!emailRegex.test(email)) {
        res.json({ error: true, status: 401, message: "Email format not proper!"})
        return;
    }

    email = email.toLowerCase().replace(/ /g, "_");

    db.query("SELECT id, firstname, lastname, email, role, password, bonuslevel FROM users WHERE email=?", [email], async(err, result) => {
        if (err) throw err;
        if (result.length < 1) {
            res.json({ error: true, status: 401, message: "User does not exist!"})
            return;
        }
        if (await checkPass(password, result[0].password) === false) {
            res.json({ error: true, status: 401, message: "Email or password is incorrect!"})
            return;
        }
        res.json({ error: false, status: 200, message: "Welcome back!", user: result[0] })
        return;
    });
}