let quizData = [];
let currentQuestion = 0;
let correctAnswers = 0;

async function loadQuestions() {
  const response = await fetch("questions.json");
  quizData = await response.json();
  showQuestion(currentQuestion);
}

function showQuestion(index) {
  const q = quizData.Quiz[index];
  document.getElementById("progress").innerHTML = `
    Questão ${index+1} de ${quizData.Quiz.length}
    <div class="progress-bar"><div class="progress-fill" style="width:${(index/quizData.Quiz.length)*100}%"></div></div>
  `;
  document.getElementById("quiz").innerHTML = `
    <div class="question">${q.Question}</div>
    <div class="options">
      ${q.Options.map((opt, i) => `
        <label id="opt${i}">
          <input type="radio" name="q${index}" value="${i}"> ${opt}
        </label>`).join("")}
    </div>
    <button class="btn-primary" onclick="checkAnswer(${index})">Responder</button>
  `;
}

function checkAnswer(index) {
  const q = quizData.Quiz[index];
  const selected = document.querySelector(`input[name="q${index}"]:checked`);
  if (!selected) return alert("Selecione uma opção!");
  const answer = parseInt(selected.value);

  // Destacar todas as opções
  q.Options.forEach((opt, i) => {
    const label = document.getElementById(`opt${i}`);
    if (q.Answer.includes(i)) {
      label.style.background = "#d4edda"; // verde claro
      label.style.border = "2px solid green";
    }
    if (i === answer && !q.Answer.includes(i)) {
      label.style.background = "#f8d7da"; // vermelho claro
      label.style.border = "2px solid red";
    }
  });

  if (q.Answer.includes(answer)) {
    correctAnswers++;
  }

  document.getElementById("quiz").innerHTML += `
    <p class="explanation"><strong>Explicação:</strong> ${q.Explanation}</p>
    ${q.Hint ? `<p class="explanation"><strong>Dica:</strong> ${q.Hint}</p>` : ""}
    <button class="btn-primary" onclick="nextQuestion()">Próxima</button>
  `;
}

function nextQuestion() {
  currentQuestion++;
  if (currentQuestion < quizData.Quiz.length) {
    showQuestion(currentQuestion);
  } else {
    showResult();
  }
}

function showResult() {
  const total = quizData.Quiz.length;
  const score = (correctAnswers / total) * 100;
  let resultMessage = score >= 70
    ? `<div class="result-pass">🎉 Aprovado!</div>`
    : `<div class="result-fail">❌ Reprovado!</div>`;

  document.getElementById("quiz").innerHTML = `
    ${resultMessage}
    <p>Você acertou ${correctAnswers} de ${total} questões.</p>
    <p>Nota final: ${score.toFixed(1)}%</p>
  `;
  document.getElementById("progress").textContent = "";
}

loadQuestions();
