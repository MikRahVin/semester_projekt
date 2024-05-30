// Select buttons for each continent and the world using their IDs
const africaBtn = document.querySelector("#africaBtn");
const asiaBtn = document.querySelector("#asiaBtn");
const southAmericaBtn = document.querySelector("#southAmericaBtn");
const northAmericaBtn = document.querySelector("#northAmericaBtn");
const oceaniaBtn = document.querySelector("#oceaniaBtn");
const europeBtn = document.querySelector("#europeBtn");
const worldBtn = document.querySelector("#worldBtn");

// Function to draw and update the area chart for energy data
function smallArea() {
    // Margins for the SVG container
    let areaMargin = { top: 70, right: 30, bottom: 30, left: 60 };
    // Width and height for the SVG container
    let areaW = 340;
    let areaH = 500 - areaMargin.top;

    // Initially selected continent
    let selectedContinent = "Africa"; // Default selection is Africa

    // Load and process CSV data for the energy mix
    d3.csv("/data/energymix.csv").then(data => {
        // Convert string data to numbers
        data.forEach(d => {
            d.Year = +d.Year;
            d.Fossil_fuel = +d.Fossil_fuel;
            d.Nuclear_electricity = +d.Nuclear_electricity;
            d.Renewable_electricity = +d.Renewable_electricity;
        });

        // Set up the SVG container for the area chart
        const AreaSvg = d3.select("#areaChart")
            .attr("width", areaW)
            .attr("height", areaH + areaMargin.bottom)  
            .append("g")
            .attr("transform", `translate(${areaMargin.left},${areaMargin.top})`);

        // Scales for the x and y axes
        const x = d3.scaleLinear()
            .range([0, areaW - areaMargin.left - areaMargin.right]);
        const y = d3.scaleLinear()
            .range([areaH - areaMargin.top - areaMargin.bottom, 0]);

        // Color scale for different energy types
        const color = d3.scaleOrdinal()
            .domain(["Fossil_fuel", "Nuclear_electricity", "Renewable_electricity"])
            .range(["hsl(207, 44%, 90%)", "hsl(207, 44%, 75%)", "hsl(207, 44%, 49%)"]);

        // Define area generator
        const area = d3.area()
            .x(d => x(d.data.Year))
            .y0(d => y(d[0] * 100))
            .y1(d => y(d[1] * 100));

        // Stack data for layered area chart
        const stack = d3.stack()
            .keys(["Fossil_fuel", "Nuclear_electricity", "Renewable_electricity"])
            .order(d3.stackOrderNone)
            .offset(d3.stackOffsetExpand); // Adjusts the stack to use the full chart height

        // Filter data by continent
        const specificContinents = ["Africa", "Asia", "South America", "North America", "Oceania", "Europe", "World"];
        const filteredData = data.filter(d => specificContinents.includes(d.Entity));

        // Function to update the chart based on selected continent
        function updateChart() {
            const continentData = filteredData.filter(d => d.Entity === selectedContinent);
            x.domain(d3.extent(continentData, d => d.Year));
            y.domain([0, 100]);  // Set y domain from 0 to 100 for percentage
            const series = stack(continentData);

            // Add or update areas
            const areas = AreaSvg.selectAll("path")
                .data(series);
            areas.enter().append("path")
                .attr("fill", ({ key }) => color(key))
                .merge(areas)  
                .transition(AreaSvg.transition().duration(750)) 
                .attr("d", area);
            areas.exit().remove();

            // Update x-axis
            AreaSvg.selectAll(".x-axis").remove();
            AreaSvg.append("g")
                .attr("transform", `translate(0,${areaH - areaMargin.bottom - areaMargin.top})`)
                .attr("class", "x-axis")
                .call(d3.axisBottom(x).ticks(areaW / 80).tickSizeOuter(0).tickFormat(d3.format("d")));

            // Update y-axis
            AreaSvg.selectAll(".y-axis").remove();
            AreaSvg.append("g")
                .attr("class", "y-axis")
                .call(d3.axisLeft(y).tickFormat(d => d + "%"));
        }

        // Initial chart setup
        updateChart();

        // Add event listeners for buttons to switch continents
        africaBtn.addEventListener("click", () => { selectedContinent = "Africa"; updateChart(); });
        asiaBtn.addEventListener("click", () => { selectedContinent = "Asia"; updateChart(); });
        southAmericaBtn.addEventListener("click", () => { selectedContinent = "South America"; updateChart(); });
        northAmericaBtn.addEventListener("click", () => { selectedContinent = "North America"; updateChart(); });
        oceaniaBtn.addEventListener("click", () => { selectedContinent = "Oceania"; updateChart(); });
        europeBtn.addEventListener("click", () => { selectedContinent = "Europe"; updateChart(); });
        worldBtn.addEventListener("click", () => { selectedContinent = "World"; updateChart(); });
    });
}


function mediumArea(){
    let areaMargin = { top: 70, right: 30, bottom: 30, left: 60 };
    let areaW = 550;
    let areaH = 500 - areaMargin.top;
    
    // Initially selected continent
    let selectedContinent = "Africa"; // Moved this line up for global access within this function

    d3.csv("/data/energymix.csv").then(data => {
        // Convert data types
        data.forEach(d => {
            d.Year = +d.Year;
            d.Fossil_fuel = +d.Fossil_fuel;
            d.Nuclear_electricity = +d.Nuclear_electricity;
            d.Renewable_electricity = +d.Renewable_electricity;
        });

        const AreaSvg = d3.select("#areaChart")
            .attr("width", areaW)
            .attr("height", areaH + areaMargin.bottom)  
            .append("g")
            .attr("transform", `translate(${areaMargin.left},${areaMargin.top})`);

        const x = d3.scaleLinear()
            .range([0, areaW - areaMargin.left - areaMargin.right]);

        const y = d3.scaleLinear()
            .range([areaH - areaMargin.top - areaMargin.bottom, 0]);

        const color = d3.scaleOrdinal()
            .domain(["Fossil_fuel", "Nuclear_electricity", "Renewable_electricity"])
            .range(["hsl(207, 44%, 90%)", "hsl(207, 44%, 75%)", "hsl(207, 44%, 49%)"]);

        const area = d3.area()
            .x(d => x(d.data.Year))
            .y0(d => y(d[0] * 100))
            .y1(d => y(d[1] * 100));

        const stack = d3.stack()
            .keys(["Fossil_fuel", "Nuclear_electricity", "Renewable_electricity"])
            .order(d3.stackOrderNone)
            .offset(d3.stackOffsetExpand); // Change offset to fill the chart

        // Filter data for specific continents
        const specificContinents = ["Africa", "Asia", "South America", "North America", "Oceania", "Europe", "World"];
        const filteredData = data.filter(d => specificContinents.includes(d.Entity));

        function updateChart() {
            const continentData = filteredData.filter(d => d.Entity === selectedContinent);
        
            x.domain(d3.extent(continentData, d => d.Year));
            y.domain([0, 100]);  // Set y domain from 0 to 100 for percentage
        
            const series = stack(continentData);

            // Add transition
            const t = AreaSvg.transition().duration(750);
        
            const areas = AreaSvg.selectAll("path")
                .data(series);

            areas.enter().append("path")
                .attr("fill", ({ key }) => color(key))
                .merge(areas)  // Merge the new and existing elements
                .transition(t) // Apply transition
                .attr("d", area);

            areas.exit().remove();
        
            // Update the x-axis
            AreaSvg.selectAll(".x-axis").remove();
            AreaSvg.append("g")
                .attr("transform", `translate(0,${areaH - areaMargin.bottom - areaMargin.top})`)
                .attr("class", "x-axis")
                .call(d3.axisBottom(x).ticks(areaW / 80).tickSizeOuter(0).tickFormat(d3.format("d")));
        
            // Update the y-axis
            AreaSvg.selectAll(".y-axis").remove();
            AreaSvg.append("g")
                .attr("transform", `translate(0,0)`)
                .attr("class", "y-axis")
                .call(d3.axisLeft(y).tickFormat(d => d + "%"));
        }
        
        AreaSvg.append("text")
        .attr("x", 0)
        .attr("y", -40)
        .attr("class", "addedInfo")
        .style("fill", "hsl(207, 44%, 49%)")
        .text("Renewable");

        AreaSvg.append("text")
        .attr("x", 0)
        .attr("y", -25)
        .attr("class", "addedInfo")
        .style("fill", "hsl(207, 44%, 75%)")
        .text("Nuclear");

        AreaSvg.append("text")
        .attr("x", 0)
        .attr("y", -10)
        .attr("class", "addedInfo")
        .style("fill", "hsl(207, 44%, 90%)")
        .text("Fossil Fuel");

        AreaSvg.append("text")
        .attr("x", 0)
        .attr("y", areaH - 10)
        .attr("class", "addedInfo")
        .style("fill", "#9c9c9c")
        .text("Years");
        
        // Event listeners for buttons
        africaBtn.addEventListener("click", () => { selectedContinent = "Africa"; updateChart(); });
        asiaBtn.addEventListener("click", () => { selectedContinent = "Asia"; updateChart(); });
        southAmericaBtn.addEventListener("click", () => { selectedContinent = "South America"; updateChart(); });
        northAmericaBtn.addEventListener("click", () => { selectedContinent = "North America"; updateChart(); });
        oceaniaBtn.addEventListener("click", () => { selectedContinent = "Oceania"; updateChart(); });
        europeBtn.addEventListener("click", () => { selectedContinent = "Europe"; updateChart(); });
        worldBtn.addEventListener("click", () => { selectedContinent = "World"; updateChart(); });
        
        // Initialize the chart
        updateChart();
    });
}

function largeArea(){
    let areaMargin = { top: 70, right: 30, bottom: 30, left: 60 };
    let areaW = 700;
    let areaH = 550 - areaMargin.top;
    
    // Initially selected continent
    let selectedContinent = "Africa"; // Moved this line up for global access within this function

    d3.csv("/data/energymix.csv").then(data => {
        // Convert data types
        data.forEach(d => {
            d.Year = +d.Year;
            d.Fossil_fuel = +d.Fossil_fuel;
            d.Nuclear_electricity = +d.Nuclear_electricity;
            d.Renewable_electricity = +d.Renewable_electricity;
        });

        const AreaSvg = d3.select("#areaChart")
            .attr("width", areaW)
            .attr("height", areaH + areaMargin.bottom)  
            .append("g")
            .attr("transform", `translate(${areaMargin.left},${areaMargin.top})`);

        const x = d3.scaleLinear()
            .range([0, areaW - areaMargin.left - areaMargin.right]);

        const y = d3.scaleLinear()
            .range([areaH - areaMargin.top - areaMargin.bottom, 0]);

        const color = d3.scaleOrdinal()
            .domain(["Fossil_fuel", "Nuclear_electricity", "Renewable_electricity"])
            .range(["hsl(207, 44%, 90%)", "hsl(207, 44%, 75%)", "hsl(207, 44%, 49%)"]);

        const area = d3.area()
            .x(d => x(d.data.Year))
            .y0(d => y(d[0] * 100))
            .y1(d => y(d[1] * 100));

        const stack = d3.stack()
            .keys(["Fossil_fuel", "Nuclear_electricity", "Renewable_electricity"])
            .order(d3.stackOrderNone)
            .offset(d3.stackOffsetExpand); // Change offset to fill the chart

        // Filter data for specific continents
        const specificContinents = ["Africa", "Asia", "South America", "North America", "Oceania", "Europe", "World"];
        const filteredData = data.filter(d => specificContinents.includes(d.Entity));

        function updateChart() {
            const continentData = filteredData.filter(d => d.Entity === selectedContinent);
        
            x.domain(d3.extent(continentData, d => d.Year));
            y.domain([0, 100]);  // Set y domain from 0 to 100 for percentage
        
            const series = stack(continentData);

            // Add transition
            const t = AreaSvg.transition().duration(750);
        
            const areas = AreaSvg.selectAll("path")
                .data(series);

            areas.enter().append("path")
                .attr("fill", ({ key }) => color(key))
                .merge(areas)  // Merge the new and existing elements
                .transition(t) // Apply transition
                .attr("d", area);

            areas.exit().remove();
        
            // Update the x-axis
            AreaSvg.selectAll(".x-axis").remove();
            AreaSvg.append("g")
                .attr("transform", `translate(0,${areaH - areaMargin.bottom - areaMargin.top})`)
                .attr("class", "x-axis")
                .call(d3.axisBottom(x).ticks(areaW / 80).tickSizeOuter(0).tickFormat(d3.format("d")));
        
            // Update the y-axis
            AreaSvg.selectAll(".y-axis").remove();
            AreaSvg.append("g")
                .attr("transform", `translate(0,0)`)
                .attr("class", "y-axis")
                .call(d3.axisLeft(y).tickFormat(d => d + "%"));
        }
        
        AreaSvg.append("text")
        .attr("x", 0)
        .attr("y", -40)
        .attr("class", "addedInfo")
        .style("fill", "hsl(207, 44%, 49%)")
        .text("Renewable");

        AreaSvg.append("text")
        .attr("x", 0)
        .attr("y", -25)
        .attr("class", "addedInfo")
        .style("fill", "hsl(207, 44%, 75%)")
        .text("Nuclear");

        AreaSvg.append("text")
        .attr("x", 0)
        .attr("y", -10)
        .attr("class", "addedInfo")
        .style("fill", "hsl(207, 44%, 90%)")
        .text("Fossil Fuel");

        AreaSvg.append("text")
        .attr("x", 0)
        .attr("y", areaH - 10)
        .attr("class", "addedInfo")
        .style("fill", "#9c9c9c")
        .text("Years");
        
        // Event listeners for buttons
        africaBtn.addEventListener("click", () => { selectedContinent = "Africa"; updateChart(); });
        asiaBtn.addEventListener("click", () => { selectedContinent = "Asia"; updateChart(); });
        southAmericaBtn.addEventListener("click", () => { selectedContinent = "South America"; updateChart(); });
        northAmericaBtn.addEventListener("click", () => { selectedContinent = "North America"; updateChart(); });
        oceaniaBtn.addEventListener("click", () => { selectedContinent = "Oceania"; updateChart(); });
        europeBtn.addEventListener("click", () => { selectedContinent = "Europe"; updateChart(); });
        worldBtn.addEventListener("click", () => { selectedContinent = "World"; updateChart(); });
        
        // Initialize the chart
        updateChart();
    });
}