
/*Creating energy_tmp that gets populated using postman */
CREATE TABLE energy_tmp(
Entity text,
Code text,
Year int,
Fossil_fuel float,
Nuclear_electricity float,
Renewable_electricity float)


/* Creating and populating countries table */

CREATE TABLE countries(
country_id SERIAL unique primary key,
country varchar(100) NOT NULL)

INSERT INTO countries(country)
   SELECT DISTINCT entity
   FROM energy_tmp;


/* Creating and populating years table */
CREATE TABLE years(
year_id SERIAL unique primary key,
year int NOT NULL)

INSERT INTO years(year)
	SELECT DISTINCT yeaer
	FROM energy_tmp


/* creating and populating table energy_mix */
CREATE TABLE energy_mix(
mix_id SERIAL UNIQUE PRIMARY KEY, 
country_id INT NOT NULL REFERENCES countries(country_id), 
year_id INT NOT NULL REFERENCES yearS(year_id), 
fossil_fuel FLOAT, 
nuclear_electricity FLOAT, 
renewable_electricity FLOAT)



INSERT INTO energy_mix (country_id, year_id, fossil_fuel, nuclear_electricity, renewable_electricity)
SELECT 
    c.country_id,
    y.year_id,
    e.Fossil_fuel,
    e.Nuclear_electricity,
    e.Renewable_electricity
FROM 
    energy_tmp e
JOIN 
    countries c ON e.Entity = c.country
JOIN 
    years y ON e.Year = y.year;


/* creating a view over continents*/
CREATE VIEW continent_mix AS
SELECT c.country AS continent, y.year, em.fossil_fuel, em.nuclear_electricity, em.renewable_electricity
FROM energy_mix  AS em
JOIN countries AS c ON em.country_id = c.country_id
JOIN years AS y ON em.year_id = y.year_id 
WHERE c.country LIKE 'Africa'
OR c.country LIKE 'Asia'
OR c.country LIKE 'North America'
OR c.country LIKE 'South America'
OR c.country LIKE 'Oceania'
OR c.country LIKE 'Europe'
OR c.country LIKE 'World'
ORDER BY c.country;