(function () {
    const areaW = 950;
    const areaH = 550;
    const margin = { top: 20, right: 30, bottom: 30, left: 60 };
    const africaBtn = document.querySelector("#africaBtn")
    const asiaBtn = document.querySelector("#asiaBtn")
    const southAmericaBtn = document.querySelector("#southAmericaBtn")
    const northAmericaBtn = document.querySelector("#nothAmericaBtn")
    const oceaniaBtn = document.querySelector("#oceaniaBtn")
    const europeBtn = document.querySelector("#europeBtn")
    const worldBtn = document.querySelector("#worldBtn")

    d3.csv("/public/data/energymix.csv").then(data => {
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
        .attr("transform", `translate(${margin.top})`);


        const x = d3.scaleLinear()
            .range([margin.left, areaW - margin.right]);

        const y = d3.scaleLinear()
            .range([areaH - margin.bottom, margin.top]);

        const color = d3.scaleOrdinal()
            .domain(["Fossil_fuel", "Nuclear_electricity", "Renewable_electricity"])
            .range(["hsl(207, 44%, 75%)", "hsl(207, 44%, 65%)", "hsl(207, 44%, 49%)"]);

        const area = d3.area()
            .x(d => x(d.data.Year))
            .y0(d => y(d[0]))
            .y1(d => y(d[1]));

        const stack = d3.stack()
            .keys(["Fossil_fuel", "Nuclear_electricity", "Renewable_electricity"])
            .order(d3.stackOrderNone)
            .offset(d3.stackOffsetNone);

        // List of specific countries to display
        const specificContinents = ["Africa", "Asia", "South America", "North America", "Oceania", "Europe", "World"];

        // Filter data for specific countries
        const filteredData = data.filter(d => specificContinents.includes(d.Entity));

        // Get unique list of filtered countries
        const countries = Array.from(new Set(filteredData.map(d => d.Entity)));
        const select = d3.select("#countrySelect");
        select.selectAll("option")
            .data(countries)
            .enter().append("option")
            .text(d => d);

        select.on("change", updateChart);

        function updateChart() {
            const countryData = filteredData.filter(d => d.Entity === selectedContinent);
        
            x.domain(d3.extent(countryData, d => d.Year));
            y.domain([0, d3.max(countryData, d => d.Fossil_fuel + d.Nuclear_electricity + d.Renewable_electricity)]).nice();
        
            const series = stack(countryData);
        
            svg.selectAll("path").remove();
            svg.selectAll("g").remove();
        
            const areas = svg.append("g")
                .selectAll("path")
                .data(series)
                .enter().append("path")
                .attr("fill", ({ key }) => color(key));
        
            // Initialize the paths at the bottom of the chart
            areas.attr("d", area.y0(d => y(0)).y1(d => y(0)))
                // Transition to the actual values
                .transition()
                .ease(d3.easeExpOut)
                .duration(1000)  // Duration of the animation in milliseconds
                .attr("d", area.y0(d => y(d[0])).y1(d => y(d[1])))
                .end()
                .then(() => {
                    // After the animation completes, add titles
                    areas.append("title")
                        .text(({ key }) => key);
                });
        
            // Add the x-axis
            svg.append("g")
                .attr("transform", `translate(0,${areaH - margin.bottom})`)
                .attr("class", "x-axis")
                .call(d3.axisBottom(x).ticks(areaW / 80).tickSizeOuter(0));
        
            // Add the y-axis
            svg.append("g")
                .attr("transform", `translate(${margin.left},0)`)
                .attr("class", "y-axis")
                .call(d3.axisLeft(y));
        }
        
        window.addEventListener("onload", () => {
            selectedContinent = "Africa";
            return updateChart();
        } )
        africaBtn.addEventListener("click", () => {
            selectedContinent = "Africa";
            return updateChart();
        } )
        asiaBtn.addEventListener("click", () => {
            selectedContinent = "Asia";
            return updateChart();
        } )
        southAmericaBtn.addEventListener("click", () => {
            selectedContinent = "South America";
            return updateChart();
        } )
        northAmericaBtn.addEventListener("click", () => {
            selectedContinent = "North America";
            return updateChart();
        } )
        oceaniaBtn.addEventListener("click", () => {
            selectedContinent = "Oceania";
            return updateChart();
        } )
        europeBtn.addEventListener("click", () => {
            selectedContinent = "Europe";
            return updateChart();
        } )
        worldBtn.addEventListener("click", () => {
            selectedContinent = "World";
            return updateChart();
        } )
        
        // Initialize the chart with the first country
        let selectedContinent = "Africa";
        updateChart();
    });

})();