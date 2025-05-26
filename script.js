const mean = 5;
const stdDev = 1.5;

const celebrityData = [
  { name: "Zendaya", score: 7.3, img: "https://i.imgur.com/1gX7YhL.jpg" },
  { name: "Timothée Chalamet", score: 8.1, img: "https://i.imgur.com/EgRkFkt.jpg" },
  { name: "Danny DeVito", score: 1.7, img: "https://i.imgur.com/zvWTUVL.jpg" },
  { name: "Ryan Gosling", score: 9.1, img: "https://i.imgur.com/S7lH0Ao.jpg" },
  { name: "Steve Buscemi", score: 2.5, img: "https://i.imgur.com/YvV8oHk.jpg" }
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
    datasets: [
      {
        label: 'Population Distribution',
        data: yValues,
        borderColor: 'blue',
        fill: false,
        pointRadius: 0
      },
      {
        label: 'Your Score',
        data: new Array(xValues.length).fill(null),
        borderColor: 'red',
        pointBackgroundColor: 'red',
        pointRadius: 5,
        fill: false,
        showLine: false
      }
    ]
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

  // Update the red dot on the chart
  const redData = xValues.map(x => Math.abs(x - score) < 0.05 ? (1 / (stdDev * Math.sqrt(2 * Math.PI))) *
    Math.exp(-((x - mean) ** 2) / (2 * stdDev ** 2)) : null);

  chart.data.datasets[1].data = redData;
  chart.update();

  // Calculate percentile
  const percentile = normalCDF(score, mean, stdDev);
  const percentileText = `You are in the top ${(100 - percentile * 100).toFixed(1)}%`;

  // Display celebrity matches
  const matches = celebrityData.filter(c => Math.abs(c.score - score) < 0.5);
  const matchContainer = document.getElementById('celebrityMatches');
  matchContainer.innerHTML = `<h3>${percentileText}</h3>`;
  matches.forEach(c => {
    const card = document.createElement('div');
    card.className = 'celebrity-card';
    card.innerHTML = `<img src="${c.img}" alt="${c.name}" /><p>${c.name} (${c.score})</p>`;
    matchContainer.appendChild(card);
  });
}

function normalCDF(x, mean, std) {
  return (1 - mathErf((mean - x) / (Math.sqrt(2) * std))) / 2;
}

function mathErf(x) {
  // Approximation of error function
  const sign = x >= 0 ? 1 : -1;
  x = Math.abs(x);

  const a1 =  0.254829592;
  const a2 = -0.284496736;
  const a3 =  1.421413741;
  const a4 = -1.453152027;
  const a5 =  1.061405429;
  const p  =  0.3275911;

  const t = 1 / (1 + p * x);
  const y = 1 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

  return sign * y;
}