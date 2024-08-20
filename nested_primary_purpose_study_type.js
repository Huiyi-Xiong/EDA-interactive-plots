// Load the JSON data
d3.json("nested_primary_purpose_study_type.json").then(function(data) {

    // Set up dimensions and margins
    const width = 950;
    const height = 600;
    const margin = 40;
    const radius = Math.min(width, height) / 2 - margin;

    // Append the SVG object to the body
    const svg = d3.select("#nested-pie-chart-purpose-study")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    // Set up color scales
    const innerColor = d3.scaleOrdinal()
      .domain(data.inner_circle.map(d => d.label))
      .range(['#8da0cb', '#e78ac3', '#a6d854']);

    const outerColor = d3.scaleOrdinal()
      .domain(data.outer_circle.map(d => d.label))
      .range(['#66c2a5', '#fc8d62', '#66c2a5', '#fc8d62']);

    // Common wedgeprops for both inner and outer circles
    const wedgeProps = {
        'stroke': 'white',
        'stroke-width': 2
    };

    // Arc generator for the inner circle
    const innerArc = d3.arc()
      .innerRadius(radius * 0.5)  // Adjust inner radius for donut effect
      .outerRadius(radius * 0.8);

    // Arc generator for the outer circle
    const outerArc = d3.arc()
      .innerRadius(radius * 0.8)
      .outerRadius(radius);

    // Generate pie slices
    const innerPie = d3.pie()
      .sort(null)
      .value(d => d.size);

    const outerPie = d3.pie()
      .sort(null)
      .value(d => d.size || 0.1); // Give a small non-zero value to zero-sized slices

    // Draw inner circle
    const innerSlices = svg.selectAll(".innerSlice")
      .data(innerPie(data.inner_circle))
      .enter().append("path")
      .attr("class", "innerSlice")
      .attr("d", innerArc)
      .attr("fill", d => innerColor(d.data.label))
      .attr("stroke", wedgeProps.stroke)
      .attr("stroke-width", wedgeProps["stroke-width"])
      .on("mouseover", function(event, d) {
        tooltip.transition()
            .duration(200)
            .style("opacity", .9);
        tooltip.html(`${d.data.label}: ${d.data.size} (${d.data.percentage}%)`)
            .style("left", (event.pageX + 5) + "px")
            .style("top", (event.pageY - 28) + "px");
      })
      .on("mousemove", function(event) {
        tooltip.style("left", (event.pageX + 5) + "px")
            .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", function() {
        tooltip.transition()
            .duration(500)
            .style("opacity", 0);
      });

    // Draw outer circle
    const outerSlices = svg.selectAll(".outerSlice")
      .data(outerPie(data.outer_circle))
      .enter().append("path")
      .attr("class", "outerSlice")
      .attr("d", outerArc)
      .attr("fill", d => outerColor(d.data.label))
      .attr("stroke", wedgeProps.stroke)
      .attr("stroke-width", wedgeProps["stroke-width"])
      .on("mouseover", function(event, d) {
        tooltip.transition()
            .duration(200)
            .style("opacity", .9);
        tooltip.html(`${d.data.label}: ${d.data.size} (${d.data.percentage}%)`)
            .style("left", (event.pageX + 5) + "px")
            .style("top", (event.pageY - 28) + "px");
      })
      .on("mousemove", function(event) {
        tooltip.style("left", (event.pageX + 5) + "px")
            .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", function() {
        tooltip.transition()
            .duration(500)
            .style("opacity", 0);
      });

    // Add a center circle to make it a donut
    svg.append("circle")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", radius * 0.5)
      .style("fill", "white");

    // Tooltip
    const tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0)
      .style("position", "absolute")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "1px")
      .style("border-radius", "5px")
      .style("padding", "10px");

    // Title
    svg.append("text")
      .attr("x", 0)
      .attr("y", -radius - margin / 2)
      .attr("text-anchor", "middle")
      .style("font-size", "24px")
      .text("Primary Purpose and Study Type Combined Nested Pie Chart: 2005-2024");

    // Legend
    const legend = svg.append("g")
      .attr("transform", `translate(${radius + margin}, -${radius - margin})`)
      .selectAll("g")
      .data(data.inner_circle.concat(data.outer_circle))
      .enter().append("g")
      .attr("transform", (d, i) => `translate(0, ${i * 20})`);

    legend.append("rect")
      .attr("x", 0)
      .attr("width", 18)
      .attr("height", 18)
      .attr("fill", d => innerColor(d.label) || outerColor(d.label));

    legend.append("text")
      .attr("x", 24)
      .attr("y", 9)
      .attr("dy", "0.35em")
      .style("font-size", "14px")
      .text(d => d.label);
});
