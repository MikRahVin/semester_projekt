// Set the dimensions and margins of the graph
const margin = {top: 40, right: 180, bottom: 30, left: 50},
      width = 900 - margin.left - margin.right,
      height = 450 - margin.top - margin.bottom;

// Append the svg object to the body of the page
const svg = d3.select("#container1")
              .append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
              .append("g")
              .attr("transform", `translate(${margin.left},${margin.top})`);

// Add title to the chart
svg.append("text")
   .attr("x", (width / 2))
   .attr("y", -20)
   .attr("class", "chart-title")
   .text("Electricity Access: World vs Sub-Saharan Africa from 1998 onwards");

// Parse the Year / time
const parseTime = d3.timeParse("%Y");

// Load the CSV file
d3.csv("electricity_access.csv").then(data => {
    data.forEach(d => {
        d.Year = parseTime(d.Year);
        d.Value = +d.Value;
    });

    // Filter data for years greater than or equal to 1998
    data = data.filter(d => d.Year.getFullYear() >= 1998);

    // Filter data for "World" and "Sub-Saharan Africa"
    const worldData = data.filter(d => d.Country === "World");
    const subSaharanAfricaData = data.filter(d => d.Country === "Sub-Saharan Africa");

    // Check if filtered data is empty
    if (worldData.length === 0 || subSaharanAfricaData.length === 0) {
        console.log("No data for 'World' or 'Sub-Saharan Africa' for the selected years");
        return;
    }

    // Set the ranges
    const x = d3.scaleTime().range([0, width]);
    const y = d3.scaleLinear().range([height, 0]);

    // Define the line
    const line = d3.line()
                   .x(d => x(d.Year))
                   .y(d => y(d.Value));

    // Scale the range of the data based on filtered data
    x.domain([d3.min(data, d => d.Year), d3.max(data, d => d.Year)]);
    y.domain([0, d3.max(data, d => d.Value)]);

    // Create tooltip div
    const tooltip = d3.select("#tooltip");

    // Function to handle mouseover event
    function handleMouseOver(event, d, country, data) {
        const [mx, my] = d3.pointer(event);
        const xDate = x.invert(mx);
        const bisectDate = d3.bisector(d => d.Year).left;
        const i = bisectDate(data, xDate, 1);
        const d0 = data[i - 1];
        const d1 = data[i];
        const dNearest = xDate - d0.Year > d1.Year - xDate ? d1 : d0;

        tooltip.transition().duration(200).style("opacity", .9);
        tooltip.html(`${country}<br>Year: ${d3.timeFormat("%Y")(dNearest.Year)}<br>Value: ${dNearest.Value}`)
               .style("left", (event.pageX + 5) + "px")
               .style("top", (event.pageY - 28) + "px");
    }

    // Function to handle mouseout event
    function handleMouseOut(event, d) {
        tooltip.transition().duration(500).style("opacity", 0);
    }

    // Add the line path for "World"
    svg.append("path")
       .datum(worldData)
       .attr("class", "line")
       .attr("d", line)
       .style("stroke", "steelblue")
       .on("mousemove", (event, d) => handleMouseOver(event, d, "World", worldData))
       .on("mouseout", handleMouseOut);

    // Add the line path for "Sub-Saharan Africa"
    svg.append("path")
       .datum(subSaharanAfricaData)
       .attr("class", "line")
       .attr("d", line)
       .style("stroke", "red")
       .on("mousemove", (event, d) => handleMouseOver(event, d, "Sub-Saharan Africa", subSaharanAfricaData))
       .on("mouseout", handleMouseOut);

    // Add the X Axis
    svg.append("g")
       .attr("class", "x-axis")
       .attr("transform", `translate(0,${height})`)
       .call(d3.axisBottom(x));

    // Add the Y Axis
    svg.append("g")
       .attr("class", "y-axis")
       .call(d3.axisLeft(y));

    // Add legend
    svg.append("text")
       .attr("x", width + 10)
       .attr("y", 20)
       .attr("class", "legend")
       .style("fill", "steelblue")
       .text("World");

    svg.append("text")
       .attr("x", width + 10)
       .attr("y", 40)
       .attr("class", "legend")
       .style("fill", "red")
       .text("Sub-Saharan Africa");
}).catch(error => {
    console.error("Error loading the CSV file:", error);
});
