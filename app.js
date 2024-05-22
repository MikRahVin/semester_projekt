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
const margin = {top: 20, right: 180, bottom: 30, left: 50},
      width = 800 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

// Append the svg object to the body of the page
const svg = d3.select("#container1")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Parse the Year / time
const parseTime = d3.timeParse("%Y");

// Load the CSV file
d3.csv("electricity_access.csv").then(data => {
  data.forEach(d => {
    d.Year = parseTime(d.Year);
    d.Value = +d.Value;
  });

  // Extract unique countries and years for the dropdowns
  const countries = Array.from(new Set(data.map(d => d.Country)));
  const years = Array.from(new Set(data.map(d => d.Year.getFullYear())));

  // Populate the country dropdown
  const countrySelect = d3.select("#countrySelect");
  countrySelect.selectAll("option")
    .data(countries)
    .enter()
    .append("option")
    .text(d => d);

  // Populate the year dropdown
  const yearSelect = d3.select("#yearSelect");
  yearSelect.selectAll("option")
    .data(years)
    .enter()
    .append("option")
    .text(d => d);

  // Function to update the chart
  function updateChart(country) {
    // Filter data for the selected country
    const filteredData = data.filter(d => d.Country === country);

    // Check if filtered data is empty
    if (filteredData.length === 0) {
      console.log("No data for the selected country");
      return;
    }

    // Set the ranges
    const x = d3.scaleTime().range([0, width]);
    const y = d3.scaleLinear().range([height, 0]);

    // Define the area
    const area = d3.area()
      .x(d => x(d.Year))
      .y0(height)
      .y1(d => y(d.Value));

    // Scale the range of the data
    x.domain(d3.extent(filteredData, d => d.Year));
    y.domain([0, d3.max(filteredData, d => d.Value)]);

    // Remove any existing path
    svg.selectAll(".area").remove();

    // Add the area path
    svg.append("path")
      .data([filteredData])
      .attr("class", "area")
      .attr("d", area)
      .style("fill", "steelblue");

    // Add the X Axis
    svg.selectAll(".x-axis").remove();
    svg.append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x));

    // Add the Y Axis
    svg.selectAll(".y-axis").remove();
    svg.append("g")
      .attr("class", "y-axis")
      .call(d3.axisLeft(y));
  }

  // Event listener for country dropdown
  countrySelect.on("change", () => {
    const selectedCountry = countrySelect.node().value;
    updateChart(selectedCountry);
  });

  // Initial chart update
  updateChart(countries[0]);
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
            let countryObj = new CountryInsert(country.continent, 
                country.country, 
                country.fossil_fuel + country.nuclear_electricity + country.renewable_electricity, 
                country.renewable_electricity);
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
            .force("charge", d3.forceManyBody().strength(200))  
            .force("center", d3.forceCenter(bubbleW / 2, bubbleH / 2))
            .force("collision", d3.forceCollide(d => d.radius + 5)
                .radius(d => bubbleScale(d.value)) 
                .strength(0.2)  
                .iterations(16))
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
            .attr("fill", d => d.name === "Africa" ? "steelblue" : "#c4c4c4")
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

function Energy(fossil, nuclear, renewable, total, country, continent, access) {
    this.fossil = fossil;
    this.nuclear = nuclear;
    this.renewable = renewable;
    this.total = total;
    this.country = country;
    this.continent = continent;
    this.access = access;
}

function CountryInsert(continent, country, totalEnergy, renewable) {
    this.continent = continent;
    this.name = country;
    this.value = totalEnergy; // This is important for D3 packing
    this.renewable = renewable;
}
