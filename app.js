const container3 = document.querySelector("#container3");
const solarBtn0 = document.querySelector("#solarBtn0");
const solarBtn1 = document.querySelector("#solarBtn1");
const solarBtn2 = document.querySelector("#solarBtn2");
const solarBtn3 = document.querySelector("#solarBtn3");
let customSelects = document.querySelectorAll('.custom-select');
let bubbleW = 1300;
const bubbleH = 700;

let originalValue = 667.9646642157649;

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

        // BUBBLE CHART FOR DATA VIZ 3 GOES HERE
        //append svg for bubblechart

        let continentsObj = {
            "name": "continents",
            "children": [
                { "name": "Asia", "value": 0, "fossil": 0, "nuclear": 0, "renewable": 0, "children": [] },
                { "name": "Europe", "value": 0, "fossil": 0, "nuclear": 0, "renewable": 0, "children": [] },
                { "name": "North America", "value": 0, "fossil": 0, "nuclear": 0, "renewable": 0, "children": [] },
                { "name": "South America", "value": 0, "fossil": 0, "nuclear": 0, "renewable": 0, "children": [] },
                { "name": "Oceania", "value": 0, "fossil": 0, "nuclear": 0, "renewable": 0, "children": [] },
                { "name": "Africa", "value": 0, "fossil": 0, "nuclear": 0, "renewable": 0, "children": [] }
            ]
        }

        //populating continentsObj using CountryInsert.
        data.forEach(country => {
            let countryObj = new CountryInsert(country.continent,
                country.country,
                country.fossil_fuel + country.nuclear_electricity + country.renewable_electricity,
                country.renewable_electricity,
                country.nuclear_electricity,
                country.fossil_fuel);
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
                const renewable = continent.children.reduce((acc, country) => acc + country.renewable, 0);
                continent.renewable = renewable / continent.children.length;
                const nuclear = continent.children.reduce((acc, country) => acc + country.nuclear, 0);
                continent.nuclear = nuclear / continent.children.length;
                const fossil = continent.children.reduce((acc, country) => acc + country.fossil, 0);
                continent.fossil = fossil / continent.children.length;


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

        let simulation = d3.forceSimulation(continentsObj.children)
            .force("charge", d3.forceManyBody().strength(200)) // You might adjust the strength as needed
            .force("center", d3.forceCenter(bubbleW / 2, bubbleH / 2))
            .force("collision", d3.forceCollide().radius(d => bubbleScale(d.value) + 10).strength(1.2).iterations(32))
            .on("tick", ticked);

        // Create bubbles
        const bubbles = svg3.selectAll("circle")
            .data(continentsObj.children)
            .enter()
            .append("circle")
            .attr("id", d => {
                if (d.name === "Africa") {
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
            .style("font-weight", d => d.name === "Africa" ? "bold" : "")
            .style("fill", "#fff")
            .text(d => `${d.name}: ${Math.round(d.value)} kwh`);

        function ticked() {
            bubbles
                .attr("cx", d => d.x = Math.max(bubbleScale(d.value), Math.min(bubbleW - bubbleScale(d.value), d.x)))
                .attr("cy", d => d.y = Math.max(bubbleScale(d.value), Math.min(bubbleH - bubbleScale(d.value), d.y)))

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
            simulation.alpha(0.7).restart(); // Increase the 'heat' of simulation on drag
        }

        function dragended(event, d) {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
            simulation.force("collision", d3.forceCollide().radius(d => bubbleScale(d.value) + 5)); // Reapply collision with updated positions
        }


        function setEnergy(amount) {
            let africa = continentsObj.children.find(continent => continent.name === "Africa");
            if (africa) {
                africa.value = amount; // Set the value for Africa
            }
            // Temporarily stop the simulation to avoid conflicts during transition
            simulation.stop();

            labels.filter(d => d.name === "Africa")
                .text(d => `${d.name}: ${Math.round(d.value)} kWh`);
            // Update the radius of the Africa circle in the SVG with transition
            svg3.select("#africaCircle")
                .transition()
                .ease(d3.easeElastic)
                .duration(700)
                .attr("r", bubbleScale(africa.value))
                .on("end", () => {
                    // Restart the simulation after the transition completes
                    simulation.nodes(continentsObj.children).alpha(1).restart();
                });

            // Manually update the collision radius for all nodes in the simulation
            simulation.force("collision", d3.forceCollide().radius(d => bubbleScale(d.value) + 5));

            // Optionally, manually trigger the tick function to update positions immediately
            simulation.alpha(1).restart();
        }



        solarBtn0.addEventListener("click", () => {
            return setEnergy(originalValue)
        })
        solarBtn1.addEventListener("click", () => {
            return setEnergy(521.55 + originalValue)
        })
        solarBtn2.addEventListener("click", () => {
            return setEnergy(1043.1 + originalValue)
        })
        solarBtn3.addEventListener("click", () => {
            return setEnergy(2086.2 + originalValue)
        })


    })
    .catch(error => {
        console.error('Error:', error);
    });


function CountryInsert(continent, country, totalEnergy, renewable, nuclear, fossil) {
    this.continent = continent;
    this.name = country;
    this.value = totalEnergy; // This is important for D3 packing
    this.renewable = renewable;
    this.nuclear = nuclear;
    this.fossil = fossil;
}
