const container1 = document.querySelector("#contianer1");
const container2 = document.querySelector("#contianer2");
const container3 = document.querySelector("#contianer3");


let dataset = [ 3, 6, 8, 5, 3, 9, 5]


const w = 700;
const h = 450;
const pad = 40;
let dur = 800

const svg1 = d3.select("#container1")
    .append("svg")
    .attr("width", w)
    .attr("height", h);

    const xScale = d3.scaleBand()
    .domain(d3.range(dataset.length))
    .range([pad, w - pad])
    .round(true)
    .paddingInner(0.30);

const yScale = d3.scaleLinear()
    .domain([0, d3.max(dataset)])
    .range([h - pad, pad])
    .nice();

// creating rect elements inside svg. 
let bars = svg1.selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("x", (d, i) => xScale(i))
    .attr("y", d => yScale(d))
    .attr("width", xScale.bandwidth())
    .attr("height", d => h - pad - yScale(d))
    .attr("fill", d => d === d3.max(dataset) ? "#409FC6" : "grey");;

    const xAxis = d3.axisBottom(xScale).ticks(10)
    const yAxis = d3.axisLeft(yScale).ticks(10)

    svg1
        .append("g")
        .attr("transform", `translate(0,${h - pad})`)
        .attr("class", "axis")
        .call(xAxis)

    svg1
        .append("g")
        .attr("transform", `translate(${pad},0)`)
        .attr("class", "axis")
        .call(yAxis);




    const svg2 = d3.select("#container2")
    .append("svg")
    .attr("width", w)
    .attr("height", h);

    let bars2 = svg2.selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("x", (d, i) => xScale(i))
    .attr("y", d => yScale(d))
    .attr("width", xScale.bandwidth())
    .attr("height", d => h - pad - yScale(d))
    .attr("fill", d => d === d3.max(dataset) ? "#409FC6" : "grey");;


    svg2
        .append("g")
        .attr("transform", `translate(0,${h - pad})`)
        .attr("class", "axis")
        .call(xAxis)

    svg2
        .append("g")
        .attr("transform", `translate(${pad},0)`)
        .attr("class", "axis")
        .call(yAxis);

    const svg3 = d3.select("#container3")
    .append("svg")
    .attr("width", w)
    .attr("height", h);

    let bars3 = svg3.selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("x", (d, i) => xScale(i))
    .attr("y", d => yScale(d))
    .attr("width", xScale.bandwidth())
    .attr("height", d => h - pad - yScale(d))
    .attr("fill", d => d === d3.max(dataset) ? "#409FC6" : "grey");;


    svg3
        .append("g")
        .attr("transform", `translate(0,${h - pad})`)
        .attr("class", "axis")
        .call(xAxis)

    svg3
        .append("g")
        .attr("transform", `translate(${pad},0)`)
        .attr("class", "axis")
        .call(yAxis);

        const apiUrl = 'http://localhost:4000/energy'


        fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
           
            // her skal kode skrives
            console.log(data)


        })
        .catch(error => {
            console.error('Error:', error);
        });
