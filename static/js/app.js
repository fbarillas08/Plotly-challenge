

function buildMetadata(samplenumber) {
    d3.json("samples.json").then((data)=>{
        metadata = data.metadata;
        //console.log(metadata);
        var sample = metadata.filter(d => d.id == samplenumber);
        sample = sample[0];
        // console.log(sample);
        var demographics = d3.select("#sample-metadata");
        demographics.html("");
        Object.entries(sample).forEach(([key,value]) => {
            demographics.append("h6").text(`${key.toUpperCase()}:${value}`);
        })
    })
}   

// Build the init function including the dropdown menu choices

function init(){
    var selector = d3.select("#selDataset");
    d3.json("samples.json").then((data)=>{
        var samplenames = data.names;
        samplenames.forEach((sample)=>{
            selector.append("option").text(sample).property("value",sample);            
        })
        var firstsample = samplenames[0];
        buildMetadata(firstsample);
        buildCharts(firstsample)
        //console.log(firstsample)          
    });
}

// Build the updating function when dropdown menu changes

function dropdownChange(newSample){    
    buildMetadata(newSample);
}


// Create the Chart Building Function

function buildCharts(samplenumber) {
    d3.json("samples.json").then((data)=>{
        samples = data.samples;
        var sample = samples.filter(d => d.id == samplenumber);
        sample = sample[0];
        var otu_ids = sample.otu_ids;
        var otu_labels = sample.otu_labels;
        var sample_values = sample.sample_values;

        //console.log(otu_ids);
        //console.log(otu_labels);
        //console.log(sample_values)

        
        barTrace = {
            type: "bar",
            orientation: "h",
            y: otu_ids.slice(0,10).map(otu => `OTU ${otu}`).reverse(),
            x: sample_values.slice(0,10).reverse(),            
            text: otu_labels.slice(0,10).reverse()
        }

        pieTrace = {
            type: "pie",
            labels: otu_ids.slice(0,10).map(otu => `OTU ${otu}`),
            values: sample_values.slice(0,10)
        }

        bubbleTrace = {
            x: otu_ids,
            y: sample_values,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "earth"
            },
            text: otu_labels         
        }    
        var bubblelayout = {    
            xaxis:{title: "OTU ID"},
            // height: 600,
            // width: 1300
        }                  
   

    Plotly.newPlot("bar",[barTrace]);
    Plotly.newPlot("pie",[pieTrace]);
    Plotly.newPlot("bubble",[bubbleTrace],bubblelayout);
        
})};    

// Load the Initial Sample
init();