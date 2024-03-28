import db from "../server.js";

export const isLoggedIn = async(req, res, next) => {
    const { email } = req.query;

    if (email){
        try {
            db.query(`SELECT id, firstname, lastname, email, role, country, city, district, gender, bonuslevel FROM users WHERE email = ?`, [email], (error, result) => {
                if (error) throw error;
                if (!result) {
                    return next();
                }
                req.user = result[0];
                return next();
            })
        } catch (error) {
            console.log(error);
        }

    } else {
        next();
    }

}