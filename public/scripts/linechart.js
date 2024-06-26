
function largeLine(){
    // Set the dimensions and linelineMargins of the graph
    let lineMargin = { top: 55, right: 20, bottom: 60, left: 40 },
        lineWidth = 700 - lineMargin.left - lineMargin.right,
        lineHeight = 550 - lineMargin.top - lineMargin.bottom;

    // Append the svg object to the body of the page
    const lineSvg = d3.select("#container1")
        .append("svg")
        .attr("width", lineWidth + lineMargin.left + lineMargin.right)
        .attr("height", lineHeight + lineMargin.top + lineMargin.bottom)
        .append("g")
        .attr("transform", `translate(${lineMargin.left},${lineMargin.top})`);

    // Parse the Year / time
    const parseTime = d3.timeParse("%Y");

    // Load the CSV file
    d3.csv("/data/electricity_access.csv").then(data => {
        data.forEach(d => {
            d.Year = parseTime(d.Year);
            d.Value = +d.Value;
        });

        // Filter data for years greater than or equal to 1998
        data = data.filter(d => d.Year.getFullYear() >= 1998);

        // Filter data for "World" and "Sub-Saharan Africa"
        const worldData = data.filter(d => d.Country === "World");
        const subSaharanAfricaData = data.filter(d => d.Country === "Sub-Saharan Africa");

        console.log(worldData);
        console.log(subSaharanAfricaData);

        if (worldData.length === 0 || subSaharanAfricaData.length === 0) {
            console.log("No data for 'World' or 'Sub-Saharan Africa' for the selected years");
            return;
        }

        // Set the ranges
        const x = d3.scaleTime().range([0, lineWidth]).domain(d3.extent(data, d => d.Year));
        const y = d3.scaleLinear().range([lineHeight, 0]).domain([0, d3.max(data, d => d.Value)]);

        // Define the line
        const line = d3.line()
            .x(d => x(d.Year))
            .y(d => y(d.Value));

        // Setup observer to trigger animations
        let observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    startAnimations();
                    observer.disconnect(); // Disconnect observer after animation starts
                }
            });
        }, {
            rootlineMargin: '0px',
            threshold: 0.5 // Trigger when 50% of the element is in view
        });

        // Function to start animations
        function startAnimations() {
            animateLine(worldData, "hsl(207, 44%, 75%)"); // Animate World data line
            animateLine(subSaharanAfricaData, "steelblue"); // Animate Sub-Saharan Africa data line
        }

        // Function to animate the line drawing
        function animateLine(data, color) {
            const linePath = lineSvg.append("path")
                .datum(data)
                .attr("class", "line")
                .attr("d", line)
                .style("stroke", color);

            const totalLength = linePath.node().getTotalLength();
            linePath.attr("stroke-dasharray", totalLength + " " + totalLength)
                .attr("stroke-dashoffset", totalLength)
                .transition()
                .duration(2000)
                .ease(d3.easeCubicOut)
                .attr("stroke-dashoffset", 0);
        }

        // Observe the SVG container
        observer.observe(lineSvg.node());

        lineSvg.append("line")
            .attr("x1", 620)  // Starting x coordinate
            .attr("y1", 50)  // Starting y coordinate
            .attr("x2", 620) // Ending x coordinate
            .attr("y2", 230) // Ending y coordinate
            .attr("stroke", "#c4c4c4") // Line color
            .attr("stroke-width", 2)
            .attr("stroke-dasharray", "5,5"); // Line width

            lineSvg.append("text")
            .attr("x", 580)
            .attr("y", 145)
            .attr("class", "addedInfo")
            .style("fill", "#9c9c9c")
            .text("42%");

            lineSvg.append("text")
            .attr("x", 0)
            .attr("y", 490)
            .attr("class", "addedInfo")
            .style("fill", "#9c9c9c")
            .text("Years");

        // Add the X Axis
        lineSvg.append("g")
            .attr("class", "x-axis")
            .attr("transform", `translate(0,${lineHeight})`)
            .call(d3.axisBottom(x));

           
        // Add the Y Axis
        lineSvg.append("g")
            .attr("class", "y-axis")
            .call(d3.axisLeft(y).tickFormat(d => d + "%"));

        lineSvg.append("text")
            .attr("x", 0)
            .attr("y", -40)
            .attr("class", "legend")
            .style("fill", "hsl(207, 44%, 75%)")
            .text("World");

        lineSvg.append("text")
            .attr("x", 0)
            .attr("y", -20)
            .attr("class", "legend")
            .style("fill", "steelblue")
            .text("Sub-Saharan Africa");

    }).catch(error => {
        console.error("Error loading the CSV file:", error);
    });

}

function mediumLine(){
    // Set the dimensions and linelineMargins of the graph
    let lineMargin = { top: 55, right: 20, bottom: 60, left: 40 },
        lineWidth = 550 - lineMargin.left - lineMargin.right,
        lineHeight = 550 - lineMargin.top - lineMargin.bottom;

    // Append the svg object to the body of the page
    const lineSvg = d3.select("#container1")
        .append("svg")
        .attr("width", lineWidth + lineMargin.left + lineMargin.right)
        .attr("height", lineHeight + lineMargin.top + lineMargin.bottom)
        .append("g")
        .attr("transform", `translate(${lineMargin.left},${lineMargin.top})`);

    // Parse the Year / time
    const parseTime = d3.timeParse("%Y");

    // Load the CSV file
    d3.csv("/data/electricity_access.csv").then(data => {
        data.forEach(d => {
            d.Year = parseTime(d.Year);
            d.Value = +d.Value;
        });

        // Filter data for years greater than or equal to 1998
        data = data.filter(d => d.Year.getFullYear() >= 1998);

        // Filter data for "World" and "Sub-Saharan Africa"
        const worldData = data.filter(d => d.Country === "World");
        const subSaharanAfricaData = data.filter(d => d.Country === "Sub-Saharan Africa");

        console.log(worldData);
        console.log(subSaharanAfricaData);

        if (worldData.length === 0 || subSaharanAfricaData.length === 0) {
            console.log("No data for 'World' or 'Sub-Saharan Africa' for the selected years");
            return;
        }

        // Set the ranges
        const x = d3.scaleTime().range([0, lineWidth]).domain(d3.extent(data, d => d.Year));
        const y = d3.scaleLinear().range([lineHeight, 0]).domain([0, d3.max(data, d => d.Value)]);

        // Define the line
        const line = d3.line()
            .x(d => x(d.Year))
            .y(d => y(d.Value));

        // Setup observer to trigger animations
        let observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    startAnimations();
                    observer.disconnect(); // Disconnect observer after animation starts
                }
            });
        }, {
            rootlineMargin: '0px',
            threshold: 0.5 // Trigger when 50% of the element is in view
        });

        // Function to start animations
        function startAnimations() {
            animateLine(worldData, "hsl(207, 44%, 75%)"); // Animate World data line
            animateLine(subSaharanAfricaData, "steelblue"); // Animate Sub-Saharan Africa data line
        }

        // Function to animate the line drawing
        function animateLine(data, color) {
            const linePath = lineSvg.append("path")
                .datum(data)
                .attr("class", "line")
                .attr("d", line)
                .style("stroke", color);

            const totalLength = linePath.node().getTotalLength();
            linePath.attr("stroke-dasharray", totalLength + " " + totalLength)
                .attr("stroke-dashoffset", totalLength)
                .transition()
                .duration(2000)
                .ease(d3.easeCubicOut)
                .attr("stroke-dashoffset", 0);
        }

        // Observe the SVG container
        observer.observe(lineSvg.node());

        lineSvg.append("line")
            .attr("x1", 470)  // Starting x coordinate
            .attr("y1", 50)  // Starting y coordinate
            .attr("x2", 470) // Ending x coordinate
            .attr("y2", 230) // Ending y coordinate
            .attr("stroke", "#c4c4c4") // Line color
            .attr("stroke-width", 2)
            .attr("stroke-dasharray", "5,5"); // Line width

            lineSvg.append("text")
            .attr("x", 430)
            .attr("y", 145)
            .attr("class", "addedInfo")
            .style("fill", "#9c9c9c")
            .text("42%");

            lineSvg.append("text")
            .attr("x", 0)
            .attr("y", 490)
            .attr("class", "addedInfo")
            .style("fill", "#9c9c9c")
            .text("Years");

        // Add the X Axis
        lineSvg.append("g")
            .attr("class", "x-axis")
            .attr("transform", `translate(0,${lineHeight})`)
            .call(d3.axisBottom(x));

           
        // Add the Y Axis
        lineSvg.append("g")
            .attr("class", "y-axis")
            .call(d3.axisLeft(y).tickFormat(d => d + "%"));

        lineSvg.append("text")
            .attr("x", 0)
            .attr("y", -40)
            .attr("class", "legend")
            .style("fill", "hsl(207, 44%, 75%)")
            .text("World");

        lineSvg.append("text")
            .attr("x", 0)
            .attr("y", -20)
            .attr("class", "legend")
            .style("fill", "steelblue")
            .text("Sub-Saharan Africa");

    }).catch(error => {
        console.error("Error loading the CSV file:", error);
    });

}

function smallLine(){
    // Set the dimensions and linelineMargins of the graph
    let lineMargin = { top: 55, right: 20, bottom: 60, left: 40 },
        lineWidth = 340 - lineMargin.left - lineMargin.right,
        lineHeight = 550 - lineMargin.top - lineMargin.bottom;

    // Append the svg object to the body of the page
    const lineSvg = d3.select("#container1")
        .append("svg")
        .attr("width", lineWidth + lineMargin.left + lineMargin.right)
        .attr("height", lineHeight + lineMargin.top + lineMargin.bottom)
        .append("g")
        .attr("transform", `translate(${lineMargin.left},${lineMargin.top})`);

    // Parse the Year / time
    const parseTime = d3.timeParse("%Y");

    // Load the CSV file
    d3.csv("/data/electricity_access.csv").then(data => {
        data.forEach(d => {
            d.Year = parseTime(d.Year);
            d.Value = +d.Value;
        });

        // Filter data for years greater than or equal to 1998
        data = data.filter(d => d.Year.getFullYear() >= 1998);

        // Filter data for "World" and "Sub-Saharan Africa"
        const worldData = data.filter(d => d.Country === "World");
        const subSaharanAfricaData = data.filter(d => d.Country === "Sub-Saharan Africa");

        console.log(worldData);
        console.log(subSaharanAfricaData);

        if (worldData.length === 0 || subSaharanAfricaData.length === 0) {
            console.log("No data for 'World' or 'Sub-Saharan Africa' for the selected years");
            return;
        }

        // Set the ranges
        const x = d3.scaleTime().range([0, lineWidth]).domain(d3.extent(data, d => d.Year));
        const y = d3.scaleLinear().range([lineHeight, 0]).domain([0, d3.max(data, d => d.Value)]);

        // Define the line
        const line = d3.line()
            .x(d => x(d.Year))
            .y(d => y(d.Value));

        // Setup observer to trigger animations
        let observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    startAnimations();
                    observer.disconnect(); // Disconnect observer after animation starts
                }
            });
        }, {
            rootlineMargin: '0px',
            threshold: 0.5 // Trigger when 50% of the element is in view
        });

  // Draw the World data line
  lineSvg.append("path")
  .datum(worldData)
  .attr("class", "line")
  .attr("d", line)
  .style("stroke", "hsl(207, 44%, 75%)");

  lineSvg.append("path")
  .datum(subSaharanAfricaData)
  .attr("class", "line")
  .attr("d", line)
  .style("stroke", "steelblue");


        lineSvg.append("line")
            .attr("x1", 280)  // Starting x coordinate
            .attr("y1", 50)  // Starting y coordinate
            .attr("x2", 280) // Ending x coordinate
            .attr("y2", 230) // Ending y coordinate
            .attr("stroke", "#c4c4c4") // Line color
            .attr("stroke-width", 2)
            .attr("stroke-dasharray", "5,5"); // Line width

            lineSvg.append("text")
            .attr("x", 240)
            .attr("y", 145)
            .attr("class", "addedInfo")
            .style("fill", "#9c9c9c")
            .text("42%");

            lineSvg.append("text")
            .attr("x", 0)
            .attr("y", 490)
            .attr("class", "addedInfo")
            .style("fill", "#9c9c9c")
            .text("Years");

        // Add the X Axis
        lineSvg.append("g")
            .attr("class", "x-axis")
            .attr("transform", `translate(0,${lineHeight})`)
            .call(d3.axisBottom(x));

           
        // Add the Y Axis
        lineSvg.append("g")
            .attr("class", "y-axis")
            .call(d3.axisLeft(y).tickFormat(d => d + "%"));

        lineSvg.append("text")
            .attr("x", 0)
            .attr("y", -40)
            .attr("class", "legend")
            .style("fill", "hsl(207, 44%, 75%)")
            .text("World");

        lineSvg.append("text")
            .attr("x", 0)
            .attr("y", -20)
            .attr("class", "legend")
            .style("fill", "steelblue")
            .text("Sub-Saharan Africa");

    }).catch(error => {
        console.error("Error loading the CSV file:", error);
    });

}