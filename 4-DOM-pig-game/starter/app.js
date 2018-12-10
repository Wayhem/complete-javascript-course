/*
GAME RULES:

- The game has 2 players, playing in rounds
- In each turn, a player rolls a dice as many times as he whishes. Each result get added to his ROUND score
- BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn
- The player can choose to 'Hold', which means that his ROUND score gets added to his GLBAL score. After that, it's the next player's turn
- The first player to reach 100 points on GLOBAL score wins the game

*/

var puntajes, puntajeRonda, jugadorAct, playing, lastRoll0, lastRoll1, winScore;

initGame();

function roll(num) {
    if (num === 1 && document.querySelector('.dice0').style.display == 'none'){
        return;
    }
    var dado = Math.floor(Math.random() * 6) + 1;
    var diceDOM = document.querySelector('.dice' + num);
    var lastRoll;
    diceDOM.style.display = 'block';
    diceDOM.src = 'dice-' + dado + '.png';
    if (num === 0) {
        lastRoll = lastRoll0;
        lastRoll0 = dado;
    } else {
        lastRoll = lastRoll1;
        lastRoll1 = dado;
    }
    if (lastRoll === 6 && dado === 6) {
        puntajes[jugadorAct] = 0;
        document.querySelector('#score-'+jugadorAct).textContent = '0';
        nextPlayer();
        return;
    }
    if (dado !== 1) {
        puntajeRonda += dado;
        document.querySelector('#current-'+jugadorAct).textContent = puntajeRonda;
    } else {
        nextPlayer();
    }
}

document.querySelector('.btn-roll').addEventListener('click', function(){
    if (playing) {
        roll(0);
        roll(1);
    }
});

document.querySelector('.input').addEventListener('keypress', function (e) {
    var key = e.which || e.keyCode;
    if (key === 13) { 
        winScore = e.target.value
        document.querySelector('.input').value = '';
    }
});

document.querySelector('.btn-hold').addEventListener('click', function(){
    if (puntajeRonda && playing) {
        puntajes[jugadorAct] += puntajeRonda;
        document.querySelector('#score-'+jugadorAct).textContent = puntajes[jugadorAct];
        if (puntajes[jugadorAct] >= winScore) {
            document.querySelector('#name-' + jugadorAct).textContent = 'WINNER!';
            document.querySelector('.dice0').style.display = 'none';
            document.querySelector('.dice1').style.display = 'none';
            document.querySelector('.player-' + jugadorAct + '-panel').classList.add('winner');
            document.querySelector('.player-' + jugadorAct + '-panel').classList.remove('active');
            document.querySelector('.btn-roll').style.display = 'none';
            document.querySelector('.btn-hold').style.display = 'none';
            playing = false;
        } else {
            nextPlayer();
        }
    }
});

document.querySelector('.btn-new').addEventListener('click', initGame);

function initGame() {
    puntajes = [0,0];
    puntajeRonda = 0;
    jugadorAct = 0;
    playing = true;
    lastRoll0 = 0;
    lastRoll1 = 0;
    winScore = 20;

    document.querySelector('.player-0-panel').classList.add('active');
    document.querySelector('.player-1-panel').classList.remove('active');

    document.querySelector('.dice0').style.display = 'none';
    document.querySelector('.dice1').style.display = 'none';
    document.querySelector('.btn-roll').style.display = 'block';
    document.querySelector('.btn-hold').style.display = 'block';

    document.getElementById('score-0').textContent = '0';
    document.getElementById('score-1').textContent = '0';
    document.getElementById('current-0').textContent = '0';
    document.getElementById('current-1').textContent = '0';
    document.getElementById('name-0').textContent = 'Player 1';
    document.getElementById('name-1').textContent = 'Player 2';
    document.querySelector('.player-0-panel').classList.remove('winner');
    document.querySelector('.player-1-panel').classList.remove('winner');
    document.querySelector('.player-0-panel').classList.remove('active');
    document.querySelector('.player-0-panel').classList.add('active');
    document.querySelector('.player-1-panel').classList.remove('active');
}

function nextPlayer() {
    jugadorAct === 0 ? jugadorAct = 1 : jugadorAct = 0;
    puntajeRonda = 0;
    lastRoll1 = 0;
    lastRoll0 = 0;
    document.querySelector('#current-0').textContent = '0';
    document.querySelector('#current-1').textContent = '0';
    document.querySelector('.player-0-panel').classList.toggle('active');
    document.querySelector('.player-1-panel').classList.toggle('active');
    document.querySelector('.dice0').style.display = 'none';
    document.querySelector('.dice1').style.display = 'none';
}