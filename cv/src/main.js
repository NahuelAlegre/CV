const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const ui = {
  level: document.getElementById('level'),
  health: document.getElementById('health'),
  damage: document.getElementById('damage'),
  coins: document.getElementById('coins'),
  score: document.getElementById('score'),
  status: document.getElementById('status')
};

const W = canvas.width;
const H = canvas.height;
const lanes = [W * 0.35, W * 0.5, W * 0.65];

const state = {
  t: 0,
  speed: 3.2,
  lane: 1,
  x: lanes[1],
  y: H - 80,
  health: 1,
  damage: 1,
  coins: 0,
  score: 0,
  level: 1,
  dead: false,
  rows: [],
  bullets: [],
  enemyBullets: [],
  touchX: null
};

function spawnRow(y = -120) {
  const roll = Math.random();
  if (roll < 0.45) {
    const goodLane = Math.floor(Math.random() * 3);
    state.rows.push({ type: 'gates', y, goodLane, badPenalty: 0.6, goodBoost: 0.5 });
  } else {
    const occupied = new Set([Math.floor(Math.random() * 3), Math.floor(Math.random() * 3)]);
    state.rows.push({ type: 'enemies', y, occupied: [...occupied] });
  }
}
for (let i = 0; i < 5; i++) spawnRow(-i * 180);

function shootPlayer() {
  state.bullets.push({ x: state.x, y: state.y - 25, vy: -8, dmg: state.damage });
}
setInterval(() => !state.dead && shootPlayer(), 350);

function moveLane(dir) {
  state.lane = Math.max(0, Math.min(2, state.lane + dir));
}
addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') moveLane(-1);
  if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') moveLane(1);
  if (e.key.toLowerCase() === 'r' && state.dead) location.reload();
});
canvas.addEventListener('pointerdown', e => state.touchX = e.clientX);
canvas.addEventListener('pointermove', e => {
  if (state.touchX == null) return;
  const dx = e.clientX - state.touchX;
  if (Math.abs(dx) > 25) {
    moveLane(dx > 0 ? 1 : -1);
    state.touchX = e.clientX;
  }
});
canvas.addEventListener('pointerup', () => state.touchX = null);

function update() {
  if (state.dead) return;
  state.t += 1;
  state.x += (lanes[state.lane] - state.x) * 0.2;
  state.score += 1;

  for (const row of state.rows) {
    row.y += state.speed;
    if (row.type === 'enemies' && Math.random() < 0.03) {
      row.occupied.forEach(l => {
        state.enemyBullets.push({ x: lanes[l], y: row.y + 8, vy: 5 });
      });
    }
    if (row.y > state.y - 40 && row.y < state.y + 8) {
      if (row.type === 'gates') {
        if (state.lane === row.goodLane) {
          state.damage += row.goodBoost;
          state.coins += 2;
          ui.status.textContent = 'Blue gate! Damage and ammo boosted.';
        } else {
          state.health = Math.max(0, state.health - row.badPenalty);
          ui.status.textContent = 'Red gate penalty!';
        }
        row.hit = true;
      }
      if (row.type === 'enemies' && row.occupied.includes(state.lane)) {
        state.health = Math.max(0, state.health - 0.35);
        ui.status.textContent = 'You ran into enemies!';
      }
    }
  }

  state.rows = state.rows.filter(r => r.y < H + 80);
  if (state.rows.length < 6) spawnRow();

  state.bullets.forEach(b => b.y += b.vy);
  state.enemyBullets.forEach(b => b.y += b.vy);
  state.bullets = state.bullets.filter(b => b.y > -40);
  state.enemyBullets = state.enemyBullets.filter(b => b.y < H + 40);

  state.enemyBullets.forEach(b => {
    if (Math.abs(b.x - state.x) < 16 && Math.abs(b.y - state.y) < 18) {
      state.health = Math.max(0, state.health - 0.15);
      b.y = H + 200;
    }
  });

  if (state.health <= 0) {
    state.dead = true;
    ui.status.textContent = 'Game over. Press R to restart.';
  }

  state.level = 1 + Math.floor(state.score / 1000);
  state.speed = 3.2 + state.level * 0.15;

  ui.level.textContent = state.level;
  ui.health.textContent = state.health.toFixed(1);
  ui.damage.textContent = state.damage.toFixed(1);
  ui.coins.textContent = state.coins;
  ui.score.textContent = state.score;
}

function draw() {
  ctx.clearRect(0, 0, W, H);

  ctx.fillStyle = '#e5b98d';
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#453b55';
  ctx.fillRect(W * 0.2, 0, W * 0.6, H);
  ctx.strokeStyle = '#7e7391';
  ctx.lineWidth = 2;
  ctx.strokeRect(W * 0.2, 0, W * 0.6, H);

  ctx.setLineDash([16, 14]);
  ctx.strokeStyle = '#978ca9';
  ctx.beginPath();
  ctx.moveTo(W * 0.5, 0);
  ctx.lineTo(W * 0.5, H);
  ctx.stroke();
  ctx.setLineDash([]);

  for (const row of state.rows) {
    if (row.type === 'gates') {
      for (let l = 0; l < 3; l++) {
        ctx.fillStyle = l === row.goodLane ? '#22a8ff' : '#ff3848';
        ctx.fillRect(lanes[l] - 30, row.y, 60, 54);
      }
    } else {
      row.occupied.forEach(l => {
        ctx.fillStyle = '#d6273d';
        ctx.beginPath();
        ctx.arc(lanes[l], row.y + 20, 13, 0, Math.PI * 2);
        ctx.fill();
      });
    }
  }

  ctx.fillStyle = '#4fc3ff';
  ctx.beginPath();
  ctx.arc(state.x, state.y - 12, 9, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#2f3f5c';
  ctx.fillRect(state.x - 8, state.y - 8, 16, 24);

  ctx.fillStyle = '#f4e16f';
  state.bullets.forEach(b => ctx.fillRect(b.x - 2, b.y, 4, 10));
  ctx.fillStyle = '#ff6767';
  state.enemyBullets.forEach(b => ctx.fillRect(b.x - 2, b.y, 4, 9));

  if (state.dead) {
    ctx.fillStyle = 'rgba(0,0,0,.45)';
    ctx.fillRect(0,0,W,H);
    ctx.fillStyle = '#fff';
    ctx.font = '700 34px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', W/2, H/2);
  }
}

function frame() {
  update();
  draw();
  requestAnimationFrame(frame);
}
frame();
