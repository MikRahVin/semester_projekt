const container1 = document.querySelector("#contianer1");
const container2 = document.querySelector("#contianer2");
const container3 = document.querySelector("#contianer3");


let dataset = [32, 63, 81, 5, 18, 9, 54, 56, 34, 24,]


const w = 700;
const h = 450;
const pad = 40;
let dur = 800

const bubbbleW = 700;
const bubbleH = 700;



// appending svg element to container1
const svg1 = d3.select("#container1")
    .append("svg")
    .attr("width", w)
    .attr("height", h);






// appending svg element to container2
const svg2 = d3.select("#container2")
    .append("svg")
    .attr("width", w)
    .attr("height", h);






// appending svg element to container3







// DO NOT TOUCH BELOW HERE
const apiUrl = 'http://localhost:4000/energy'


fetch(apiUrl)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {

        let energyObjects = [];
        for (let i in data) {
            let energy = new Energy(
                data[i].fossil_fuel,
                data[i].nuclear_electricity,
                data[i].renewable_electricity,
                data[i].fossil_fuel + data[i].nuclear_electricity + data[i].renewable_electricity,
                data[i].country,
                data[i].access_pct
            );
            energyObjects.push(energy);
        }
        console.log(energyObjects)
        // her skal kode skrives



        //GRAPH/CHART FOR DATA VIZ 1 GOES HERE













        //GRAPH/CHART FOR DATA VIZ 2 GOES HERE









        // BUBBLE CHART FOR DATA VIZ 3 GOES HERE
        //append svg for bubblechart
        const svg3 = d3.select("#container3")
            .append("svg")
            .attr("width", bubbbleW)
            .attr("height", bubbleH);

        //Creating scales for bubbles
        const bubbleScale = d3.scaleLinear()
            .domain([0, d3.max(energyObjects, d => d.renewable)])
            .range([1, 150]);

        //Tooltip setup
        const tooltip = d3.select("#container3").append("div")
            .attr("class", "tooltip")
            .style("position", "absolute")
            .style("background-color", "#fff")
            .style("border", "1px solid #ddd")
            .style("padding", "5px")
            .style("display", "none")
            .style("pointer-events", "none");

        const simulation = d3.forceSimulation(energyObjects)
            .force("charge", d3.forceManyBody().strength(20))  // Repulsive force among nodes
            .force("center", d3.forceCenter(w / 2, h / 2))  // Centering force
            .force("collision", d3.forceCollide().radius(d => bubbleScale(d.renewable) + 1))
            .on("tick", ticked);



        function ticked() {
            bubbles
                .attr("cx", d => Math.max(bubbleScale(d.renewable), Math.min(bubbbleW - bubbleScale(d.renewable), d.x)))
                .attr("cy", d => Math.max(bubbleScale(d.renewable), Math.min(bubbleH - bubbleScale(d.renewable), d.y)));
        }

        //creating the bubbles

        const bubbles = svg3.selectAll("circle")
            .data(energyObjects)
            .enter()
            .append("circle")
            .attr("r", d => bubbleScale(d.renewable))
            .attr("fill", d => d.renewable === d3.max(energyObjects, e => e.renewable) ? "#98aeeb" : "grey")
            .on("mouseover", function (event, d) {
                tooltip.style("display", "inline-block")
                    .html(`${d.country} <br> ${d.renewable} kwh`)
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 10) + "px");
            })
            .on("mouseout", function () {
                tooltip.style("display", "none");
            })
            .call(d3.drag()  // Optional: Add drag interactions
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));

        function dragstarted(event, d) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(event, d) {
            d.fx = event.x;
            d.fy = event.y;
        }

        function dragended(event, d) {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }

    })
    .catch(error => {
        console.error('Error:', error);
    });

function Energy(fossil, nuclear, renewable, total, country, access) {
    this.fossil = fossil;
    this.nuclear = nuclear;
    this.renewable = renewable;
    this.total = total;
    this.country = country;
    this.access = access
}