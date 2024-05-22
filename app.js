const container1 = document.querySelector("#contianer1");
const container2 = document.querySelector("#contianer2");
const container3 = document.querySelector("#contianer3");


let dataset = [32, 63, 81, 5, 18, 9, 54, 56, 34, 24,]


const w = 700;
const h = 450;
const pad = 40;
let dur = 800

const bubbleW = 800;
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
            "children": [{
                "name": "Africa",
                "value": "",
                "children": [

                ]
            },
            {
                "name": "Asia",
                "value": "",
                "children": [

                ]
            },
            {
                "name": "Europe",
                "value": "",
                "children": [

                ]
            },
            {
                "name": "North America",
                "value": "",
                "children": [

                ]
            },
            {
                "name": "South America",
                "value": "",
                "children": [

                ]
            },
            {
                "name": "Oceania",
                "value": "",
                "children": [

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
                continentFound.children.push(countryObj);
            }
        });


        console.log(continentsObj)


        continentsObj.children.forEach(continent => {
            const total = continent.children.reduce((acc, country) => acc + country.value, 0);
            const average = total / continent.children.length;
            continent.value = average;
        });


        const format = d3.format(",d");

        const color = d3.scaleOrdinal(d3.schemeCategory10);

        const pack = data => d3.pack()
            .size([bubbleW, bubbleH]) // Check if these variables are defined correctly as bubbleW and bubbleH
            .padding(3)
            (d3.hierarchy(data)
                .sum(d => d.value) // Make sure every node has a 'value' field
                .sort((a, b) => b.value - a.value));


                

        const root = pack(continentsObj);
        let focus = root;
        let view;

        console.log("Root values:", root.x, root.y, root.r); // Check these values


        const svg3 = d3.select("#container3").append("svg")
            .attr("viewBox", `-${bubbleW / 2} -${bubbleH / 2} ${bubbleW} ${bubbleH}`)
            .style("display", "block")
            .style("margin", "0 -14px")
            .style("background", "white")
            .style("cursor", "pointer")
            .on("click", (event) => zoom(event, root));

            
            const node = svg3.append("g")
                .selectAll("circle")
                .data(root.descendants().slice(1))
                .join("circle")
                .attr("fill", d => {
                    if (d.depth === 1 && d.data.name === "Africa") {
                        return "#64a4ce";
                    } else if (d.depth === 2 && d.parent.data.name === "Africa") {
                        return "#b7d7ea"
                    } else if (d.depth === 1) {
                        return "#b4b4b4";
                    } else {
                        return "#d6d6d6";
                    }
                })
                .attr("pointer-events", d => !d.children ? "none" : null)
                .on("mouseover", function () { d3.select(this).attr("stroke", d => {
                    if (d.depth === 1 && d.data.name === "Africa"){
                        return "#274c77"
                    } else {
                        return "#5c5c5c"
                    }
                }); })
                .on("mouseout", function () { d3.select(this).attr("stroke", null); })
                .on("click", (event, d) => focus !== d && (zoom(event, d), event.stopPropagation()));

        const label = svg3.append("g")
            .style("font-size", "13px")
            .attr("pointer-events", "none")
            .attr("text-anchor", "middle")
            .selectAll("text")
            .data(root.descendants())
            .join("text")
            .style("fill", d =>{
                if (d.depth === 1 && d.data.name === "Africa") {
                    return "#274c77";
                } else if (d.depth === 2 && d.parent.data.name === "Africa") {
                    return "#274c77"
                } else {
                    return "#5c5c5c";
                } 
            })
            .style("fill-opacity", d => d.parent === root ? 1 : 0)
            .style("display", d => d.parent === root ? "inline" : "none")
            .text(d => d.data.name);

        zoomTo([root.x, root.y, root.r * 2]);

        function zoomTo(v) {
            const k = bubbleW / v[2];

            view = v;

            label.attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
            node.attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
            node.attr("r", d => d.r * k);
        }

        function zoom(event, d) {
            const focus0 = focus;

            focus = d;

            const transition = svg3.transition()
                .duration(event.altKey ? 7500 : 750)
                .tween("zoom", d => {
                    const i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2]);
                    return t => zoomTo(i(t));
                });

            label
                .filter(function (d) { return d.parent === focus || this.style.display === "inline"; })
                .transition(transition)
                .style("fill-opacity", d => d.parent === focus ? 1 : 0)
                .on("start", function (d) { if (d.parent === focus) this.style.display = "inline"; })
                .on("end", function (d) { if (d.parent !== focus) this.style.display = "none"; });
        }



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
/* 
function CountryInsert(continent, country, totalEnergy, renewable){
    this.continent = continent;
    this.country = country;
    this.totalEnergy = totalEnergy;
    this.renewable = renewable; 
} */

function CountryInsert(continent, country, totalEnergy, renewable) {
    this.continent = continent;
    this.name = country;
    this.value = totalEnergy; // This is important for D3 packing
    this.renewable = renewable;
}