const questionBank = [
  {
    question: "Which HTML tag is used for the largest heading?",
    options: ["<head>", "<h6>", "<h1>", "<header>"],
    answer: 2,
    explanation: "The <h1> element represents the highest-level heading."
  },
  {
    question: "Which HTML tag creates a hyperlink?",
    options: ["<a>", "<link>", "<href>", "<url>"],
    answer: 0,
    explanation: "The <a> element creates a hyperlink, usually with an href attribute."
  },
  {
    question: "Which attribute provides alternative text for an image?",
    options: ["src", "alt", "href", "width"],
    answer: 1,
    explanation: "The alt attribute provides a text alternative for an image."
  },
  {
    question: "Which CSS property changes the text color?",
    options: ["font-size", "background-color", "color", "text-align"],
    answer: 2,
    explanation: "The color property sets the foreground color of text."
  },
  {
    question: "Which CSS property adds space inside an element's border?",
    options: ["margin", "padding", "outline", "gap"],
    answer: 1,
    explanation: "Padding is the space between an element's content and its border."
  },
  {
    question: "Which CSS layout tool arranges items in a flexible row or column?",
    options: ["Flexbox", "SQL", "DOM parser", "Media file"],
    answer: 0,
    explanation: "Flexbox is a CSS layout system for arranging items in rows or columns."
  },
  {
    question: "Which HTML element is used to create a table row?",
    options: ["<td>", "<th>", "<tr>", "<table-row>"],
    answer: 2,
    explanation: "The <tr> element defines a row in an HTML table."
  },
  {
    question: "Which JavaScript keyword declares a block-scoped variable that can be reassigned?",
    options: ["const", "let", "class", "static"],
    answer: 1,
    explanation: "let declares a block-scoped variable that can be reassigned."
  },
  {
    question: "Which JavaScript event is commonly triggered when a user clicks a button?",
    options: ["hover", "submit-only", "click", "resize-only"],
    answer: 2,
    explanation: "The click event runs a handler when the user clicks an element."
  },
  {
    question: "Which method selects an element by its ID in JavaScript?",
    options: ["document.getElementById()", "document.getClass()", "window.selectId()", "document.findTag()"],
    answer: 0,
    explanation: "document.getElementById() returns the element with the specified ID."
  },
  {
    question: "What is the main purpose of Bootstrap?",
    options: ["Manage databases", "Build responsive web interfaces", "Replace HTML", "Run server hardware"],
    answer: 1,
    explanation: "Bootstrap provides CSS and JavaScript tools for building responsive interfaces."
  },
  {
    question: "Which Bootstrap class makes a container take the full available width?",
    options: [".container", ".container-fluid", ".row", ".col-only"],
    answer: 1,
    explanation: "The .container-fluid class creates a full-width responsive container."
  },
  {
    question: "Which HTML tag is used to insert a line break?",
    options: ["<lb>", "<break>", "<br>", "<hr>"],
    answer: 2,
    explanation: "The <br> element inserts a line break."
  },
  {
    question: "Which CSS property controls the size of text?",
    options: ["font-size", "text-weight", "font-color", "text-style"],
    answer: 0,
    explanation: "The font-size property controls the size of text."
  },
  {
    question: "Which HTML form element lets users choose one option from a drop-down list?",
    options: ["<textarea>", "<select>", "<optionlist>", "<datalist-only>"],
    answer: 1,
    explanation: "The <select> element creates a drop-down list, with choices defined by option elements."
  }
];

const QUIZ_LENGTH = 5;
const TOTAL_SECONDS = 120;
let questions = [];
let currentIndex = 0;
let selectedAnswers = [];
let secondsLeft = TOTAL_SECONDS;
let timerId = null;
let quizFinished = false;

const $ = (id) => document.getElementById(id);
const optionsBox = $("options");
const nextBtn = $("nextBtn");
const timerEl = $("timer");
const timerCard = document.querySelector(".timer-card");

function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function startQuiz() {
  clearInterval(timerId);
  questions = shuffle(questionBank).slice(0, QUIZ_LENGTH);
  currentIndex = 0;
  selectedAnswers = Array(QUIZ_LENGTH).fill(null);
  secondsLeft = TOTAL_SECONDS;
  quizFinished = false;
  $("resultCard").classList.add("hidden");
  document.querySelector(".quiz-card").classList.remove("hidden");
  $("scorePreview").textContent = "Score: 0";
  nextBtn.disabled = true;
  updateTimer();
  renderQuestion();
  timerId = setInterval(() => {
    secondsLeft -= 1;
    updateTimer();
    if (secondsLeft <= 0) finishQuiz(true);
  }, 1000);
}

function updateTimer() {
  const minutes = Math.floor(secondsLeft / 60).toString().padStart(2, "0");
  const seconds = (secondsLeft % 60).toString().padStart(2, "0");
  timerEl.textContent = `${minutes}:${seconds}`;
  timerCard.classList.toggle("urgent", secondsLeft <= 20);
}

function renderProgress() {
  const track = $("progressTrack");
  track.innerHTML = "";
  questions.forEach((q, i) => {
    const segment = document.createElement("span");
    segment.className = "progress-segment";
    if (selectedAnswers[i] !== null) {
      segment.classList.add(selectedAnswers[i] === q.answer ? "correct" : "incorrect");
    } else if (i === currentIndex) {
      segment.classList.add("current");
    }
    track.appendChild(segment);
  });
}

function renderQuestion() {
  const item = questions[currentIndex];
  $("questionCounter").textContent = `Question ${currentIndex + 1} of ${questions.length}`;
  $("questionTitle").textContent = item.question;
  $("questionHelp").textContent = "Choose one answer below.";
  $("feedback").textContent = "";
  $("feedback").className = "feedback";
  optionsBox.innerHTML = "";
  nextBtn.disabled = selectedAnswers[currentIndex] === null;
  nextBtn.textContent = currentIndex === questions.length - 1 ? "See results →" : "Next question →";

  item.options.forEach((option, i) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "option-btn";
    button.innerHTML = `<span class="option-letter">${String.fromCharCode(65 + i)}</span><span></span>`;
    button.querySelector("span:last-child").textContent = option;
    button.addEventListener("click", () => selectAnswer(i));
    optionsBox.appendChild(button);
  });

  if (selectedAnswers[currentIndex] !== null) showAnswer(selectedAnswers[currentIndex]);
  renderProgress();
}

function selectAnswer(index) {
  if (selectedAnswers[currentIndex] !== null || quizFinished) return;
  selectedAnswers[currentIndex] = index;
  showAnswer(index);
  nextBtn.disabled = false;
  $("scorePreview").textContent = `Score: ${getScore()}`;
  renderProgress();
}

function showAnswer(selected) {
  const item = questions[currentIndex];
  [...optionsBox.children].forEach((button, i) => {
    button.disabled = true;
    if (i === item.answer) button.classList.add("correct");
    if (i === selected && selected !== item.answer) button.classList.add("incorrect");
  });
  const feedback = $("feedback");
  if (selected === item.answer) {
    feedback.textContent = `✓ Correct! ${item.explanation}`;
    feedback.classList.add("good");
  } else {
    feedback.textContent = `✕ Not quite. ${item.explanation}`;
    feedback.classList.add("bad");
  }
}

function getScore() {
  return questions.reduce((score, q, i) => score + (selectedAnswers[i] === q.answer ? 1 : 0), 0);
}

nextBtn.addEventListener("click", () => {
  if (selectedAnswers[currentIndex] === null) return;
  if (currentIndex < questions.length - 1) {
    currentIndex += 1;
    renderQuestion();
  } else {
    finishQuiz(false);
  }
});

function finishQuiz(timeExpired) {
  if (quizFinished) return;
  quizFinished = true;
  clearInterval(timerId);
  const score = getScore();
  const attempted = selectedAnswers.filter((answer) => answer !== null).length;
  const wrong = questions.length - score;
  const percent = Math.round((score / questions.length) * 100);
  document.querySelector(".quiz-card").classList.add("hidden");
  $("resultCard").classList.remove("hidden");
  $("resultHeading").textContent = percent >= 80 ? "Excellent work!" : percent >= 50 ? "Good effort!" : "Keep practising!";
  $("resultSummary").textContent = timeExpired
    ? "Time is up. Here is your final result."
    : "You have completed all questions. Your result is ready.";
  $("correctCount").textContent = score;
  $("wrongCount").textContent = wrong;
  $("percentage").textContent = `${percent}%`;
  $("scorePreview").textContent = `Score: ${score}`;
}

function downloadPDF() {
  if (!window.jspdf || !window.jspdf.jsPDF) {
    alert("PDF library could not load. Please connect to the internet and try again.");
    return;
  }
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF();
  const score = getScore();
  const percent = Math.round((score / questions.length) * 100);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(20);
  pdf.text("QuizMaster - Quiz Result", 18, 22);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(11);
  pdf.text(`Date: ${new Date().toLocaleString()}`, 18, 33);
  pdf.text(`Total questions: ${questions.length}`, 18, 43);
  pdf.text(`Correct answers: ${score}`, 18, 51);
  pdf.text(`Incorrect or skipped: ${questions.length - score}`, 18, 59);
  pdf.text(`Final percentage: ${percent}%`, 18, 67);
  pdf.setDrawColor(210, 215, 230);
  pdf.line(18, 74, 192, 74);
  let y = 84;
  pdf.setFont("helvetica", "bold");
  pdf.text("Answer review", 18, y);
  y += 9;
  questions.forEach((q, i) => {
    const answer = selectedAnswers[i] === null ? "Skipped" : q.options[selectedAnswers[i]];
    const status = selectedAnswers[i] === q.answer ? "Correct" : "Incorrect / skipped";
    const questionLines = pdf.splitTextToSize(`${i + 1}. ${q.question}`, 174);
    pdf.setFont("helvetica", "bold");
    pdf.text(questionLines, 18, y);
    y += questionLines.length * 5 + 2;
    pdf.setFont("helvetica", "normal");
    const answerLines = pdf.splitTextToSize(`Your answer: ${answer} | ${status}`, 174);
    pdf.text(answerLines, 22, y);
    y += answerLines.length * 5 + 2;
    const correctLines = pdf.splitTextToSize(`Correct answer: ${q.options[q.answer]}`, 174);
    pdf.text(correctLines, 22, y);
    y += correctLines.length * 5 + 5;
    if (y > 265 && i < questions.length - 1) { pdf.addPage(); y = 20; }
  });
  pdf.save("QuizMaster-Result.pdf");
}

$("downloadBtn").addEventListener("click", downloadPDF);
$("restartBtn").addEventListener("click", startQuiz);
$("playAgainBtn").addEventListener("click", startQuiz);
$("themeBtn").addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  $("themeBtn").textContent = isDark ? "☀️ Light mode" : "🌙 Dark mode";
});
startQuiz();
