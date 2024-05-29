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
            .range([margin.left, areaW - margin.right]);

        const y = d3.scaleLinear()
            .range([areaH - margin.bottom, margin.top])
            .domain([0, 100]);

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
            .offset(d3.stackOffsetExpand);

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

        let selectedContinent = "Africa";

        select.on("change", function() {
            selectedContinent = this.value;
            updateChart();
        });

        function updateChart() {
            const continentData = filteredData.filter(d => d.Entity === selectedContinent);

            x.domain(d3.extent(continentData, d => d.Year));

            const series = stack(continentData);

            svg.selectAll("path").remove();
            svg.selectAll(".x-axis").remove();
            svg.selectAll(".y-axis").remove();

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
                .attr("d", area)
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
                .call(d3.axisBottom(x).ticks(areaW / 80).tickFormat(d3.format("d")).tickSizeOuter(0));

            // Add the y-axis
            svg.append("g")
                .attr("transform", `translate(${margin.left},0)`)
                .attr("class", "y-axis")
                .call(d3.axisLeft(y).ticks(10).tickFormat(d => d + '%'));
        }

        africaBtn.addEventListener("click", () => {
            selectedContinent = "Africa";
            updateChart();
        });
        asiaBtn.addEventListener("click", () => {
            selectedContinent = "Asia";
            updateChart();
        });
        southAmericaBtn.addEventListener("click", () => {
            selectedContinent = "South America";
            updateChart();
        });
        northAmericaBtn.addEventListener("click", () => {
            selectedContinent = "North America";
            updateChart();
        });
        oceaniaBtn.addEventListener("click", () => {
            selectedContinent = "Oceania";
            updateChart();
        });
        europeBtn.addEventListener("click", () => {
            selectedContinent = "Europe";
            updateChart();
        });
        worldBtn.addEventListener("click", () => {
            selectedContinent = "World";
            updateChart();
        });

        // Initialize the chart with the first country
        updateChart();
    });
})();
