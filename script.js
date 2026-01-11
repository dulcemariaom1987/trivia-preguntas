const triviaQuestions = [
    {
        question: "¿Qué significa API en desarrollo web?",
        options: ["Application Programming Interface", "Advanced Program Integration", "Automated Process Implementation", "Application Process Interface"],
        correct: 0,
        category: "Tecnología"
    },
    {
        question: "¿En qué año se creó JavaScript?",
        options: ["1995", "1990", "2000", "1985"],
        correct: 0,
        category: "Programación"
    },
    {
        question: "¿Cuál es el océano más grande del mundo?",
        options: ["Atlántico", "Índico", "Pacífico", "Ártico"],
        correct: 2,
        category: "Geografía"
    },
    {
        question: "¿Qué es React?",
        options: ["Una base de datos", "Una biblioteca de JavaScript", "Un lenguaje de programación", "Un servidor web"],
        correct: 1,
        category: "Tecnología"
    },
    {
        question: "¿Cuál es la capital de Francia?",
        options: ["Londres", "Berlín", "Madrid", "París"],
        correct: 3,
        category: "Geografía"
    },
    {
        question: "¿Qué método HTTP se usa para obtener datos?",
        options: ["POST", "GET", "PUT", "DELETE"],
        correct: 1,
        category: "Programación"
    },
    {
        question: "¿Quién pintó la Mona Lisa?",
        options: ["Van Gogh", "Picasso", "Leonardo da Vinci", "Monet"],
        correct: 2,
        category: "Arte"
    },
    {
        question: "¿Qué significa CSS?",
        options: ["Computer Style Sheets", "Cascading Style Sheets", "Creative Style System", "Code Style Sheets"],
        correct: 1,
        category: "Tecnología"
    },
    {
        question: "¿Cuántos continentes hay en el mundo?",
        options: ["5", "6", "7", "8"],
        correct: 2,
        category: "Geografía"
    },
    {
        question: "¿Qué es Git?",
        options: ["Un editor de código", "Un sistema de control de versiones", "Un navegador web", "Un framework"],
        correct: 1,
        category: "Programación"
    }
];

let gameState = {
    currentQuestion: 0,
    score: 0,
    timeLeft: 15,
    streak: 0,
    selectedAnswer: null,
    correctAnswers: 0,
    timerInterval: null
};

function showScreen(screenId) {
    document.getElementById('startScreen').classList.add('hidden');
    document.getElementById('gameScreen').classList.add('hidden');
    document.getElementById('resultScreen').classList.add('hidden');
    document.getElementById('endScreen').classList.add('hidden');
    document.getElementById(screenId).classList.remove('hidden');
}

function startGame() {
    gameState = {
        currentQuestion: 0,
        score: 0,
        timeLeft: 15,
        streak: 0,
        selectedAnswer: null,
        correctAnswers: 0,
        timerInterval: null
    };
    showScreen('gameScreen');
    loadQuestion();
    startTimer();
}

function loadQuestion() {
    const question = triviaQuestions[gameState.currentQuestion];
    document.getElementById('categoryDisplay').textContent = question.category;
    document.getElementById('questionCounter').textContent = (gameState.currentQuestion + 1) + ' / ' + triviaQuestions.length;
    document.getElementById('questionText').textContent = question.question;
    document.getElementById('scoreDisplay').textContent = gameState.score;
    
    if (gameState.streak > 0) {
        document.getElementById('streakBadge').classList.remove('hidden');
        document.getElementById('streakDisplay').textContent = 'Racha: ' + gameState.streak;
    } else {
        document.getElementById('streakBadge').classList.add('hidden');
    }

    const answersGrid = document.getElementById('answersGrid');
    answersGrid.innerHTML = '';
    
    question.options.forEach(function(option, index) {
        const btn = document.createElement('button');
        btn.className = 'answer-btn';
        btn.onclick = function() { handleAnswer(index); };
        btn.innerHTML = '<span class="answer-letter">' + String.fromCharCode(65 + index) + '</span><span style="flex: 1;">' + option + '</span>';
        answersGrid.appendChild(btn);
    });
}

function startTimer() {
    gameState.timeLeft = 15;
    updateTimerDisplay();
    
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
    }
    
    gameState.timerInterval = setInterval(function() {
        gameState.timeLeft--;
        updateTimerDisplay();
        
        if (gameState.timeLeft <= 0) {
            clearInterval(gameState.timerInterval);
            if (gameState.selectedAnswer === null) {
                handleAnswer(-1);
            }
        }
    }, 1000);
}

function updateTimerDisplay() {
    const timeDisplay = document.getElementById('timeDisplay');
    const timerIcon = document.getElementById('timerIcon');
    timeDisplay.textContent = gameState.timeLeft + 's';
    
    if (gameState.timeLeft <= 5) {
        timeDisplay.classList.add('time-warning');
        timerIcon.style.color = '#f87171';
    } else {
        timeDisplay.classList.remove('time-warning');
        timerIcon.style.color = '#4ade80';
    }
}

function handleAnswer(answerIndex) {
    if (gameState.selectedAnswer !== null) return;
    
    clearInterval(gameState.timerInterval);
    gameState.selectedAnswer = answerIndex;
    
    const question = triviaQuestions[gameState.currentQuestion];
    const isCorrect = answerIndex === question.correct;
    const buttons = document.querySelectorAll('.answer-btn');
    
    buttons.forEach(function(btn, index) {
        btn.disabled = true;
        if (index === question.correct) {
            btn.classList.add('answer-correct');
            btn.innerHTML += '<svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>';
        } else if (index === answerIndex) {
            btn.classList.add('answer-incorrect');
            btn.innerHTML += '<svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>';
        } else {
            btn.classList.add('answer-disabled');
        }
    });
    
    if (isCorrect) {
        const points = gameState.timeLeft > 10 ? 150 : gameState.timeLeft > 5 ? 100 : 50;
        gameState.score += points;
        gameState.streak++;
        gameState.correctAnswers++;
        
        document.getElementById('resultIcon').style.color = '#4ade80';
        document.getElementById('resultIcon').innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>';
        document.getElementById('resultTitle').textContent = '¡Correcto!';
        document.getElementById('resultTitle').className = 'result-title result-correct';
        document.getElementById('resultPoints').textContent = '+' + points + ' puntos';
    } else {
        gameState.streak = 0;
        
        document.getElementById('resultIcon').style.color = '#f87171';
        document.getElementById('resultIcon').innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>';
        document.getElementById('resultTitle').textContent = 'Incorrecto';
        document.getElementById('resultTitle').className = 'result-title result-incorrect';
        document.getElementById('resultPoints').textContent = 'Sigue intentando';
    }
    
    setTimeout(function() {
        showScreen('resultScreen');
        if (gameState.currentQuestion + 1 < triviaQuestions.length) {
            document.getElementById('nextButtonText').textContent = 'Siguiente Pregunta';
        } else {
            document.getElementById('nextButtonText').textContent = 'Ver Resultados';
        }
    }, 1500);
}

function nextQuestion() {
    if (gameState.currentQuestion + 1 < triviaQuestions.length) {
        gameState.currentQuestion++;
        gameState.selectedAnswer = null;
        gameState.timeLeft = 15;
        showScreen('gameScreen');
        loadQuestion();
        startTimer();
    } else {
        showEndScreen();
    }
}

function showEndScreen() {
    document.getElementById('finalScore').textContent = gameState.score + ' puntos';
    document.getElementById('finalStatsText').textContent = 'Respondiste correctamente ' + gameState.correctAnswers + ' de ' + triviaQuestions.length + ' preguntas';
    const percentage = Math.round((gameState.correctAnswers / triviaQuestions.length) * 100);
    document.getElementById('finalPercentage').textContent = percentage + '%';
    showScreen('endScreen');
}
