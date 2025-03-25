// Set dimensions
const width = 2500;
const height = 40000;
const colorMap = {
  "Exposed: Gradient 4": "red",
  "Exposed: Gradient 3": "orange",
  "Exposed: Gradient 2": "lightblue",
  "Exposed: Gradient 1": "blue",
  "Minimal Exposure": "lightgreen",
  "Not Exposed": "grey",
  "High": "red", 
  "Medium": "orange",
  "Low": "lightgreen",
  "Very Low": "lightgrey"
};


// Append the SVG object to the body
const svg = d3.select("#tree-container")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .append("g")
  .attr("transform", "translate(50,0)");

// Create the tree layout
const tree = d3.tree().size([height, width - 1200]);


// Load JSON data
d3.json("output_data.json").then(data => {
  const root = d3.hierarchy(data);

  // Assign the tree layout to the data
  tree(root);

  // Links
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

  // Nodes
  const node = svg.selectAll("g.node")
    .data(root.descendants())
    .enter()
    .append("g")
    .attr("transform", d => `translate(${d.y},${d.x})`);

  // Add circles to the nodes
  node.append("circle")
    .attr("r", 5)
    .attr("fill", d => {
      if (d.depth === 4) {
        return colorMap[d.data.risk] || "green"; // Use `potential25` color for isco08_4d
      } else if (d.depth === 5) {
        return colorMap[d.data.risk] || "purple"; // Use `task_color` for isco08_5d
      }
      return "black"; // Default for other levels
    });


// Add labels to the nodes
node.append("text")
  .attr("dy", d => {
    if (d.depth === 4) return -10;  // Lift ISCO08 4-digit labels above the dot
    if (d.depth >= 1 && d.depth <= 3) return 15; // Lift ISCO08 1-3 digit labels slightly
    return 3; // Default position for other nodes
  })
  .attr("x", d => {
    if (d.depth === 4) return -80;  // Move ISCO08 4-digit labels to the left
    if (d.depth >= 1 && d.depth <= 3) return -100; // Move ISCO08 1-3 digit labels slightly left
    return d.children ? -10 : 40; // Default positioning for other nodes
  })
  .style("text-anchor", d => d.depth === 4 || (d.depth >= 1 && d.depth <= 3) ? "start" : (d.children ? "end" : "start"))
  .style("font-size", "11px")
  .text(d => d.data.name);




}).catch(error => {
  console.error("Error loading the data:", error);
});
