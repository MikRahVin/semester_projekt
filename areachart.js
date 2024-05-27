(function () {
    const areaW = 900;
    const areaH = 450;
    const margin = { top: 20, right: 30, bottom: 30, left: 60 };

    d3.csv("energymix.csv").then(data => {
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
        const specificCountries = ["Africa", "Asia", "South America", "North America", "Oceania", "Australia"];

        // Filter data for specific countries
        const filteredData = data.filter(d => specificCountries.includes(d.Entity));

        // Get unique list of filtered countries
        const countries = Array.from(new Set(filteredData.map(d => d.Entity)));
        const select = d3.select("#countrySelect");
        select.selectAll("option")
            .data(countries)
            .enter().append("option")
            .text(d => d);

        select.on("change", updateChart);

        function updateChart() {
            const selectedCountry = select.property("value");
            const countryData = filteredData.filter(d => d.Entity === selectedCountry);

            x.domain(d3.extent(countryData, d => d.Year));
            y.domain([0, d3.max(countryData, d => d.Fossil_fuel + d.Nuclear_electricity + d.Renewable_electricity)]).nice();

            const series = stack(countryData);

            svg.selectAll("path").remove();
            svg.selectAll("g").remove();

            svg.append("g")
                .selectAll("path")
                .data(series)
                .enter().append("path")
                .attr("fill", ({ key }) => color(key))
                .attr("d", area)
                .append("title")
                .text(({ key }) => key);

            svg.append("g")
                .attr("transform", `translate(0,${areaH - margin.bottom})`)
                .call(d3.axisBottom(x).ticks(areaW / 80).tickSizeOuter(0));

            svg.append("g")
                .attr("transform", `translate(${margin.left},0)`)
                .call(d3.axisLeft(y));
        }

        // Initialize the chart with the first country
        select.property("value", countries[0]);
        updateChart();
    });

})();