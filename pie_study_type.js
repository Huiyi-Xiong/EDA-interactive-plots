// Load the JSON data
d3.json("pie_study_type.json").then(data => {

        // Set dimensions and margins for the chart
    const width = 960, height = 700, margin = { top: 50, right: 200, bottom: 50, left: 50 };

    // Append the SVG object to the body of the page
    const svg = d3.select("#pie-chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);


    // Prepare data
    const innerData = data.map(d => ({ type: "Interventional", mode: d.mode, count: d.Interventional }));
    const outerData = data.map(d => ({ type: "Observational", mode: d.mode, count: d.Observational }));

    // Combine data for stacking
    const combinedData = innerData.concat(outerData);

    // Set colors
    const color = d3.scaleOrdinal()
        .domain(["Interventional", "Observational"])
        .range(["#8da0cb", "#a6d854"]);

    // Compute the position of each group on the pie:
    const pie = d3.pie()
        .value(d => d.count)
        .sort(null);

    const arc = d3.arc()
        .innerRadius(0)
        .outerRadius(Math.min(width, height) / 2 - 1);

    const labelArc = d3.arc()
        .outerRadius(Math.min(width, height) / 2)
        .innerRadius(Math.min(width, height) / 2 - 80);

    // Build the pie chart
    const pieData = pie(combinedData);

    svg.selectAll('path')
        .data(pieData)
        .join('path')
        .attr('fill', d => color(d.data.type))
        .attr('d', arc)
        .append("title")
        .text(d => `${d.data.mode}: ${d.data.count}`);

    // Add labels
    svg.selectAll('text')
        .data(pieData)
        .join('text')
        .attr('transform', d => `translate(${labelArc.centroid(d)})`)
        .attr('dy', '0.35em')
        .text(d => `${d.data.mode}\n(${d.data.count})`);

    // Title
    svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "24px") 
        .style("text-decoration", "underline")  
        .text("Study Types and Experimental Designs for Vaccine Trials: 2005-2024");
});
