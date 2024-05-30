//declaring all the elements that we are going to refer to later in the script ad variables. We''re using .queryselector to find the elements in our html page.
const apiUrl = 'https://renewable-electricity-in-africa.onrender.com/energy';
const container3 = document.querySelector("#container3");
const solarBtn0 = document.querySelector("#solarBtn0");
const solarBtn1 = document.querySelector("#solarBtn1");
const solarBtn2 = document.querySelector("#solarBtn2");
const solarBtn3 = document.querySelector("#solarBtn3");
let customSelects = document.querySelectorAll('.custom-select');




function smallBubble(){
// declaring height and width of our data visualization as variables, so that if we want to change them, we only need to change the values here.
let bubbleW = 350;
const bubbleH = 500;

//declaring original average amount of electricity generated per capita kwh for Africa
let originalValue = 667.9646642157649;

// Fetching data from our Database

fetch(apiUrl)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
       
//looping through the data and instantiating ContinentInsert if the year = 2021 and thhen pushing it to continentObjss
        let i = 0;
        let continentObjs = [];
        while (i < data.length) {
            if (data[i].year === 2021) {
                let continent = new ContinentInsert(
                    data[i].continent,
                    data[i].fossil_fuel + data[i].nuclear_electricity + data[i].renewable_electricity
                );
                continentObjs.push(continent);
            }
            i++;
        }


        // Declaring our bubbleSvg for the bubble chart. The height and width is set to be our variables that we declared at the top of our script
        const bubbleSvg3 = d3.select("#container3")
            .append("svg")
            .attr("width", bubbleW)
            .attr("height", bubbleH);

        // Using scaleSqrt so that the value is displayed as the area of the circles
        // Creating a scale for our bubble chart where the domain goes from 0 up to the maximum average total electricity generated per capita.
        // Then we're declaring the range to be from 10 to 200 to make it easier to work with.
        const bubbleScale = d3.scaleSqrt()
            .domain([0, d3.max(continentObjs, d => d.value)])
            .range([0, 80]);

        // Using forceSimulation to get collision between our continent bubbles.
        let simulation = d3.forceSimulation(continentObjs)
            .force("charge", d3.forceManyBody().strength(200))
            .force("center", d3.forceCenter(bubbleW / 2, bubbleH / 2))
            .force("collision", d3.forceCollide().radius(d => bubbleScale(d.value) + 10).strength(1.2).iterations(32))
            .on("tick", ticked);

        // Appending each bubble
        const bubbles = bubbleSvg3.selectAll("circle")
            .data(continentObjs)
            .enter()
            .append("circle")
            .attr("id", d => {
                if (d.continent === "Africa") {
                    return "africaCircle";
                }
            })
            .attr("r", d => bubbleScale(d.value))
            .attr("cx", bubbleW / 2)  // Temporarily set to center
            .attr("cy", bubbleH / 2)  // Temporarily set to center
            .attr("fill", d => d.continent === "Africa" ? "steelblue" : "hsl(207, 44%, 75%)")
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));

        // Append labels to each bubble and set their x and y values to the center of the bubbles.
        const labels = bubbleSvg3.selectAll("g")
            .data(continentObjs)
            .enter().append("g")
            .attr("class", "label-group")
            .attr("text-anchor", "middle")
            .attr("transform", d => `translate(${d.x},${d.y})`);  // Ensure initial positioning

        // Append continent names
        labels.append("text")
            .attr("class", "continent-label")
            .attr("dy", "-6px")  // Adjusted to move up
            .attr("font-size", "10px")
            .style("font-weight", d => d.continent === "Africa" ? "bold" : "")
            .style("fill", "#fff")
            .text(d => d.continent);

        // Append values
        labels.append("text")
            .attr("class", "value-label")
            .attr("dy", "6px")  // Adjusted to move down
            .attr("font-size", "10px")
            .style("fill", "#fff")
            .text(d => `${Math.round(d.value)} kWh`);

        // Declaring a function called ticked. This function changes the x and y values of each bubble and label according to our iteration rate.
        function ticked() {
            bubbles
                .attr("cx", d => d.x = Math.max(bubbleScale(d.value), Math.min(bubbleW - bubbleScale(d.value), d.x)))
                .attr("cy", d => d.y = Math.max(bubbleScale(d.value), Math.min(bubbleH - bubbleScale(d.value), d.y)));

            labels.attr("transform", d => `translate(${d.x},${d.y})`);
        }

        // Function to handle the start of a drag event on a node.
        function dragstarted(event, d) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }

        // Function to handle the dragging of a node.
        function dragged(event, d) {
            d.fx = event.x;
            d.fy = event.y;
            simulation.alpha(0.7).restart();
        }

        // Function to handle when the drag event on a node ends.
        function dragended(event, d) {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
            simulation.force("collision", d3.forceCollide().radius(d => bubbleScale(d.value) + 5));
        }

        // Function to update the energy value for Africa and update the visualization
        function setEnergy(amount) {
            let africa = continentObjs.find(d => d.continent === "Africa");
            if (africa) {
                africa.value = amount; // Set the value for Africa
            }
            simulation.stop();
            labels.filter(d => d.continent === "Africa").select(".value-label")
                .text(d => `${Math.round(d.value)} kWh`);

            bubbleSvg3.select("#africaCircle")
                .transition()
                .ease(d3.easeElastic)
                .duration(700)
                .attr("r", bubbleScale(africa.value))
                .on("end", () => {
                    simulation.nodes(continentObjs).alpha(1).restart();
                });
            simulation.force("collision", d3.forceCollide().radius(d => bubbleScale(d.value) + 5));
            simulation.alpha(1).restart();
        }

        // Attach event listeners to the buttons
        const solarBtns = [solarBtn0, solarBtn1, solarBtn2, solarBtn3];
        const energyValues = [0, 521.55, 1043.1, 2086.2];

        solarBtns.forEach((btn, index) => {
            btn.addEventListener("click", () => {
                setEnergy(energyValues[index] + originalValue);
            });
        });

    })
    .catch(error => {
        console.error('Error:', error);
    });

}









function mediumBubble(){
    // declaring height and width of our data visualization as variables, so that if we want to change them, we only need to change the values here.
    let bubbleW = 550;
    const bubbleH = 500;
    
    //declaring original average amount of electricity generated per capita kwh for Africa
    let originalValue = 667.9646642157649;
    
    // Fetching data from our Database
    
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
           
    //looping through the data and instantiating ContinentInsert if the year = 2021 and thhen pushing it to continentObjss
            let i = 0;
            let continentObjs = [];
            while (i < data.length) {
                if (data[i].year === 2021) {
                    let continent = new ContinentInsert(
                        data[i].continent,
                        data[i].fossil_fuel + data[i].nuclear_electricity + data[i].renewable_electricity
                    );
                    continentObjs.push(continent);
                }
                i++;
            }
    
    
            // Declaring our bubbleSvg for the bubble chart. The height and width is set to be our variables that we declared at the top of our script
            const bubbleSvg3 = d3.select("#container3")
                .append("svg")
                .attr("width", bubbleW)
                .attr("height", bubbleH);
    
            // Using scaleSqrt so that the value is displayed as the area of the circles
            // Creating a scale for our bubble chart where the domain goes from 0 up to the maximum average total electricity generated per capita.
            // Then we're declaring the range to be from 10 to 200 to make it easier to work with.
            const bubbleScale = d3.scaleSqrt()
                .domain([0, d3.max(continentObjs, d => d.value)])
                .range([0, 110]);
    
            // Using forceSimulation to get collision between our continent bubbles.
            let simulation = d3.forceSimulation(continentObjs)
                .force("charge", d3.forceManyBody().strength(200))
                .force("center", d3.forceCenter(bubbleW / 2, bubbleH / 2))
                .force("collision", d3.forceCollide().radius(d => bubbleScale(d.value) + 10).strength(1.2).iterations(32))
                .on("tick", ticked);
    
            // Appending each bubble
            const bubbles = bubbleSvg3.selectAll("circle")
                .data(continentObjs)
                .enter()
                .append("circle")
                .attr("id", d => {
                    if (d.continent === "Africa") {
                        return "africaCircle";
                    }
                })
                .attr("r", d => bubbleScale(d.value))
                .attr("cx", bubbleW / 2)  // Temporarily set to center
                .attr("cy", bubbleH / 2)  // Temporarily set to center
                .attr("fill", d => d.continent === "Africa" ? "steelblue" : "hsl(207, 44%, 75%)")
                .call(d3.drag()
                    .on("start", dragstarted)
                    .on("drag", dragged)
                    .on("end", dragended));
    
            // Append labels to each bubble and set their x and y values to the center of the bubbles.
            const labels = bubbleSvg3.selectAll("g")
                .data(continentObjs)
                .enter().append("g")
                .attr("class", "label-group")
                .attr("text-anchor", "middle")
                .attr("transform", d => `translate(${d.x},${d.y})`);  // Ensure initial positioning
    
            // Append continent names
            labels.append("text")
                .attr("class", "continent-label")
                .attr("dy", "-6px")  // Adjusted to move up
                .attr("font-size", "10px")
                .style("font-weight", d => d.continent === "Africa" ? "bold" : "")
                .style("fill", "#fff")
                .text(d => d.continent);
    
            // Append values
            labels.append("text")
                .attr("class", "value-label")
                .attr("dy", "6px")  // Adjusted to move down
                .attr("font-size", "10px")
                .style("fill", "#fff")
                .text(d => `${Math.round(d.value)} kWh`);
    
            // Declaring a function called ticked. This function changes the x and y values of each bubble and label according to our iteration rate.
            function ticked() {
                bubbles
                    .attr("cx", d => d.x = Math.max(bubbleScale(d.value), Math.min(bubbleW - bubbleScale(d.value), d.x)))
                    .attr("cy", d => d.y = Math.max(bubbleScale(d.value), Math.min(bubbleH - bubbleScale(d.value), d.y)));
    
                labels.attr("transform", d => `translate(${d.x},${d.y})`);
            }
    
            // Function to handle the start of a drag event on a node.
            function dragstarted(event, d) {
                if (!event.active) simulation.alphaTarget(0.3).restart();
                d.fx = d.x;
                d.fy = d.y;
            }
    
            // Function to handle the dragging of a node.
            function dragged(event, d) {
                d.fx = event.x;
                d.fy = event.y;
                simulation.alpha(0.7).restart();
            }
    
            // Function to handle when the drag event on a node ends.
            function dragended(event, d) {
                if (!event.active) simulation.alphaTarget(0);
                d.fx = null;
                d.fy = null;
                simulation.force("collision", d3.forceCollide().radius(d => bubbleScale(d.value) + 5));
            }
    
            // Function to update the energy value for Africa and update the visualization
            function setEnergy(amount) {
                let africa = continentObjs.find(d => d.continent === "Africa");
                if (africa) {
                    africa.value = amount; // Set the value for Africa
                }
                simulation.stop();
                labels.filter(d => d.continent === "Africa").select(".value-label")
                    .text(d => `${Math.round(d.value)} kWh`);
    
                bubbleSvg3.select("#africaCircle")
                    .transition()
                    .ease(d3.easeElastic)
                    .duration(700)
                    .attr("r", bubbleScale(africa.value))
                    .on("end", () => {
                        simulation.nodes(continentObjs).alpha(1).restart();
                    });
                simulation.force("collision", d3.forceCollide().radius(d => bubbleScale(d.value) + 5));
                simulation.alpha(1).restart();
            }
    
            // Attach event listeners to the buttons
            const solarBtns = [solarBtn0, solarBtn1, solarBtn2, solarBtn3];
            const energyValues = [0, 521.55, 1043.1, 2086.2];
    
            solarBtns.forEach((btn, index) => {
                btn.addEventListener("click", () => {
                    setEnergy(energyValues[index] + originalValue);
                });
            });
    
        })
        .catch(error => {
            console.error('Error:', error);
        });
    
    }
    


    
function largeBubble(){
    // declaring height and width of our data visualization as variables, so that if we want to change them, we only need to change the values here.
    let bubbleW = 1000;
    const bubbleH = 500;
    
    //declaring original average amount of electricity generated per capita kwh for Africa
    let originalValue = 667.9646642157649;
    
    // Fetching data from our Database
    
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
           
    //looping through the data and instantiating ContinentInsert if the year = 2021 and thhen pushing it to continentObjss
            let i = 0;
            let continentObjs = [];
            while (i < data.length) {
                if (data[i].year === 2021) {
                    let continent = new ContinentInsert(
                        data[i].continent,
                        data[i].fossil_fuel + data[i].nuclear_electricity + data[i].renewable_electricity
                    );
                    continentObjs.push(continent);
                }
                i++;
            }
    
    
            // Declaring our bubbleSvg for the bubble chart. The height and width is set to be our variables that we declared at the top of our script
            const bubbleSvg3 = d3.select("#container3")
                .append("svg")
                .attr("width", bubbleW)
                .attr("height", bubbleH);
    
            // Using scaleSqrt so that the value is displayed as the area of the circles
            // Creating a scale for our bubble chart where the domain goes from 0 up to the maximum average total electricity generated per capita.
            // Then we're declaring the range to be from 10 to 200 to make it easier to work with.
            const bubbleScale = d3.scaleSqrt()
                .domain([0, d3.max(continentObjs, d => d.value)])
                .range([0, 150]);
    
            // Using forceSimulation to get collision between our continent bubbles.
            let simulation = d3.forceSimulation(continentObjs)
                .force("charge", d3.forceManyBody().strength(200))
                .force("center", d3.forceCenter(bubbleW / 2, bubbleH / 2))
                .force("collision", d3.forceCollide().radius(d => bubbleScale(d.value) + 10).strength(1.2).iterations(32))
                .on("tick", ticked);
    
            // Appending each bubble
            const bubbles = bubbleSvg3.selectAll("circle")
                .data(continentObjs)
                .enter()
                .append("circle")
                .attr("id", d => {
                    if (d.continent === "Africa") {
                        return "africaCircle";
                    }
                })
                .attr("r", d => bubbleScale(d.value))
                .attr("cx", bubbleW / 2)  // Temporarily set to center
                .attr("cy", bubbleH / 2)  // Temporarily set to center
                .attr("fill", d => d.continent === "Africa" ? "steelblue" : "hsl(207, 44%, 75%)")
                .call(d3.drag()
                    .on("start", dragstarted)
                    .on("drag", dragged)
                    .on("end", dragended));
    
            // Append labels to each bubble and set their x and y values to the center of the bubbles.
            const labels = bubbleSvg3.selectAll("g")
                .data(continentObjs)
                .enter().append("g")
                .attr("class", "label-group")
                .attr("text-anchor", "middle")
                .attr("transform", d => `translate(${d.x},${d.y})`);  // Ensure initial positioning
    
            // Append continent names
            labels.append("text")
                .attr("class", "continent-label")
                .attr("dy", "-6px")  // Adjusted to move up
                .attr("font-size", "10px")
                .style("font-weight", d => d.continent === "Africa" ? "bold" : "")
                .style("fill", "#fff")
                .text(d => d.continent);
    
            // Append values
            labels.append("text")
                .attr("class", "value-label")
                .attr("dy", "6px")  // Adjusted to move down
                .attr("font-size", "10px")
                .style("fill", "#fff")
                .text(d => `${Math.round(d.value)} kWh`);
    
            // Declaring a function called ticked. This function changes the x and y values of each bubble and label according to our iteration rate.
            function ticked() {
                bubbles
                    .attr("cx", d => d.x = Math.max(bubbleScale(d.value), Math.min(bubbleW - bubbleScale(d.value), d.x)))
                    .attr("cy", d => d.y = Math.max(bubbleScale(d.value), Math.min(bubbleH - bubbleScale(d.value), d.y)));
    
                labels.attr("transform", d => `translate(${d.x},${d.y})`);
            }
    
            // Function to handle the start of a drag event on a node.
            function dragstarted(event, d) {
                if (!event.active) simulation.alphaTarget(0.3).restart();
                d.fx = d.x;
                d.fy = d.y;
            }
    
            // Function to handle the dragging of a node.
            function dragged(event, d) {
                d.fx = event.x;
                d.fy = event.y;
                simulation.alpha(0.7).restart();
            }
    
            // Function to handle when the drag event on a node ends.
            function dragended(event, d) {
                if (!event.active) simulation.alphaTarget(0);
                d.fx = null;
                d.fy = null;
                simulation.force("collision", d3.forceCollide().radius(d => bubbleScale(d.value) + 5));
            }
    
            // Function to update the energy value for Africa and update the visualization
            function setEnergy(amount) {
                let africa = continentObjs.find(d => d.continent === "Africa");
                if (africa) {
                    africa.value = amount; // Set the value for Africa
                }
                simulation.stop();
                labels.filter(d => d.continent === "Africa").select(".value-label")
                    .text(d => `${Math.round(d.value)} kWh`);
    
                bubbleSvg3.select("#africaCircle")
                    .transition()
                    .ease(d3.easeElastic)
                    .duration(700)
                    .attr("r", bubbleScale(africa.value))
                    .on("end", () => {
                        simulation.nodes(continentObjs).alpha(1).restart();
                    });
                simulation.force("collision", d3.forceCollide().radius(d => bubbleScale(d.value) + 5));
                simulation.alpha(1).restart();
            }
    
            // Attach event listeners to the buttons
            const solarBtns = [solarBtn0, solarBtn1, solarBtn2, solarBtn3];
            const energyValues = [0, 521.55, 1043.1, 2086.2];
    
            solarBtns.forEach((btn, index) => {
                btn.addEventListener("click", () => {
                    setEnergy(energyValues[index] + originalValue);
                });
            });
    
        })
        .catch(error => {
            console.error('Error:', error);
        });
    
    }
    

    //Declaring country insert, which is used to populate continents.Obj
function ContinentInsert(continent, totalEnergy) {
    this.continent = continent;
    this.value = totalEnergy; // This is important for D3 packing
}
