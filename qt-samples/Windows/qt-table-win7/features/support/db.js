const { Util } = require('leanpro.common');
const mysql = require('leanpro.mysql');

function _connect(user = "sa", password = "root", database = "") {
    let connectionSetting = {
        "host": "localhost",
        "user": user,
        "password": password,
        "database": database,
        "insecureAuth": true
    }
    return mysql.createConnection(connectionSetting);
}
async function query(queryString, queryData = [], conn) {
    if (!conn)
        conn = _connect();
    try {
        let res = null;
        if (!queryData) {
            res = await mysql.query(conn, queryString);
        }
        else {
            res = await mysql.query(conn, queryString, queryData);
        }

        return res;
    }
    catch (err) {
        throw err;
    }
    finally {
        conn.end();
    }
}

async function createTable(autoRemove = false) {
    if (autoRemove) {
        try {
            removeString = "DROP TABLE `qt`.`spreadsheet`;"
            await query(removeString);
            console.log("Success remove table!")
        }
        catch (err) {
            console.warn("The table was removed.");
            console.log(e)
        }
    }

    await Util.delay(1000);
    let createString = `CREATE TABLE qt . spreadsheet ( 
        Item varchar(50) NOT NULL,
        Date varchar(50) DEFAULT NULL,
        Price float DEFAULT NULL,
        Currency varchar(10) DEFAULT NULL,
        ExRate float DEFAULT NULL,
        NOK float DEFAULT NULL,
        PRIMARY KEY (Item)
    ) ENGINE = InnoDB DEFAULT CHARSET= utf8 COLLATE= utf8_bin`;
    await query(createString);
    console.log("Success create table!")
}

exports.query = query;
exports.createTable = createTable;