// Import utilities
import createApp from "./src/createApp.js";
import createCamera from "./src/createCamera.js";

// Get our <canvas> tag
const canvas = document.querySelector("#canvas");

// Here is our 'sketch' function that wraps the artwork
function sketch() {
  // Our 3D vertex data, a 2D square
  const vertices = [
    [-0.5, 0, -0.5],
    [0.5, 0, -0.5],
    [0.5, 0, 0.5],
    [-0.5, 0, 0.5]
  ];

  // Return a 'render' function that determines how to show the artwork
  return ({ context, width, height, time }) => {
    // Clear buffer
    context.clearRect(0, 0, width, height);

    // Draw background
    context.fillStyle = "hsl(0, 0%, 95%)";
    context.fillRect(0, 0, width, height);

    // Set fill/stroke color
    context.fillStyle = context.strokeStyle = "black";

    // Min dimension of screen
    const dim = Math.min(width, height);

    // Determine the new position of our camera in 3D space
    // It will orbit around in a circle and also span up and down on Y axis
    const curTime = time + 2.5;
    const orbitAngle = curTime * 0.5;
    const orbitDistance = 1;
    const u = Math.cos(orbitAngle) * orbitDistance;
    const v = Math.sin(orbitAngle) * orbitDistance;
    const y = Math.sin(curTime) * orbitDistance * 2;
    const position = [u, y, v];

    // Setup a camera projection function
    const project = createCamera({
      // You can also try using different projection methods
      // mode: "isometric",
      position,
      width,
      height
    });

    // Project 3D points to 2D screen-space positions
    const points2D = vertices.map((v) => project(v));

    // Connect points to form a 3D square
    context.beginPath();
    points2D.forEach((p) => {
      const [x, y] = p;
      context.lineTo(x, y);
    });
    context.closePath();
    context.stroke();

    // Draw each point as a circle
    points2D.forEach((p) => {
      const [x, y] = p;
      context.beginPath();
      context.arc(x, y, dim * 0.01, 0, Math.PI * 2);
      context.fill();
    });
  };
}

// Create our canvas application
createApp(sketch, canvas);
