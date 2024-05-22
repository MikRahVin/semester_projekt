const container1 = document.querySelector("#contianer1");
const container2 = document.querySelector("#contianer2");
const container3 = document.querySelector("#contianer3");
const solarBtn1 = document.querySelector("#solarBtn1");
const solarBtn2 = document.querySelector("#solarBtn2");
const solarBtn3 = document.querySelector("#solarBtn3");




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

 // Set the dimensions and margins of the graph
 const margin = {top: 40, right: 180, bottom: 30, left: 50},
 width = 800 - margin.left - margin.right,
 height = 400 - margin.top - margin.bottom;

// Append the svg object to the body of the page
const svg = d3.select("#container1")
.append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform", `translate(${margin.left},${margin.top})`);

// Add title to the chart
svg.append("text")
.attr("x", (width / 2))
.attr("y", -20)
.attr("class", "chart-title")
.text("Electricity Access Over Time: World vs Sub-Saharan Africa");

// Parse the Year / time
const parseTime = d3.timeParse("%Y");

// Load the CSV file
d3.csv("electricity_access.csv").then(data => {
data.forEach(d => {
d.Year = parseTime(d.Year);
d.Value = +d.Value;
});

// Filter data for "World" and "Sub-Saharan Africa"
const worldData = data.filter(d => d.Country === "World");
const subSaharanAfricaData = data.filter(d => d.Country === "Sub-Saharan Africa");

// Check if filtered data is empty
if (worldData.length === 0 || subSaharanAfricaData.length === 0) {
console.log("No data for 'World' or 'Sub-Saharan Africa'");
return;
}

// Set the ranges
const x = d3.scaleTime().range([0, width]);
const y = d3.scaleLinear().range([height, 0]);

// Define the line
const line = d3.line()
.x(d => x(d.Year))
.y(d => y(d.Value));

// Scale the range of the data based on filtered data
x.domain([
d3.min([d3.min(worldData, d => d.Year), d3.min(subSaharanAfricaData, d => d.Year)]),
d3.max([d3.max(worldData, d => d.Year), d3.max(subSaharanAfricaData, d => d.Year)])
]);
y.domain([0, d3.max([d3.max(worldData, d => d.Value), d3.max(subSaharanAfricaData, d => d.Value)])]);

// Create tooltip div
const tooltip = d3.select("#tooltip");

// Function to handle mouseover event
function handleMouseOver(event, d, country, data) {
const [mx, my] = d3.pointer(event);
const xDate = x.invert(mx);
const bisectDate = d3.bisector(d => d.Year).left;
const i = bisectDate(data, xDate, 1);
const d0 = data[i - 1];
const d1 = data[i];
const dNearest = xDate - d0.Year > d1.Year - xDate ? d1 : d0;

tooltip.transition().duration(200).style("opacity", .9);
tooltip.html(`${country}<br>Year: ${d3.timeFormat("%Y")(dNearest.Year)}<br>Value: ${dNearest.Value}`)
 .style("left", (event.pageX + 5) + "px")
 .style("top", (event.pageY - 28) + "px");
}

// Function to handle mouseout event
function handleMouseOut(event, d) {
tooltip.transition().duration(500).style("opacity", 0);
}

// Add the line path for "World"
svg.append("path")
.datum(worldData)
.attr("class", "line")
.attr("d", line)
.style("stroke", "steelblue")
.on("mousemove", (event, d) => handleMouseOver(event, d, "World", worldData))
.on("mouseout", handleMouseOut);

// Add the line path for "Sub-Saharan Africa"
svg.append("path")
.datum(subSaharanAfricaData)
.attr("class", "line")
.attr("d", line)
.style("stroke", "red")
.on("mousemove", (event, d) => handleMouseOver(event, d, "Sub-Saharan Africa", subSaharanAfricaData))
.on("mouseout", handleMouseOut);

// Add the X Axis
svg.append("g")
.attr("class", "x-axis")
.attr("transform", `translate(0,${height})`)
.call(d3.axisBottom(x));

// Add the Y Axis
svg.append("g")
.attr("class", "y-axis")
.call(d3.axisLeft(y));

// Add legend
svg.append("text")
.attr("x", width + 10)
.attr("y", 20)
.attr("class", "legend")
.style("fill", "steelblue")
.text("World");

svg.append("text")
.attr("x", width + 10)
.attr("y", 40)
.attr("class", "legend")
.style("fill", "red")
.text("Sub-Saharan Africa");
}).catch(error => {
console.error("Error loading the CSV file:", error);
});






































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
                if(d.name === "Africa"){
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



        function addEnergy(amount){
        svg3.select("#africaCircle")
        .transition()
        .duration(3000)
        .attr("r",d => bubbleScale(d.value + amount))
    }

    solarBtn1.addEventListener("click", () => {
        console.log("hello")
        return addEnergy(500)
    })
    solarBtn2.addEventListener("click", () => {
        console.log("hello")
        return addEnergy(1000)
    })
    solarBtn3.addEventListener("click", () => {
        console.log("hello")
        return addEnergy(1500)
    })

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
