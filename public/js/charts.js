let regions = ["AFR", "AMR", "EMR", "EUR", "SEAR", "WPR"];
let regionColors = [
    {region: "AFR", color: "#008dc9"},
    {region: "AMR", color: "#8ecb3b"},
    {region: "EMR", color: "#ffa06a"},
    {region: "EUR", color: "#e5554f"},
    {region: "SEAR", color: "#ffa300"},
    {region: "WPR", color: "#5bc3e7"},
];

function printBarChart(data) {
    let margin = {top: 80, right: 20, bottom: 400, left: 40},
        width = 5000 - margin.left - margin.right,
        height = 800 - margin.top - margin.bottom;

    let xScale = d3.scaleBand()
        .range([0, width])
        .domain(data.map((d) => d.Location))
        .padding(0.2);

    let yScale = d3.scaleLinear()
        .range([height, 0])
        .domain([0, d3.max(data, (d) => d.FactValueNumeric)]);

    let svg = d3.select("#barChartContainer").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    let barChartToolTip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html((d) => "<span>Years: " + d.FactValueNumeric + "</span>");

    svg.call(barChartToolTip);

    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale))
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", "-.55em")
        .attr("transform", "rotate(-90)");

    svg.append("g")
        .attr("transform", "translate(0," + (height + 150) + ")")
        .append("text")
        .attr("class", "label")
        .attr("text-anchor", "start")
        .attr("stroke", "black")
        .text("Countries");

    svg.append("g")
        .call(d3.axisLeft(yScale).tickFormat((d) => d).ticks(10))
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("dy", "2em")
        .attr("text-anchor", "end")
        .attr("stroke", "black")
        .text("Years");


    svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", (d) => xScale(d.Location))
        .attr("y", (d) => yScale(d.FactValueNumeric))
        .attr("width", xScale.bandwidth())
        .attr("height", (d) => height - yScale(d.FactValueNumeric))
        .on('mouseover', barChartToolTip.show)
        .on('mouseout', barChartToolTip.hide)
        .style("fill", (d) => regionColors.find(regionColor => regionColor.region === d.ParentLocationCode).color);
}

function printScatterChart(data) {
    let margin = {top: 30, right: 30, bottom: 30, left: 60},
        width = 1000 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;

    let svg = d3.select("#scatterChartContainer")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    let minXscale = d3.min(data, (d) => d.FactValueNumeric) - 2;
    let maxXscale = parseFloat(d3.max(data, (d) => d.FactValueNumeric)) + 2;


    let xScale = d3.scaleLinear().range([0, width]).domain([minXscale, maxXscale]);
    let yScale = d3.scalePoint().range([0, height]).domain(regions).padding(0.2);

    let scatterChartToolTip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html((d) => "<span>Country: " + d.Location + "</span>");

    svg.call(scatterChartToolTip);

    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale))
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", "-.55em")
        .attr("transform", "rotate(-90)");

    svg.append("g")
        .call(d3.axisLeft(yScale));

    svg.append('g')
        .selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", (d) => xScale(d.FactValueNumeric))
        .attr("cy", (d) => yScale(d.ParentLocationCode))
        .attr("r", 5)
        .style("fill", (d) => regionColors.find(regionColor => regionColor.region === d.ParentLocationCode).color)
        .on('mouseover', scatterChartToolTip.show)
        .on('mouseout', scatterChartToolTip.hide);
}

export function printCharts() {
    d3.csv("/data/life_expectancy.csv", (error, data) => {
        if (error) {
            throw error;
        }

        printBarChart(data);

        printScatterChart(data)
    });
}
