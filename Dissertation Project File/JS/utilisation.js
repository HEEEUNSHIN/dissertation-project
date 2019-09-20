

// Referred to 'multi-line graph 3 with v4: Legend' code from d3noob(https://bl.ocks.org/d3noob/f8b7f107ba25c21971851728520224cb) 

( function () {
            
            // set the dimensions of the graph
            var margin = {top: 30, right: 20, bottom: 70, left: 70},
                width = 800 - margin.left - margin.right,
                height = 550 - margin.top - margin.bottom;
            
            // parse the year
            var parseYear = d3.timeParse("%Y");
            
            // set the ranges
            var x = d3.scaleTime().range([0, width-20]);
            var y = d3.scaleLinear().range([height, 0]);
            
            // define the lines
            var percentline = d3.line()
                .x(function(d) { return x(d.year); })
                .y(function(d) { return y(d.percent); });

            // add the svg 
            var svg = d3.select("#relief_Vis")
                        .append("svg")
                        .attr("width", width + margin.left + margin.right)
                        .attr("height", height + margin.top + margin.bottom)
                        .append("g")
                        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
            
            // import the data
            d3.csv("CSV/underutilisation.csv", function(error, data) {
                
                data.forEach(function(d) {
                    d.year = parseYear(d.year);
                    d.percent = +d.percent;
                    // check the data 
                    console.log(d);
                });
                
                // scale the range of the data
                x.domain(d3.extent(data, function(d) { return d.year; }));
                y.domain([0, d3.max(data, function(d) { return d.percent; })]);
                
                // nest the entries by indicator
                var dataNest = d3.nest()
                                 .key(function(d) { return d.indicator; })
                                 .entries(data);
                
                // set the colour scale and legend space
                var colour = d3.scaleOrdinal(d3.schemeCategory10);
                legendSpace = width / dataNest.length;
                
                // loop through each key(indicator)
                dataNest.forEach(function(d, i) {
                    
                    svg.append("path")
                       .attr("class", "line")
                       .transition().duration(1000) 
                       .style("stroke", function() {
                            return d.colour = colour(d.key); })
                       .attr("d", percentline(d.values));
    
                    // add the legend
                    svg.append("text")
                      .attr("x", (legendSpace/2) + i * legendSpace)
                      .attr("y", height + (margin.bottom/2) + 5)
                      .attr("class", "legend")
                      .style("fill", function() {
                         return d.colour = colour(d.key); })
                      .text(d.key);
                    
                });
                
                // add the x axis
                svg.append("g")
                    .attr("class", "axis")
                    .attr("transform", "translate(0," + height + ")")
                    .call(d3.axisBottom(x));
                
                // add the y axis
                svg.append("g")
                    .attr("class", "axis")
                    .call(d3.axisLeft(y));
                
            });
    
    })();





