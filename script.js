const API_URL = 'https://restcountries.com/v3.1/all';
const regionSelect = document.getElementById('region-select');
const showDataBtn = document.getElementById('show-data-btn');
const chartContainer = document.getElementById('chart-container');
const tableBody = document.querySelector('#data-table tbody');
const darkModeToggle = document.getElementById('dark-mode-toggle');

let chart;

const fetchData = async () => {
  const response = await fetch(API_URL);
  return response.json();
};

const updateChart = (countries) => {
  const labels = countries.map(country => country.name.common);
  const data = countries.map(country => country.population);

  if (chart) {
    chart.destroy();
  }

  chart = new Chart(document.getElementById('populationChart').getContext('2d'), {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Population',
        data,
        backgroundColor: labels.map(() => {
          return `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.6)`;
        }),
      }]
    },
    options: {
      responsive: true,
      scales: { y: { beginAtZero: true } }
    }
  });
};

const updateTable = (countries) => {
  tableBody.innerHTML = '';
  countries.forEach(country => {
    const row = `
      <tr>
        <td>${country.name.common}</td>
        <td>${country.population.toLocaleString()}</td>
        <td>${country.area?.toLocaleString() || 'N/A'}</td>
        <td>${(country.population / country.area)?.toFixed(2) || 'N/A'}</td>
      </tr>
    `;
    tableBody.innerHTML += row;
  });
};

showDataBtn.addEventListener('click', async () => {
  const allCountries = await fetchData();
  const selectedRegion = regionSelect.value;

  const filteredCountries = selectedRegion === 'all'
    ? allCountries
    : allCountries.filter(country => country.region === selectedRegion);

  const topCountries = filteredCountries
    .sort((a, b) => b.population - a.population)
    .slice(0, 10);

  updateChart(topCountries);
  updateTable(topCountries);
});

darkModeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
});
