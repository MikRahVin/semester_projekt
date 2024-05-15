const container1 = document.querySelector("#contianer1");
const container2 = document.querySelector("#contianer2");
const container3 = document.querySelector("#contianer3");


let dataset = [32, 63, 81, 5, 18, 9, 54, 56, 34, 24,]


const w = 700;
const h = 450;
const pad = 40;
let dur = 800

const bubbbleW = 1000;
const bubbleH = 700;



// appending svg element to container1
const svg1 = d3.select("#container1")
    .append("svg")
    .attr("width", w)
    .attr("height", h);











































// appending svg element to container2
const svg2 = d3.select("#container2")
    .append("svg")
    .attr("width", w)
    .attr("height", h);




































// appending svg element to container3







// DO NOT TOUCH BELOW HERE
const apiUrl = 'http://localhost:4000/energy'


fetch(apiUrl)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log(data)

        let energyObjects = [];
        for (let i in data) {
            let energy = new Energy(
                data[i].fossil_fuel,
                data[i].nuclear_electricity,
                data[i].renewable_electricity,
                data[i].fossil_fuel + data[i].nuclear_electricity + data[i].renewable_electricity,
                data[i].country,
                data[i].access_pct
            );
            energyObjects.push(energy);
        }
        console.log(energyObjects)
        // her skal kode skrives



        //GRAPH/CHART FOR DATA VIZ 1 GOES HERE











































        //GRAPH/CHART FOR DATA VIZ 2 GOES HERE







































        // BUBBLE CHART FOR DATA VIZ 3 GOES HERE
        //append svg for bubblechart

        let continentsObj = {
            "name": "continents",
            "children": [{
                "name": "Africa",
                "value": "",
                "countries": [

                ]
            },
            {
                "name": "Asia",
                "value": "",
                "countries": [

                ]
            },
            {
                "name": "Europe",
                "value": "",
                "countries": [

                ]
            },
            {
                "name": "North America",
                "value": "",
                "countries": [

                ]
            },
            {
                "name": "South America",
                "value": "",
                "countries": [

                ]
            },
            {
                "name": "Oceania",
                "value": "",
                "countries": [

                ]
            }
            ]
        }

     //populating continentsObj using CountryInsert.
        data.forEach(country => {
            // Calculate total energy and renewable energy
            let totalEnergy = country.fossil_fuel + country.nuclear_electricity + country.renewable_electricity;
            let renewable = country.renewable_electricity;
    
            // Create a new CountryInsert object
            let countryObj = new CountryInsert(country.continent, country.country, totalEnergy, renewable);
    
            // Find the right continent and add the country
            let continentFound = continentsObj.children.find(continent => continent.name === country.continent);
            if (continentFound) {
                continentFound.countries.push(countryObj);
            }
        });


     console.log(continentsObj)




        const svg3 = d3.select("#container3")
            .append("svg")
            .attr("width", bubbbleW)
            .attr("height", bubbleH);





    })
    .catch(error => {
        console.error('Error:', error);
    });

function Energy(fossil, nuclear, renewable, total, country, access) {
    this.fossil = fossil;
    this.nuclear = nuclear;
    this.renewable = renewable;
    this.total = total;
    this.country = country;
    this.access = access;
}

function CountryInsert(continent, country, totalEnergy, renewable){
    this.continent = continent;
    this.country = country;
    this.totalEnergy = totalEnergy;
    this.renewable = renewable; 
}