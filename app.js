const container1 = document.querySelector("#contianer1");
const container2 = document.querySelector("#contianer2");
const container3 = document.querySelector("#contianer3");


let dataset = [ 32, 63, 81, 5, 18, 9, 54, 56, 34, 24, ]


const w = 700;
const h = 450;
const pad = 40;
let dur = 800



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
    const svg3 = d3.select("#container3")
    .append("svg")
    .attr("width", w)
    .attr("height", h);

    




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
           
            // her skal kode skrives
            console.log(data)







        })
        .catch(error => {
            console.error('Error:', error);
        });
