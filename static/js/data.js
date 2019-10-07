var factData = null;

// Read a JSON file or API ../static/js/logic.js
d3.json('/api/randomfacts')
    .then(function(data) {
        console.log(data);
        factData = data;
        // randomly pick a valid index in 'data' array
        var randomIndex = Math.floor(Math.random() * data.length);

        // extract out a random fact using the randomly generated index
        var randomFact = data[randomIndex];

        console.log(`Our random fact at index: ${randomIndex} is ${randomFact.text}`);

        // ADD our new fact text to our paragraph on the HTML page
        // step 1: use d3 to target the element & update the element with the new text
        d3.select('#random-fact').text(randomFact.text);
    })


function funFact() {
    // randomly pick a valid index in 'data' array
    var randomIndex = Math.floor(Math.random() * factData.length);

    // extract out a random fact using the randomly generated index
    var randomFact = factData[randomIndex];

    console.log(`Our random fact at index: ${randomIndex} is ${randomFact.text}`);

    // ADD our new fact text to our paragraph on the HTML page
    // step 1: use d3 to target the element & update the element with the new text
    d3.select('#random-fact').text(randomFact.text);
}