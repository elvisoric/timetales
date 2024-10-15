// Select the canvas element, get the drawing context, and get the tooltip container element
const canvas = document.getElementById("circleCanvas");
const ctx = canvas.getContext("2d");
const tooltipContainer = document.getElementById("tooltipContainer");

// Set up line and pin properties
const minWidth = 1500; // Minimum canvas width
const minHeight = 500; // Minimum canvas height
let lineY = 100; // This will be dynamically adjusted later
const pinRadius = 10;

const pinPositions = [
  { "percentage": 10, "label": "<strong>Pin 1</strong><br>More <i>HTML</i> content", "isVisible": false, "color": "#ff5733", "tooltipPosition": "above" },
  { "percentage": 25, "label": "<strong>Pin 2</strong><br>This has <u>multiple</u> lines", "isVisible": false, "color": "#33c3ff", "tooltipPosition": "below" },
  { "percentage": 50, "label": "<strong>Pin 3</strong><br>Text with <a href='#'>a link</a>", "isVisible": false, "color": "#33ff57", "tooltipPosition": "above" },
  { "percentage": 75, "label": "<strong>Pin 4</strong><br>Complex <em>HTML</em> here", "isVisible": false, "color": "#ff33a1", "tooltipPosition": "below" },
  { "percentage": 90, "label": "<strong>Pin 5</strong><br>Another <b>pin</b> with HTML", "isVisible": false, "color": "#ff5733", "tooltipPosition": "above" }
];

// Labels for tick markers
const tickLabels = ["Start", "Phase 1", "Phase 2", "Phase 3", "Phase 4", "Phase 5", "End"];

// Legend data
const legendData = [
  { "color": "#ff5733", "label": "Category 1", "isActive": false },
  { "color": "#33c3ff", "label": "Category 2", "isActive": false },
  { "color": "#33ff57", "label": "Category 3", "isActive": false },
  { "color": "#ff33a1", "label": "Category 4", "isActive": false }
];

// Set the canvas size to fill the screen, but ensure it has a minimum size
function resizeCanvas() {
  canvas.width = Math.max(window.innerWidth, minWidth);  // Width is either window width or minimum 
  canvas.height = Math.max(window.innerHeight, minHeight);  // Height is either window height or minimum
  lineY = canvas.height / 2; // Set the line in the middle of the canvas height
  render(); // Redraw the canvas after resizing
}

// Draw a straight line
function drawLine() {
  window.lineStartX = 50; // Make these values globally accessible
  window.lineEndX = canvas.width - 50;

  ctx.beginPath();
  ctx.moveTo(lineStartX, lineY);
  ctx.lineTo(lineEndX, lineY);
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 2;
  ctx.stroke();

  drawTicks(); // Draw ticks for timeline division
}

// Calculate pixel position of a pin based on percentage
function getPinX(percentage) {
  const lineLength = lineEndX - lineStartX;
  return lineStartX + (lineLength * (percentage / 100));
}

// Draw ticks to divide the timeline into 6 equal parts and add labels
function drawTicks() {
  const segmentCount = 6;
  const segmentLength = (lineEndX - lineStartX) / segmentCount;

  for (let i = 0; i <= segmentCount; i++) {
    const tickX = lineStartX + (i * segmentLength);

    // Draw tick marker
    ctx.beginPath();
    ctx.moveTo(tickX, lineY - 10); // Start 10 pixels above the line
    ctx.lineTo(tickX, lineY + 10); // End 10 pixels below the line
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Add label to each tick marker
    ctx.font = "14px Arial";
    ctx.fillStyle = '#000';
    ctx.textAlign = "center";
    ctx.fillText(tickLabels[i], tickX, lineY + 30); // Label below each tick
  }
}

// Draw pins (circles) at specified positions
function drawPins() {
  pinPositions.forEach(pin => {
    const pinX = getPinX(pin.percentage);
    ctx.beginPath();
    ctx.arc(pinX, lineY, pinRadius, 0, Math.PI * 2);
    ctx.fillStyle = pin.color; // Use the custom color for each pin
    ctx.fill();
    ctx.strokeStyle = "#000";
    ctx.stroke();
  });
}

// Draw legend in the bottom-left corner
function drawLegend() {
  const startX = 50;
  const startY = canvas.height - 150; // Position legend near the bottom left corner
  const legendRadius = 10;
  const labelOffsetX = 30;
  const labelOffsetY = 5;

  legendData.forEach((legend, index) => {
    const legendY = startY + index * 30;

    // Draw legend circle
    ctx.beginPath();
    ctx.arc(startX, legendY, legendRadius, 0, Math.PI * 2);
    ctx.fillStyle = legend.color;
    ctx.fill();
    ctx.strokeStyle = "#000";
    ctx.stroke();

    // Draw legend label
    ctx.font = "14px Arial";
    ctx.fillStyle = '#000';
    ctx.textAlign = "left";
    ctx.fillText(legend.label, startX + labelOffsetX, legendY + labelOffsetY);
  });
}

// Clear the canvas and redraw the line, pins, ticks, and legend
function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawLine();
  drawPins();
  drawLegend();
}

// Check if a point (mouseX, mouseY) is inside a circle (pin)
function isInsideCircle(mouseX, mouseY, pinX, pinY, radius) {
  const distance = Math.sqrt((mouseX - pinX) ** 2 + (mouseY - pinY) ** 2);
  return distance <= radius;
}

// Function to toggle the visibility of HTML tooltips for a specific color
function toggleTooltipsByColor(color) {
  pinPositions.forEach((pin, index) => {
    if (pin.color === color) {
      const pinTooltip = tooltipContainer.children[index];
      toggleTooltip(pin, pinTooltip, getPinX(pin.percentage), lineY);
    }
  });
}

// Function to toggle the visibility of HTML tooltips
function toggleTooltip(pin, pinElement, pinX, pinY) {
  if (pin.isVisible) {
    // Hide the tooltip
    pinElement.style.display = 'none';
    pin.isVisible = false;
  } else {
    // Set HTML content inside the tooltip
    pinElement.innerHTML = pin.label;
    
    // First, set the tooltip to 'block' to get its size (hidden elements have zero width/height)
    pinElement.style.display = 'block';

    // Center the tooltip horizontally over the pin
    pinElement.style.left = `${pinX - pinElement.offsetWidth / 2}px`; // Offset left by half of tooltip's width

    // Set the tooltip position based on `tooltipPosition` property
    if (pin.tooltipPosition === "above") {
      // Position the tooltip above the pin
      pinElement.style.bottom = `${canvas.height - pinY + pinRadius + 20}px`; // Tooltip 20px above the pin
    } else if (pin.tooltipPosition === "below") {
      // Position the tooltip below the pin
      pinElement.style.bottom = `${canvas.height - pinY - pinRadius - pinElement.offsetHeight - 20}px`; // Tooltip 20px below the pin
    }

    pin.isVisible = true;
  }
}

// Function to create tooltips for each pin
function createTooltips() {
  // Clear previous tooltips
  tooltipContainer.innerHTML = '';

  pinPositions.forEach(pin => {
    const pinTooltip = document.createElement('div');
    pinTooltip.classList.add('tooltip');
    tooltipContainer.appendChild(pinTooltip);
    
    // Initially set tooltip hidden
    pinTooltip.style.display = 'none';
  });
}

// Add interactivity: when the user clicks on a pin or legend, toggle the tooltip or visibility
canvas.addEventListener('click', function(event) {
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  // Check if legend is clicked
  const legendClickTolerance = 15;
  legendData.forEach((legend, index) => {
    const legendCircleX = 50; // X position of legend circles
    const legendCircleY = canvas.height - 150 + index * 30;

    if (isInsideCircle(mouseX, mouseY, legendCircleX, legendCircleY, legendClickTolerance)) {
      legend.isActive = !legend.isActive; // Toggle legend active state
      toggleTooltipsByColor(legend.color); // Toggle tooltips for this color
    }
  });

  // Check if any pin is clicked
  pinPositions.forEach((pin, index) => {
    const pinX = getPinX(pin.percentage);
    const pinTooltip = tooltipContainer.children[index];
    if (isInsideCircle(mouseX, mouseY, pinX, lineY, pinRadius)) {
      // Toggle the tooltip visibility for this pin
      toggleTooltip(pin, pinTooltip, pinX, lineY);
    }
  });

  // Redraw the canvas to reflect any changes
  render();
});

// Set up an event listener to resize the canvas when the window size changes
window.addEventListener('resize', resizeCanvas);

// Initial setup
resizeCanvas();
createTooltips();

