// Get the canvas element and set up a 2D drawing context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Initialize counter at top of file
let counter = 0;

// Increase canvas height and width to make the game area larger
canvas.height = 900;
canvas.width = 700;

// Add border around the game area
ctx.strokeStyle = 'black';
ctx.lineWidth = 20;
ctx.strokeRect(0, 0, canvas.width, canvas.height);

// Create a basic ball object with properties (x, y, velocity) and methods (draw(), update())
class Ball {
  constructor(x, y, radius, velocityX, velocityY) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.velocityX = velocityX;
    this.velocityY = velocityY;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'green';
    ctx.fill();
  }

  update() {
    this.x += this.velocityX;
    this.y += this.velocityY;

    // Add collision detection for the ball
    if (this.y + this.radius > canvas.height) {
      this.y = canvas.height - this.radius;
      counter = 0; // Reset counter when ball hits bottom border
      this.velocityY *= -1; // Reverse velocity on bounce
    }

    if (this.x < 0 || this.x > canvas.width) {

      this.x = Math.min(canvas.width, Math.max(0, this.x));
      this.y = canvas.height / 2;
      this.velocityX = -this.velocityX;
    }

    // Update collision detection for ball on side borders
    if (this.x - this.radius < 0) {
      this.x = this.radius;
      this.velocityX *= -1; // Reverse velocity on bounce
    }
    if (this.x + this.radius > canvas.width) {
      this.x = canvas.width - this.radius;
      this.velocityX *= -1; // Reverse velocity on bounce
    }

    // Update collision detection for ball on top border
    if (this.y - this.radius < 0) {
        this.y = this.radius;
      this.velocityY *= -1; // Reverse velocity on bounce
    }

    // Update collision detection for ball on platform
    const platformRect = { x: platform.x, y: platform.y, width: platform.width, height: platform.height };
    if (this.x + this.radius > platformRect.x && this.x - this.radius < platformRect.x + platformRect.width &&
        this.y + this.radius > platformRect.y && this.y - this.radius < platformRect.y + platformRect.height) {
      counter++;
      this.velocityY = -this.velocityY * 1.1; // Increase speed by 1% each hit and reverse velocity
    }

    // Update collision detection for ball on bottom border
    if (this.y + this.radius > canvas.height) {
      counter = 0;
      this.velocityX = 0; // Reset speed to zero when hitting the bottom border
    }
  }
}

// Create a platform object with properties (x, y, width, height)
class Platform {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  draw() {
    ctx.fillStyle = 'blue';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

// Create instances of the Ball and Platform classes
const ball = new Ball(canvas.width / 2, canvas.height / 2, 20, 2, -2);
const platform = new Platform(0, canvas.height - 60, 100, 10);

// Main game loop
function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ball.update();
  ball.draw();

  // Draw counter at top of screen
  ctx.font = '24px Arial';
  ctx.fillStyle = 'black';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText(`Score: ${counter}`, 10, 10);

  platform.draw();

  requestAnimationFrame(update);
}

update();

// Function to get mouse position
function getMousePosition(e) {
  const rect = canvas.getBoundingClientRect();
  return { x: e.clientX - rect.left, y: e.clientY - rect.top };
}

canvas.addEventListener('mousemove', (e) => {
  const mousePos = getMousePosition(e);
  // Update the platform's position based on the mouse position
  platform.x = mousePos.x;
});

