
//
//
// THIS FILE (dbservice.js) is the BackEnd with all the queries to the database
//
//

const mysql = require('mysql');
const dotenv = require('dotenv');
const res = require('express/lib/response');

let instance = null;
dotenv.config();

const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: process.env.DB_PORT
});

connection.connect((err) => {
    if (err) {
        console.log(err.message);
    }
    // console.log('db ' + connection.state);
});



class DbService {

    static getDbServiceInstance() {
        return instance ? instance : new DbService();
    }

    // this function gives us all the data from the database, later used in /getAllData api
    async getAllData() {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM employe;";

                connection.query(query, (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            });
            // console.log(response);
            return response;
        } catch (error) {
            console.log(error);
        }
    }


    // this function gives us all the CEOs from the database, later used in /getAllCeo api
    async getAllCeo() {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM employe WHERE isceo = 1;";

                connection.query(query, (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            });

            return response;
        } catch (error) {
            console.log(error);
        }
    }


    // this function gives us all the CEOs and Managers from the database, later used in /getAllCeoAndManagers api
    async getAllCeoAndManagers() {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM employe WHERE isceo = 1 OR ismanager = 1;";

                connection.query(query, (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            });

            return response;
        } catch (error) {
            console.log(error);
        }
    }


    // this function gives us all the Managers from the database, later used in /getAllManagers api
    async getAllManagers() {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM employe WHERE ismanager = 1;";

                connection.query(query, (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            });
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    // this function gives us all the managerIds from the database, later used in /getAllManageid api
    async getAllManageid() {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT managerid FROM employe;";

                connection.query(query, (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            });
            return response;
        } catch (error) {
            console.log(error);
        }
    }


    // this function inserts a new row in the database, later used in /insertNewName api
    async insertNewName(firstname, lastname, salary, isceo, ismanager, managerid) {
        try {
            const insertId = await new Promise((resolve, reject) => {
                const query = "INSERT INTO employe (firstname, lastname, salary, isceo, ismanager, managerid) VALUES (?,?,?,?,?,?);";

                connection.query(query, [firstname, lastname, salary, isceo, ismanager, managerid] , (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result);
                })
            });
            
           return {
                id : insertId,
                firstname : firstname,
                lastname : lastname,
                salary : salary,
                isceo : isceo,
                ismanager : ismanager,
                managerid : managerid
           };
        } catch (error) {
            console.log(error);
        }
    }

    // this function deletes a row in the database, later used in /deleteRowById api
    async deleteRowById(id) {
        try {
            id = parseInt(id, 10);
            const response = await new Promise((resolve, reject) => {
                const query = "DELETE FROM employe WHERE id = ?";
   
                connection.query(query, [id] , (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.affectedRows);
                })
            });
   
            return response === 1 ? true : false;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    // this function updates a row in the database, later used in /updateNameById api
    async updateNameById(id, firstname, isceo, ismanager) {
        try {
            id = parseInt(id, 10);
            const response = await new Promise((resolve, reject) => {
                const query = "UPDATE employe SET firstname = ?, isceo = ?, ismanager = ? WHERE id = ?";
   
                connection.query(query, [firstname, isceo, ismanager, id] , (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.affectedRows);
                })
            });
   
            return response === 1 ? true : false;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

}

module.exports = DbService;
