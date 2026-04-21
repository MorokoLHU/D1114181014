const lanes = [
    document.getElementById('lane-0'), 
    document.getElementById('lane-1'), 
    document.getElementById('lane-2'), 
    document.getElementById('lane-3')
];
const feedbackEl = document.getElementById('feedback');
const scoreEl = document.getElementById('score');
const timerEl = document.getElementById('timer');
const bpmInput = document.getElementById('bpm-input');
const modeBtns = document.querySelectorAll('.mode-btn');

let score = 0, timeLeft = 60, gameActive = false, notes = [];
let stats = { perfect: 0, good: 0, miss: 0 };
let currentMode = 'normal'; // 預設模式
let ladderIndex = 0, ladderDirection = 1;
let gameInterval, spawnInterval, timerInterval;

const KEYS = ['d', 'f', 'j', 'k'];
const JUDGE_Y = 520; 

// 模式按鈕切換邏輯
modeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        modeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentMode = btn.dataset.mode;
    });
});

document.getElementById('start-btn').onclick = startGame;
document.getElementById('restart-btn').onclick = () => location.reload();

function startGame() {
    score = 0; timeLeft = 60; notes = [];
    stats = { perfect: 0, good: 0, miss: 0 };
    document.getElementById('start-screen').classList.add('hidden');
    gameActive = true;

    const bpm = parseInt(bpmInput.value) || 120;
    const spawnRate = 60000 / bpm;
    const speed = (bpm / 60) * 6;

    spawnInterval = setInterval(() => spawnNote(speed), spawnRate);
    timerInterval = setInterval(() => {
        timeLeft--;
        timerEl.innerText = timeLeft;
        if (timeLeft <= 0) endGame();
    }, 1000);

    gameLoop();
}

function spawnNote(speed) {
    let laneIndex;
    if (currentMode === 'ladder') {
        laneIndex = ladderIndex;
        ladderIndex += ladderDirection;
        if (ladderIndex >= 3 || ladderIndex <= 0) ladderDirection *= -1;
    } else {
        laneIndex = Math.floor(Math.random() * 4);
    }

    const noteEl = document.createElement('div');
    noteEl.className = `note note-${laneIndex}`;
    lanes[laneIndex].appendChild(noteEl);
    notes.push({ el: noteEl, lane: laneIndex, y: 0, speed: speed });
}

function gameLoop() {
    if (!gameActive) return;
    for (let i = notes.length - 1; i >= 0; i--) {
        let n = notes[i];
        n.y += n.speed;
        n.el.style.top = n.y + 'px';
        if (n.y > 600) {
            showFeedback('MISS', 'miss');
            stats.miss++;
            n.el.remove();
            notes.splice(i, 1);
        }
    }
    requestAnimationFrame(gameLoop);
}

window.onkeydown = (e) => {
    if (!gameActive) return;
    const key = e.key.toLowerCase();
    const idx = KEYS.indexOf(key);
    if (idx !== -1) {
        lanes[idx].querySelector('.key-label').style.color = 'cyan';
        checkHit(idx);
    }
};

window.onkeyup = (e) => {
    const idx = KEYS.indexOf(e.key.toLowerCase());
    if (idx !== -1) lanes[idx].querySelector('.key-label').style.color = '';
};

function checkHit(lane) {
    const hitNote = notes.find(n => n.lane === lane && Math.abs(n.y - JUDGE_Y) < 70);
    if (hitNote) {
        const dist = Math.abs(hitNote.y - JUDGE_Y);
        if (dist < 25) {
            showFeedback('PERFECT', 'perfect');
            score += 100; stats.perfect++;
        } else {
            showFeedback('GOOD', 'good');
            score += 50; stats.good++;
        }
        hitNote.el.remove();
        notes = notes.filter(n => n !== hitNote);
        scoreEl.innerText = score;
    }
}

function showFeedback(text, cls) {
    feedbackEl.innerText = text;
    feedbackEl.className = cls;
}

function endGame() {
    gameActive = false;
    clearInterval(spawnInterval);
    clearInterval(timerInterval);
    document.getElementById('final-score').innerText = score;
    document.getElementById('count-perfect').innerText = stats.perfect;
    document.getElementById('count-good').innerText = stats.good;
    document.getElementById('count-miss').innerText = stats.miss;
    document.getElementById('result-screen').classList.remove('hidden');
}