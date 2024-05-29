(function () {
    const areaW = 950;
    const areaH = 550;
    const margin = { top: 20, right: 30, bottom: 30, left: 60 };
    const africaBtn = document.querySelector("#africaBtn");
    const asiaBtn = document.querySelector("#asiaBtn");
    const southAmericaBtn = document.querySelector("#southAmericaBtn");
    const northAmericaBtn = document.querySelector("#northAmericaBtn");
    const oceaniaBtn = document.querySelector("#oceaniaBtn");
    const europeBtn = document.querySelector("#europeBtn");
    const worldBtn = document.querySelector("#worldBtn");
    
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

        const svg = d3.select("#areaChart")
            .attr("width", areaW)
            .attr("height", areaH + margin.bottom)  
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const x = d3.scaleLinear()
            .range([0, areaW - margin.left - margin.right]);

        const y = d3.scaleLinear()
            .range([areaH - margin.top - margin.bottom, 0]);

        const color = d3.scaleOrdinal()
            .domain(["Fossil_fuel", "Nuclear_electricity", "Renewable_electricity"])
            .range(["hsl(207, 44%, 75%)", "hsl(207, 44%, 65%)", "hsl(207, 44%, 49%)"]);

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
            const t = svg.transition().duration(750);
        
            const areas = svg.selectAll("path")
                .data(series);

            areas.enter().append("path")
                .attr("fill", ({ key }) => color(key))
                .merge(areas)  // Merge the new and existing elements
                .transition(t) // Apply transition
                .attr("d", area);

            areas.exit().remove();
        
            // Update the x-axis
            svg.selectAll(".x-axis").remove();
            svg.append("g")
                .attr("transform", `translate(0,${areaH - margin.bottom - margin.top})`)
                .attr("class", "x-axis")
                .call(d3.axisBottom(x).ticks(areaW / 80).tickSizeOuter(0).tickFormat(d3.format("d")));
        
            // Update the y-axis
            svg.selectAll(".y-axis").remove();
            svg.append("g")
                .attr("transform", `translate(0,0)`)
                .attr("class", "y-axis")
                .call(d3.axisLeft(y).tickFormat(d => d + "%"));
        }
        
        svg.append("text")
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

})();
