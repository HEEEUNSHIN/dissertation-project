
// Referred to 'multi-line graph 3 with v4: Legend' code from d3noob(https://bl.ocks.org/d3noob/f8b7f107ba25c21971851728520224cb) 

(function () {
    
    // set the dimensions of the graph
    var margin = { top: 30, right: 20, bottom: 70, left: 70 },
        width = 800 - margin.left - margin.right,
        height = 550 - margin.top - margin.bottom;

    // parse the year
    var parseYear = d3.timeParse("%Y");

    // set the ranges
    var x = d3.scaleTime().range([0, width - 20]);
    var y = d3.scaleLinear().range([height, 0]);

    // define the lines
    var numbersline = d3.line()
        .x(function (d) { return x(d.year); })
        .y(function (d) { return y(d.numbers); });

    // voronoi for tooltips
    var voronoi = d3.voronoi()
        .x(function (d) {
            return x(d.year)
        })
        .y(function (d) {
            return y(d.numbers)
        })
        .extent([
            [-margin.left, -margin.top],
            [width, height]
        ])

    // add the svg 
    var svg = d3.select("#deaths_Vis")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // for tooltip
    var focus = svg.append("g")
        .attr("transform", "translate(-100,-100)")
        .attr("class", "focus");

    focus.append("circle")
        .attr("r", 3.5);

    focus.append("text")
        .attr("y", -10);

    // import the data
    d3.csv("CSV/unemployment.csv", function (error, data) {

        data.forEach(function (d) {
            d.year = parseYear(d.year);
            d.numbers = +d.numbers;
        });

        // scale the range of the data
        x.domain(d3.extent(data, function (d) { return d.year; }));
        y.domain([0, d3.max(data, function (d) { return d.numbers; })]);

        // nest the entries 
        var dataNest = d3.nest()
            .key(function (d) { return d.case; })
            .entries(data);
        
        // set the colour scale and legend space
            var colour = d3.scaleOrdinal()
            .range(['#ca3542', '#27647b'])
            .domain(dataNest, function (d) { return d.key});
	        legendSpace = width / dataNest.length;

        // loop through each key
        var lines = svg.selectAll('.line')
            .data(dataNest);

        lines.enter()
            .append('path')
            .attr('class', 'line')
            .transition().duration(1000)
            .style("stroke", function (d) {
                return colour(d.key)
            })
            .attr("d", function (d) {
                console.log(d.values)
                return numbersline(d.values)
            });

        // add the legend
        var legend = svg.selectAll('.legend')
            .data(dataNest, function (d) {
                return d.key
            });

        legend.enter()
            .append('text')
            .attr("x", function (d, i) {
                return (legendSpace / 2) + i * legendSpace
            })
            .attr("y", height + (margin.bottom / 2) + 5)
            .attr("class", "legend")
            .style("fill", function (d) {
                return colour(d.key);
            })
            .text(function (d) {
                return d.key
            });

        // tooltips
        var dt = d3.merge(dataNest.map(function (d) {
            return d.values
        }));

        var vr = svg.selectAll('.voronoi')
            .data(voronoi.polygons(dt));

        vr
            .enter()
            .append('path')
            .attr('class', 'voronoi')
            .attr('d', function (d, i) {
                return d ? 'M' + d.join('L') + 'Z' : null;
            })
            .style('fill', 'none')
            .style('stroke', 'none')
            .style('pointer-events', 'all')
            .on('mouseenter', function (d) {

                focus.attr('transform', 'translate(' + x(d.data.year) + ',' + y(d.data.numbers) + ')')
                focus.select('text')


                    .text(d.data.numbers)
                    .style('font', '13px sans-serif')
            })
            .on("mouseout", function (d) {
                focus.attr("transform", "translate(-100,-100)");
            }, true);

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
