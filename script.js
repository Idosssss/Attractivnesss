const mean = 5;
const stdDev = 1.5;

const celebrityData = [
  { name: "Zendaya", score: 9.3, img: "https://i.imgur.com/1gX7YhL.jpg" },
  { name: "Timothée Chalamet", score: 8.7, img: "https://i.imgur.com/EgRkFkt.jpg" },
  { name: "Danny DeVito", score: 3.1, img: "https://i.imgur.com/zvWTUVL.jpg" },
  { name: "Ryan Gosling", score: 9.1, img: "https://i.imgur.com/S7lH0Ao.jpg" },
  { name: "Steve Buscemi", score: 4.0, img: "https://i.imgur.com/YvV8oHk.jpg" }
];

const xValues = [];
const yValues = [];

for (let x = 1; x <= 10; x += 0.1) {
  xValues.push(x);
  const y = (1 / (stdDev * Math.sqrt(2 * Math.PI))) *
            Math.exp(-((x - mean) ** 2) / (2 * stdDev ** 2));
  yValues.push(y);
}

const ctx = document.getElementById('bellCurveChart').getContext('2d');
const chart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: xValues,
    datasets: [{
      label: 'Population Distribution',
      data: yValues,
      borderColor: 'blue',
      fill: false,
      pointRadius: 0
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: { display: false }
    },
    scales: {
      x: {
        title: { display: true, text: 'Attractiveness Score' },
        min: 1,
        max: 10
      },
      y: {
        title: { display: true, text: 'Relative Frequency' },
        ticks: { display: false }
      }
    }
  }
});

function showResult() {
  const score = parseFloat(document.getElementById('score').value);
  if (isNaN(score) || score < 1 || score > 10) return;

  chart.data.datasets[1] = {
    label: 'Your Score',
    data: xValues.map(x => x === score ? (1 / (stdDev * Math.sqrt(2 * Math.PI))) *
      Math.exp(-((x - mean) ** 2) / (2 * stdDev ** 2)) : null),
    borderColor: 'red',
    pointBackgroundColor: 'red',
    pointRadius: 5,
    fill: false
  };
  chart.update();

  const matches = celebrityData.filter(c => Math.abs(c.score - score) < 0.5);
  const matchContainer = document.getElementById('celebrityMatches');
  matchContainer.innerHTML = '';
  matches.forEach(c => {
    const card = document.createElement('div');
    card.className = 'celebrity-card';
    card.innerHTML = `<img src="${c.img}" alt="${c.name}" /><p>${c.name} (${c.score})</p>`;
    matchContainer.appendChild(card);
  });
}