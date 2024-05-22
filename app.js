const container1 = document.querySelector("#contianer1");
const container2 = document.querySelector("#contianer2");
const container3 = document.querySelector("#contianer3");
const solarBtns = document.querySelectorAll(".solarBtn");



let customSelects = document.querySelectorAll('.custom-select');
 
// Attach click event listeners to each custom select
customSelects.forEach(function (select) {
    let selectSelected = select.querySelector('.select-selected');
    let selectItems = select.querySelector('.select-items');
    let options = selectItems.querySelectorAll('div');
 
    // Toggle the dropdown visibility when the select box is clicked
    selectSelected.addEventListener('click', function () {
        if (selectItems.style.display === 'block') {
            selectItems.style.display = 'none';
        } else {
            selectItems.style.display = 'block';
        }
    });
 
    // Set the selected option and hide the dropdown when an option is clicked
    options.forEach(function (option) {
        option.addEventListener('click', function () {
            selectSelected.textContent = option.textContent;
            selectItems.style.display = 'none';
        });
    });
 
    // Close the dropdown if the user clicks outside of it
    window.addEventListener('click', function (e) {
        if (!select.contains(e.target)) {
            selectItems.style.display = 'none';
        }
    });
});



let dataset = [32, 63, 81, 5, 18, 9, 54, 56, 34, 24,]


const w = 700;
const h = 450;
const pad = 40;
let dur = 800

let bubbleW = window.innerWidth * 0.75;
const bubbleH = 800;




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




        //GRAPH/CHART FOR DATA VIZ 1 GOES HERE











































        //GRAPH/CHART FOR DATA VIZ 2 GOES HERE







































        // BUBBLE CHART FOR DATA VIZ 3 GOES HERE
        //append svg for bubblechart

        let continentsObj = {
            "name": "continents",
            "children": [
                { "name": "Africa", "value": 0, "children": [] },
                { "name": "Asia", "value": 0, "children": [] },
                { "name": "Europe", "value": 0, "children": [] },
                { "name": "North America", "value": 0, "children": [] },
                { "name": "South America", "value": 0, "children": [] },
                { "name": "Oceania", "value": 0, "children": [] },
            ]
        }

        //populating continentsObj using CountryInsert.
        data.forEach(country => {
            let totalEnergy = country.fossil_fuel + country.nuclear_electricity + country.renewable_electricity;
            let renewable = country.renewable_electricity;
            let countryObj = new CountryInsert(country.continent, country.country, totalEnergy, renewable);
            let continentFound = continentsObj.children.find(continent => continent.name === country.continent);
            if (continentFound) {
                continentFound.children.push(countryObj);
            }
        });

        console.log(continentsObj)

        continentsObj.children.forEach(continent => {
            if (continent.children.length > 0) {
                const total = continent.children.reduce((acc, country) => acc + country.value, 0);
                continent.value = total / continent.children.length;
            }
        });

        const svg3 = d3.select("#container3")
            .append("svg")
            .attr("width", bubbleW)
            .attr("height", bubbleH);

        // Create a scale for your bubbles
        const bubbleScale = d3.scaleSqrt()
            .domain([0, d3.max(continentsObj.children, d => d.value)])
            .range([10, 200]);

            const simulation = d3.forceSimulation(continentsObj.children)
            .force("charge", d3.forceManyBody().strength(100))  // Repulsive force, adjust as needed
            .force("center", d3.forceCenter(bubbleW / 2, bubbleH / 2))
            .force("collision", d3.forceCollide(30)
                .radius(d => bubbleScale(d.value))  // Set radius exactly to scaled value
                .strength(0.7)  // Maximum strength to ensure separation
                .iterations(16))  // Increase iterations for more accurate simulation
            .on("tick", ticked);
        
        // Create bubbles
        const bubbles = svg3.selectAll("circle")
            .data(continentsObj.children)
            .enter()
            .append("circle")
            .attr("id", d => {
                if(continentsObj.children.name === "Africa"){
                    return "africaCircle"
                }
            })
            .attr("r", d => bubbleScale(d.value))
            .attr("cx", bubbleW / 2)  // Temporarily set to center
            .attr("cy", bubbleH / 2)  // Temporarily set to center
            .attr("fill", d => d.name === "Africa" ? "#46bceb" : "#c4c4c4")
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));


        const labels = svg3.selectAll("text")
            .data(continentsObj.children)
            .enter().append("text")
            .attr("x", d => d.x)
            .attr("y", d => d.y)
            .attr("text-anchor", "middle")
            .style("fill", "#fff")
            .text(d => d.name);

        function ticked() {
            bubbles
                .attr("cx", d => d.x = Math.max(bubbleScale(d.value), Math.min(bubbleW - bubbleScale(d.value), d.x)))
                .attr("cy", d => d.y = Math.max(bubbleScale(d.value), Math.min(bubbleH - bubbleScale(d.value), d.y)));

            labels
                .attr("x", d => d.x)
                .attr("y", d => d.y);
        }

        function dragstarted(event, d) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(event, d) {
            d.fx = event.x;
            d.fy = event.y;
        }

        function dragended(event, d) {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }


        svg3.select("#africaCircle")
        .transition()
        .duration(1000)
        .attr("r", 20)


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

function CountryInsert(continent, country, totalEnergy, renewable) {
    this.continent = continent;
    this.name = country;
    this.value = totalEnergy; // This is important for D3 packing
    this.renewable = renewable;
}
