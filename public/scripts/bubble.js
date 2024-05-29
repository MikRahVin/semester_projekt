//declaring all the elements that we are going to refer to later in the script ad variables. We''re using .queryselector to find the elements in our html page.
const apiUrl = 'http://localhost:4000/energy';
const container3 = document.querySelector("#container3");
const solarBtn0 = document.querySelector("#solarBtn0");
const solarBtn1 = document.querySelector("#solarBtn1");
const solarBtn2 = document.querySelector("#solarBtn2");
const solarBtn3 = document.querySelector("#solarBtn3");
let customSelects = document.querySelectorAll('.custom-select');

// declaring height and width of our data visualization as variables, so that if we want to change them, we only need to change the values here.
let bubbleW = 1300;
const bubbleH = 600;

//declaring original average amount of electricity generated per capita kwh for Africa
let originalValue = 667.9646642157649;


// GIVING FUNCTONALITY TO OUR CUSTOM DROPDOWNS
// Attach click event listeners to each custom selector
customSelects.forEach(function (select) {
    let selectSelected = select.querySelector('.select-selected');
    let selectItems = select.querySelector('.select-items');
    let options = selectItems.querySelectorAll('div');

    // Toggle the dropdown visibility when the select box is clicked.
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


// Fetching data from our Database

fetch(apiUrl)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log(data)

        
// definign continentsObj. It's defining an object with a property called children. Children holds an array of objects of each continent.
// Each continent also has a property called children, which holds objects of each country that lies within that continent.
// The continents objects holds the average values for each electricity types for their respective countries.
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

// using forEach() to loop over every country in our data and then instantiating our constructor function CountryInsert(it's defined in the bottom of the document.)
//Each instantation is declared as a variable called countryObj. We're then allocating the countries to each of their respective continents.
// the logic used: we're using .find to check if the continent.name in continentsObj matches the continent name for the country. If true, then the path to that given continent object
// gets declared as a variable called continentFound. We're then pushing our countryObj to continentfound.children.
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

//loggin continentsObj to make sure that it's working
        console.log(continentsObj)

//Here we're calculating average electricity generated per capita for each continent. We're using a forEach loop over continentsObj to automate the process. 
// We're delcating 4 variables, one for each electricity type and the total of them all. If we look at renewable, then we're using .reduce on continent.children. 
//it adds up all the renewable electricity values for each country into our accumalator. Then we're defining continent.renewable to renewable divided with 
//continent.children.length to find the average. This process is repeated for each electricity type and each continent.
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



    
// Declaring our svg for the bubble chart. The height and width is set to be our variables that we declaring in the top of our script
        const svg3 = d3.select("#container3")
            .append("svg")
            .attr("width", bubbleW)
            .attr("height", bubbleH);


//using scaleSqrt so that the value is displayed as the area of the circles
//creating a scale for our bubble chart where the domain goes from 0 up to the maximum avereage total electricity generated per capita.
// then we're delcaring the range to be from 10 to 200 to make it easier to work with.
        const bubbleScale = d3.scaleSqrt()
            .domain([0, d3.max(continentsObj.children, d => d.value)])
            .range([10, 175]);


//using foreSimulation to get collision between our continent bubbles. 
//.force charge is the repulsive effect betwee nthe bubbles.
//.force center
//.force collision This is where the magic heppens. We're defining the radius of each continent bubbles. Then we're defining the strength of the repulsion and then how
//many times we're iterating to make the animation smooth.
//.on tick is defined later in the script. But essentially it makes sure that, we keep updating the animation.
        let simulation = d3.forceSimulation(continentsObj.children)
            .force("charge", d3.forceManyBody().strength(200)) 
            .force("center", d3.forceCenter(bubbleW / 2, bubbleH / 2))
            .force("collision", d3.forceCollide().radius(d => bubbleScale(d.value) + 10).strength(1.2).iterations(32))
            .on("tick", ticked);

// appending each bubble
        const bubbles = svg3.selectAll("circle")
            .data(continentsObj.children)
            .enter()
            .append("circle")
            //Setting id for africa's bubble as africaCircle
            .attr("id", d => {
                if (d.name === "Africa") {
                    return "africaCircle"
                }
            })
            //using our bubblescale to set the radius
            .attr("r", d => bubbleScale(d.value))
            .attr("cx", bubbleW / 2)  // Temporarily set to center
            .attr("cy", bubbleH / 2)  // Temporarily set to center
            //if data.name = to africa then set the color to steelblue, otherwise it should be #c4c4c4
            .attr("fill", d => d.name === "Africa" ? "steelblue" : "hsl(207, 44%, 75%)")
            // .call is a method that invokes functions on the selected elements. these functions are defined elsewhere in the script.
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));


    // append labels to each bubble and setting their x and why values to the center of the bubbles. 
        const labels = svg3.selectAll("text")
            .data(continentsObj.children)
            .enter().append("text")
            .attr("x", d => d.x)
            .attr("y", d => d.y)
            .attr("text-anchor", "middle")
            // bolding the text of africas bubble
            .style("font-weight", d => d.name === "Africa" ? "bold" : "")
            .style("fill", "#fff")
            //setting the label to be the name and the value of each continent.
            .text(d => `${d.name}: ${Math.round(d.value)} kwh`);



// declaring a function called ticked. This function changes the x and y values of each bubble and label according to our iteration rate. 
        function ticked() {
            bubbles
                .attr("cx", d => d.x = Math.max(bubbleScale(d.value), Math.min(bubbleW - bubbleScale(d.value), d.x)))
                .attr("cy", d => d.y = Math.max(bubbleScale(d.value), Math.min(bubbleH - bubbleScale(d.value), d.y)))

            labels
                .attr("x", d => d.x)
                .attr("y", d => d.y);
        }


     // Function to handle the start of a drag event on a node.
function dragstarted(event, d) {
    // If this is the first node to start being dragged (no other drag operations are active),
    // set the simulation's alpha target to 0.3 to warm up the simulation and call restart to continue the simulation.
    if (!event.active) simulation.alphaTarget(0.3).restart();

    // Fix the position of the node to its current position, effectively anchoring it in place.
    // This prevents the node from moving due to the simulation forces when it starts being dragged.
    d.fx = d.x;
    d.fy = d.y;
}

// Function to handle the dragging of a node.
function dragged(event, d) {
    // Update the fixed position of the node to the current position of the cursor.
    // This makes the node follow the drag.
    d.fx = event.x;
    d.fy = event.y;

    // Set the simulation's alpha to a higher value (0.7) to keep the simulation active and responsive,
    // and restart the simulation so it continues processing while dragging.
    simulation.alpha(0.7).restart();
}

// Function to handle when the drag event on a node ends.
function dragended(event, d) {
    // If the drag operation that ended was the last active drag, reduce the alpha target to 0,
    // allowing the simulation to cool down and eventually come to a halt.
    if (!event.active) simulation.alphaTarget(0);

    // Clear the fixed positions, allowing the node to move according to the simulation forces again.
    d.fx = null;
    d.fy = null;

    // Apply or re-apply a collision force to the simulation, preventing nodes from overlapping.
    // The collision radius is dynamically calculated based on the node value, ensuring appropriate spacing.
    simulation.force("collision", d3.forceCollide().radius(d => bubbleScale(d.value) + 5));
}


//declaring the function setEnergy. It's what we use to increase and decrease the size of the africa bubble according to how much value is added to the africa bubble.
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

            // Manually updating the collision radius for all nodes in the simulation
            simulation.force("collision", d3.forceCollide().radius(d => bubbleScale(d.value) + 5));

            // Manually triggering the tick function to update positions immediately
            simulation.alpha(1).restart();
        }



        // giving each button in our solar power drop down an eventlistner that listens for when it is clicked. when it is clicked it returns setEnergy
        //which then adds or detracts the right amount of energy from the Africa Bubble 
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

//Declaring country insert, which is used to populate continents.Obj
function CountryInsert(continent, country, totalEnergy, renewable, nuclear, fossil) {
    this.continent = continent;
    this.name = country;
    this.value = totalEnergy; // This is important for D3 packing
    this.renewable = renewable;
    this.nuclear = nuclear;
    this.fossil = fossil;
}
