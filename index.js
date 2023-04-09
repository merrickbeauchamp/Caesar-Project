console.clear();

const slides = document.querySelectorAll("#slide");
let currentSlide = 0;

if (screen.availHeight > screen.availWidth) {
  alert(
    "For the best experience:\nComputer: Please make sure your window is it's maximum size.\nMobile devices: Please use your device horizontally."
  );
}

const changeSlide = (slide) => {
  if (slides.length < slide || currentSlide == slide) return false;
  if (currentSlide !== 0) {
    slides[currentSlide - 1].style["z-index"] = -1;
    slides[currentSlide - 1].style.opacity = 0;
  }
  slides[slide - 1].style["z-index"] = 1;
  slides[slide - 1].style.opacity = 1;
  currentSlide = slide;
  if (currentSlide == 3) {
    startGame();
  }
  return true;
};

changeSlide(1);

function startGame() {
  const canvas = document.getElementById("game");
  kaboom({
    canvas,
    background: [135, 206, 235],
    width: 800,
    height: 400,
  });
  setGravity(2400);

  loadFont("pixel", "./pixel.ttf");

  const centerText = add([
    anchor("center"),
    pos(width() / 2, height() / 2 - 100),
    text("Stab Caesar", {
      font: "pixel",
      size: 50,
    }),
  ]);

  const border = add([
    rect(204, 24),
    pos(width() / 2 - 102, height() / 2 - 2 - 175),
    color(0, 0, 0),
  ]);

  // create a progress bar sprite
  const progressBar = add([
    rect(200, 20),
    pos(width() / 2 - 100, height() / 2 - 175),
    color(183, 9, 8, 255),
  ]);

  add([
    rect(width(), 0.1),
    outline(4),
    pos(0, height()),
    'origin("botleft")',
    area(),
    body({ isStatic: true }),
    opacity(0),
  ]);

  add([
    rect(0.01, height()),
    pos(0, 0),
    body({ isStatic: true }),
    area(),
    opacity(0),
  ]);

  add([
    rect(0.01, height()),
    pos(width() - 0.01, 0),
    body({ isStatic: true }),
    area(),
    opacity(0),
  ]);

  loadSprite("julius", "https://github.com/merrickbeauchamp/Caesar-Project/blob/main/sprites/caesar.png?raw=true");
  const julius = add([
    sprite("julius"),
    pos(120, 80),
    area(),
    body(),
    scale(0.5),
    "julius",
  ]);

  loadSprite("knife", "https://github.com/merrickbeauchamp/Caesar-Project/blob/main/sprites/knife.png?raw=true");
  const knife = add([
    sprite("knife"),
    pos(width() / 2, 80),
    area(),
    "knife",
    scale(0.15),
  ]);

  onMouseMove((pos) => {
    knife.pos = pos;
  });

  const knockback = (sprite, force, angle) => {
    const speed = force / sprite.mass;
    const velocity = vec2(speed * Math.cos(angle), speed * Math.sin(angle));
    sprite.move(velocity);
  };

  loadSprite("blood", "https://github.com/merrickbeauchamp/Caesar-Project/blob/main/sprites/blood.png?raw=true");
  const bloodEffect = (position) => {
    add([
      sprite("blood"),
      pos(position),
      scale(rand(0.1, 0.3)),
      rotate(rand(0, 360)),
      lifespan(1),
    ]);
  };

  const endGame = () => {
    centerText.textSize = 30;
    centerText.text = "Caesar Was Stabbed 23 Times";
    setTimeout(function () {
      changeSlide(currentSlide + 1);
      quit();
    }, 6 * 1000);
  };

  let hits = 23;
  onCollide("julius", "knife", () => {
    hits--;
    const force = 1000;
    const angle = Math.atan2(
      julius.pos.y - knife.pos.y,
      julius.pos.x - knife.pos.x
    );
    shake(10);
    knockback(julius, force, angle);

    bloodEffect(julius.pos);

    progressBar.width = (hits / 23) * 200;
    if (hits == 0) {
      endGame();
    }
  });
}
