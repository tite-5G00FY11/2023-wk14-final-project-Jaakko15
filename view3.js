const latestTemperatureEndpoint = 'https://webapi19sa-1.course.tamk.cloud/v1/weather/temperature';

async function fetchData(endpoint, hours) {
  let url = endpoint;
  if (hours) {
    url += `?hours=${hours}`;
  }
  const response = await fetch(url);
  const data = await response.json();
  return data.reverse();
}

async function createChart(canvasId, chartTitle, labels, datasets) {
  const chartElement = document.getElementById(canvasId).getContext('2d');

  return new Chart(chartElement, {
    type: 'line',
    data: {
      labels: labels,
      datasets: datasets,
    },
    options: {
      responsive: true,
      title: {
        display: true,
        text: chartTitle,
      },
      scales: {
        xAxes: [{
          type: 'time',
        }],
      },
    },
  });
}

function formatDate(date) {
  const dateTime = new Date(date);
  const formattedDate = `${dateTime.getFullYear()}-${String(dateTime.getMonth() + 1).padStart(2, '0')}-${String(dateTime.getDate()).padStart(2, '0')} ${String(dateTime.getHours()).padStart(2, '0')}:${String(dateTime.getMinutes()).padStart(2, '0')}`;
  return formattedDate;
}

async function init(hours) {
  const latestTemperatureData = await fetchData(latestTemperatureEndpoint, hours);
  const latestTemperatureLabels = latestTemperatureData.map(reading => formatDate(reading.date_time));
  const temperatureValues = latestTemperatureData.map(reading => reading.temperature);

  const selectedTimespan = hours || 20;
  await createChart('latestTemperatureChart', `${selectedTimespan > 20 ? selectedTimespan / 24 + ' Day(s) ' : '20 Latest '}Temperature Readings`, latestTemperatureLabels, [
    {
      label: 'Lämpötila',
      data: temperatureValues,
      borderColor: 'rgba(119, 136, 153, 1)',
      fill: false,
    },
  ]);

  const tempValues = temperatureValues.slice(-20).map(parseFloat);
  document.getElementById('mean').textContent = mean(tempValues).toFixed(2);
  document.getElementById('median').textContent = median(tempValues).toFixed(2);
  document.getElementById('mode').textContent = mode(tempValues).join(', ');
  document.getElementById('range').textContent = range(tempValues).toFixed(2);
  document.getElementById('stdDev').textContent = stdDev(tempValues).toFixed(2);
}

function mean(arr) {
  return arr.reduce((acc, val) => acc + val, 0) / arr.length;
}

function median(arr) {
  arr.sort((a, b) => a - b);
  const mid = Math.floor(arr.length / 2);
  return arr.length % 2 === 0 ? (arr[mid - 1] + arr[mid]) / 2 : arr[mid];
}

function mode(arr) {
  const counts = {};
  arr.forEach(val => counts[val] = (counts[val] || 0) + 1);
  const maxCount = Math.max(...Object.values(counts));
  return Object.keys(counts).filter(key => counts[key] === maxCount);
}

function range(arr) {
  return Math.max(...arr) - Math.min(...arr);
}

function stdDev(arr) {
  const avg = mean(arr);
  const squaredDiffs = arr.map(val => Math.pow(val - avg, 2));
  return Math.sqrt(mean(squaredDiffs));
}


  
  init();
  
  