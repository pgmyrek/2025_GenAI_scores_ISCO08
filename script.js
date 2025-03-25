// Set dimensions
const width = 5000;
const height = 350000;

// Define consistent color mapping
const colorMap = {
  "Minimal Exposure": "lightgreen",
  "Exposed: Gradient 2": "lightblue",
  "Exposed: Gradient 3": "orange",
  "Exposed: Gradient 4": "red",
  "Very Low": "lightgrey",
  "Low": "lightgreen",
  "Medium": "orange",
  "High": "red"
};

// Append the SVG object to the body
const svg = d3.select("#tree-container")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .append("g")
  .attr("transform", "translate(50,0)");

// Create the tree layout
const tree = d3.tree().size([height, width - 3000]);

// Load JSON data
d3.json("output_data.json").then(data => {
  const root = d3.hierarchy(data);

  // Assign the tree layout to the data
  tree(root);

  // Draw links
  svg.selectAll("path")
    .data(root.links())
    .enter()
    .append("path")
    .attr("class", "link")
    .attr("fill", "none")
    .attr("stroke", "#ccc")
    .attr("stroke-width", 2)
    .attr("d", d3.linkHorizontal()
      .x(d => d.y)
      .y(d => d.x));

  // Draw nodes
  const node = svg.selectAll("g.node")
    .data(root.descendants())
    .enter()
    .append("g")
    .attr("transform", d => `translate(${d.y},${d.x})`);

  node.append("circle")
    .attr("r", 5)
    .attr("fill", d => colorMap[d.data.risk] || "black"); // Default color

  // Add labels
  node.append("text")
    .attr("dy", 3)
    .attr("x", d => d.children ? -10 : 40)
    .style("text-anchor", d => d.children ? "end" : "start")
    .style("font-size", "11px")
    .text(d => d.data.name);
}).catch(error => {
  console.error("Error loading the data:", error);
});
