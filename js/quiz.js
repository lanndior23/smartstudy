const urlParams = new URLSearchParams(window.location.search);
const topic = urlParams.get('topic');

const topicToCategory = {
  programming: 18,       // Computers
  webdev: 18,
  cybersecurity: 18,
  networking: 18,
  databases: 18
};

let questions = [];
let currentQuestion = 0;
let score = 0;

const questionBox = document.getElementById('question');
const answersBox = document.getElementById('answers');
const nextBtn = document.getElementById('next-btn');
const resultBox = document.getElementById('result');
const scoreText = document.getElementById('score');

// Ensure Firebase is initialized and these are defined:
const auth = firebase.auth();
const db = firebase.firestore();

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function showQuestion() {
  if (!questions.length) return;
  const q = questions[currentQuestion];
  questionBox.innerHTML = q.question;
  const answers = [...q.incorrect_answers, q.correct_answer];
  shuffle(answers);

  answersBox.innerHTML = '';
  answers.forEach(ans => {
    const btn = document.createElement('button');
    btn.className = 'answer-btn';
    btn.innerHTML = ans;
    btn.onclick = () => selectAnswer(btn, ans === q.correct_answer);
    answersBox.appendChild(btn);
  });

  nextBtn.style.display = "none";
}

function selectAnswer(btn, isCorrect) {
  Array.from(answersBox.children).forEach(b => {
    b.disabled = true;
    if (b.innerHTML === questions[currentQuestion].correct_answer) {
      b.style.background = "#10b981";
      b.style.color = "#fff";
    } else {
      b.style.background = "#ef4444";
      b.style.color = "#fff";
    }
  });
  if (isCorrect) score++;
  nextBtn.style.display = "block";
}

nextBtn.onclick = () => {
  currentQuestion++;
  if (currentQuestion < questions.length) {
    showQuestion();
  } else {
    showResult();
  }
};

async function fetchQuestions() {
  const categoryId = topicToCategory[topic] || 18; // default: 18
  try {
    const res = await fetch(`https://opentdb.com/api.php?amount=5&category=${categoryId}&type=multiple`);
    const data = await res.json();
    if (!data.results || data.results.length === 0) {
      questionBox.innerHTML = "No questions found for this topic.";
      return;
    }
    questions = data.results;
    showQuestion();
  } catch (err) {
    questionBox.innerHTML = "Failed to fetch questions.";
    console.error(err);
  }
}

// Call fetchQuestions when the page loads
window.addEventListener('DOMContentLoaded', fetchQuestions);

function showResult() {
  document.getElementById('quiz-container').style.display = "none";
  resultBox.style.display = "block";
  scoreText.textContent = `${score} / ${questions.length}`;

  // Save to Firebase if user logged in
  auth.onAuthStateChanged(user => {
    if (user) {
      db.collection("quiz_scores").add({
        uid: user.uid,
        topic: topic, // This should be a string like "programming", "webdev", etc.
        score: score,
        total: questions.length,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      }).then(() => {
        console.log("Score saved");
      }).catch(err => console.error("Error saving score:", err));
    }
  });
}
