<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Global Countries Explorer</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <main>
    <h1>🌍 Global Countries Explorer</h1>
    <div class="controls">
      <div class="filter-group">
        <label for="view-select">View Mode:</label>
        <select id="view-select">
          <option value="top10global">Top 10 Countries Globally</option>
          <option value="allcountries">All Countries by Continent</option>
          <option value="top10continent">Top 10 Countries by Continent</option>
        </select>
      </div>
      <div class="filter-group">
        <label for="region-select">Region:</label>
        <select id="region-select">
          <option value="all">All Regions</option>
          <option value="Asia">Asia</option>
          <option value="Europe">Europe</option>
          <option value="Africa">Africa</option>
          <option value="Americas">Americas</option>
          <option value="Oceania">Oceania</option>
        </select>
      </div>
      <button id="show-data-btn">Explore Countries</button>
    </div>
    
    <div id="chart-container">
      <canvas id="populationChart"></canvas>
    </div>
    
    <div id="output-container"></div>
  </main>

  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <script src="script.js"></script>
</body>
</html>
