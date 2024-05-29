const { Pool } = require("pg");
require("dotenv").config();
const csvtojson = require("csvtojson");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

//route for /foods
const getEnergy = (request, response) => {
    pool.query("SELECT * FROM continent_mix", (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    });
  };

  //route for /insert-food
const insertEnergy = (request, response) => {
    const { Entity, Code, Year, Access_percentage } = request.body;
    pool.query(
      `INSERT INTO access_tmp (Entity, Code, Year, Access_percentage) VALUES ($1, $2, $3, $4)`,
      [Entity, Code, Year, Access_percentage],
      (error, results) => {
        if (error) {
          throw error;
        }
        response.status(201).send(`Energy added`);
      }
    );
  };

  //route for /populateFoods
const populateEnergy = (request, response) => {
    const energydata = "electricity_access.csv"; 
    const options = {
        delimiter: ';'
      };

    csvtojson().fromFile(energydata, options).then(source => {
        //Fetching the data from each row
        //and inserting to the table food_tmp
        for (var i = 0; i < source.length; i++) {
            var Entity = source[i].Entity, 
            Code = source[i].Code, 
            Year = source[i].Year,
            Access_percentage = source[i].Access_percentage;
            //TODO: fortsæt med de andre kolonner
    
            //TODO: her skal laves to variabler: insertStatement og items. 
            //insertStatement skal bestå af sådan som du vil indsætte data i food_tmp tabellen, men med 
            //placeholders $1, $2 osv i stedet for værdier
            //items er en array med de variabler der er blevet defineret ud fra vores data lige ovenover
            let insertStatement = `INSERT INTO access_tmp (Entity, Code, Year, Access_percentage) VALUES ($1, $2, $3, $4)`;
            let items = [Entity, Code, Year, Access_percentage]

            //Inserting data of current row into database
            pool.query(insertStatement, items, (err, results, fields) => {
                if (err) {
                    console.log("Unable to insert item at row " + i+1);
                    return console.log(err);
                }
            });
        }
        response.status(201).send('All energy added');
    })
  }

module.exports = {
  getEnergy, 
  insertEnergy,
  populateEnergy
};



//  In the context of parameterized queries using the pg library in Node.js, the placeholders are represented by $1, $2, and so on, instead of using ${name} syntax
// The reason for this difference is that the $1, $2 syntax is specific to the pg library and the PostgreSQL query protocol. It is used to bind parameters securely and efficiently in the query.
// When using parameterized queries with the pg library, you pass the actual values as an array in the second parameter of the query() function. The library internally maps these values to the corresponding placeholders in the SQL query string based on their position in the array.
// Therefore, in the given code snippet, you should continue using $1, $2, and $3 placeholders to represent the variables name, email, and id, respectively, instead of using the ${name} syntax.