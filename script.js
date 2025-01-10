const API_URL = 'https://restcountries.com/v3.1/all';
const viewSelect = document.getElementById('view-select');
const regionSelect = document.getElementById('region-select');
const showDataBtn = document.getElementById('show-data-btn');
const outputContainer = document.getElementById('output-container');
let chart;

// Earth-tone color palette
const earthTones = {
  population: {
    fill: 'rgba(139, 69, 19, 0.7)',    // Brown
    border: 'rgba(139, 69, 19, 1)'
  },
  area: {
    fill: 'rgba(128, 141, 97, 0.7)',    // Sage green
    border: 'rgba(128, 141, 97, 1)'
  }
};

const fetchData = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
};

const createMultiChart = (countries, title = '', viewMode = '') => {
  if (chart) {
    chart.destroy();
  }

  const ctx = document.getElementById('populationChart').getContext('2d');
  
  // Only show labels for Top 10 views
  const showLabels = viewMode !== 'allcountries';
  const labels = countries.map(country => showLabels ? country.name.common : '');
  const populationData = countries.map(country => country.population);
  const areaData = countries.map(country => country.area || 0);

  chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Population',
          data: populationData,
          backgroundColor: earthTones.population.fill,
          borderColor: earthTones.population.border,
          borderWidth: 1,
          yAxisID: 'population'
        },
        {
          label: 'Area (km²)',
          data: areaData,
          backgroundColor: earthTones.area.fill,
          borderColor: earthTones.area.border,
          borderWidth: 1,
          yAxisID: 'area'
        }
      ]
    },
    options: {
      responsive: true,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      scales: {
        population: {
          type: 'logarithmic',
          position: 'left',
          title: {
            display: true,
            text: 'Population (log scale)',
            color: '#594438',
            font: { weight: 'bold' }
          },
          grid: {
            color: 'rgba(89, 68, 56, 0.1)'
          }
        },
        area: {
          type: 'logarithmic',
          position: 'right',
          title: {
            display: true,
            text: 'Area km² (log scale)',
            color: '#594438',
            font: { weight: 'bold' }
          },
          grid: {
            display: false
          }
        },
        x: {
          ticks: {
            maxRotation: 45,
            minRotation: 45,
            display: showLabels
          }
        }
      },
      plugins: {
        title: {
          display: true,
          text: title,
          color: '#594438',
          font: {
            size: 16,
            weight: 'bold'
          }
        }
      }
    }
  });
};

const displayTop10ByContinent = (countries, continent) => {
  const continentCountries = countries
    .filter(country => country.region === continent)
    .sort((a, b) => b.population - a.population)
    .slice(0, 10);

  return {
    countries: continentCountries,
    html: `
      <div class="continent-section">
        <h2 class="continent-title" data-continent="${continent}">${continent}</h2>
        <div class="continent-grid">
          ${continentCountries.map(formatCountryCard).join('')}
        </div>
      </div>
    `
  };
};

const displayAllCountries = (countries) => {
  const continents = [...new Set(countries.map(country => country.region))].sort();
  
  const firstContinent = continents[0];
  const continentCountries = countries
    .filter(country => country.region === firstContinent)
    .sort((a, b) => b.population - a.population);

  createMultiChart(continentCountries, `${firstContinent} Countries: Population and Area Comparison`, 'allcountries');
  
  outputContainer.innerHTML = continents
    .map(continent => {
      const continentCountries = countries
        .filter(country => country.region === continent)
        .sort((a, b) => b.population - a.population);
      
      return `
        <div class="continent-section">
          <h2 class="continent-title" data-continent="${continent}">${continent}</h2>
          <div class="continent-grid">
            ${continentCountries.map(formatCountryCard).join('')}
          </div>
        </div>
      `;
    })
    .join('');

  document.querySelectorAll('.continent-title').forEach(title => {
    title.style.cursor = 'pointer';
    title.addEventListener('click', () => {
      const continent = title.dataset.continent;
      const continentCountries = countries
        .filter(country => country.region === continent)
        .sort((a, b) => b.population - a.population);
      createMultiChart(continentCountries, `${continent} Countries: Population and Area Comparison`, 'allcountries');
    });
  });
};

const displayTop10Global = (countries) => {
  const top10 = countries
    .sort((a, b) => b.population - a.population)
    .slice(0, 10);

  createMultiChart(top10, 'Top 10 Countries Globally by Population and Area', 'top10global');
  outputContainer.innerHTML = top10.map(formatCountryCard).join('');
};

const displayTop10AllContinents = (countries) => {
  const continents = [...new Set(countries.map(country => country.region))].sort();
  
  const firstContinent = continents[0];
  const firstTop10 = displayTop10ByContinent(countries, firstContinent);
  createMultiChart(firstTop10.countries, `Top 10 Countries in ${firstContinent} by Population and Area`, 'top10continent');
  
  outputContainer.innerHTML = continents
    .map(continent => displayTop10ByContinent(countries, continent).html)
    .join('');

  document.querySelectorAll('.continent-title').forEach(title => {
    title.style.cursor = 'pointer';
    title.addEventListener('click', () => {
      const continent = title.dataset.continent;
      const top10Data = displayTop10ByContinent(countries, continent);
      createMultiChart(top10Data.countries, `Top 10 Countries in ${continent} by Population and Area`, 'top10continent');
    });
  });
};

const formatCountryCard = (country) => `
  <div class="country-card">
    <div class="country-header">
      <img src="${country.flags.svg}" alt="${country.name.common} flag" loading="lazy">
      <h3>${country.name.common}</h3>
    </div>
    <div class="country-info">
      <div class="info-item">
        <span class="info-label">🌍 Region</span>
        <span class="info-value">${country.region}</span>
      </div>
      <div class="info-item">
        <span class="info-label">🏛️ Capital</span>
        <span class="info-value">${country.capital?.[0] || 'N/A'}</span>
      </div>
      <div class="info-item">
        <span class="info-label">👥 Population</span>
        <span class="info-value">${country.population.toLocaleString()}</span>
      </div>
      <div class="info-item">
        <span class="info-label">📏 Area</span>
        <span class="info-value">${country.area ? country.area.toLocaleString() + ' km²' : 'N/A'}</span>
      </div>
      <div class="info-item">
        <span class="info-label">💬 Languages</span>
        <span class="info-value">${Object.values(country.languages || {}).join(', ') || 'N/A'}</span>
      </div>
      <div class="info-item">
        <span class="info-label">💰 Currency</span>
        <span class="info-value">${Object.values(country.currencies || {}).map(c => c.name).join(', ') || 'N/A'}</span>
      </div>
    </div>
  </div>
`;

showDataBtn.addEventListener('click', async () => {
  const allCountries = await fetchData();
  if (!allCountries.length) return;

  const viewMode = viewSelect.value;
  const selectedRegion = regionSelect.value;

  let filteredCountries = selectedRegion === 'all'
    ? allCountries
    : allCountries.filter(country => country.region === selectedRegion);

  switch (viewMode) {
    case 'top10global':
      displayTop10Global(filteredCountries);
      break;
    case 'allcountries':
      displayAllCountries(filteredCountries);
      break;
    case 'top10continent':
      displayTop10AllContinents(filteredCountries);
      break;
  }
});

// Initial load
showDataBtn.click();
