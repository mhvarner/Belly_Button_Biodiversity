function init() {
  var selector = d3.select("#selDataset");
  d3.json("samples.json").then((data) => {
    console.log(data);
    var sampleNames = data.names;
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });
    var primarySample = sampleNames[0];
    buildCharts(primarySample);
    buildMetadata(primarySample);
  });
}
function optionChanged(newSample) {
  buildMetadata(newSample);
  buildCharts(newSample);
}
init();

function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    var PANEL = d3.select("#sample-metadata");

    PANEL.html("");
    //`string text ${expression} string text`
    PANEL.append("h6").text(`Location: ${result.location}`);
    PANEL.append("h6").text(`ID: ${result.id}`);
    PANEL.append("h6").text(`Ethnicity: ${result.ethnicity}`);
    PANEL.append("h6").text(`Gender: ${result.gender}`);
    PANEL.append("h6").text(`Age: ${result.age}`);
    PANEL.append("h6").text(`BBTYPE: ${result.bbtype}`);
    PANEL.append("h6").text(`WFREQ: ${result.wfreq}`);
  });
}

function buildCharts(sample) {
  d3.json("samples.json").then((data) => {
    var samples = data.samples;
    console.log(samples.filter(sampleObj => sampleObj.id == sample));
    var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];

    var sample_values = result.sample_values;
    var otu_ids = result.otu_ids;
    var otu_labels = result.otu_labels;
    var bubbleL = {
      title: "Bacteria count",
      xaxis: { title: "ID" }
    };
    var bubbleD = [
      { 
        x: otu_ids,
        y: sample_values,
        mode: "markers",
        marker: {
          size: sample_values,
          color: otu_ids,
          colorscale: "Earth"
        }
      }
    ];

    Plotly.newPlot("bubble", bubbleD, bubbleL);

  

    var BarChartValues = sample_values.slice(0, 10).reverse();

    var trace = {
      x: BarChartValues,
      y: otu_ids.slice(0, 10).map(otuids => `otu ${otuids}`).reverse(),
      type: "bar",
      orientation: "h"
    }

    var data = [trace]

    var layout = {
      xaxis: { title: "Results" },
      yaxis: { title: "Top 10 OTUs" }
    };
    Plotly.newPlot('bar', data, layout);
  });
}    
    
  
    
