const humidityOutEndpoint = 'https://webapi19sa-1.course.tamk.cloud/v1/weather/humidity_out/24';

async function fetchData(endpoint) {
    const response = await fetch(endpoint);
    const data = await response.json();
    return data;
}

function formatDate(date) {
    const dateTime = new Date(date);
    const formattedDate = `${dateTime.getFullYear()}-${String(dateTime.getMonth() + 1).padStart(2, '0')}-${String(dateTime.getDate()).padStart(2, '0')} ${String(dateTime.getHours()).padStart(2, '0')}:${String(dateTime.getMinutes()).padStart(2, '0')}`;
    return formattedDate;
}

async function createBarChart(humidityOutData) {
    const chartElement = document.getElementById('humidityOutChart').getContext('2d');

    new Chart(chartElement, {
        type: 'bar',
        data: {
            labels: humidityOutData.map(reading => formatDate(reading.date_time)),
            datasets: [
                {
                    label: 'Ulkoilman kosteus',
                    data: humidityOutData.map(reading => reading.humidity_out),
                    backgroundColor: 'rgba(119, 136, 153, 1)',
                    borderColor: 'rgba(255, 182, 193, 0.5)',
                    borderWidth: 1,
                },
            ],
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Date/Time',
                    },
                },
                y: {
                    display: true,
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Humidity Out',
                    },
                },
            },
        },
    });
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

async function init() {
  const humidityOutData = await fetchData(humidityOutEndpoint);
  await createBarChart(humidityOutData);
  
  const humidityValues = humidityOutData.map(reading => parseFloat(reading.humidity_out));

  // Debug the values
  console.log('Humidity Values:', humidityValues);

  document.getElementById('mean').textContent = mean(humidityValues).toFixed(2);
  document.getElementById('median').textContent = median(humidityValues).toFixed(2);
  document.getElementById('mode').textContent = mode(humidityValues).join(', ');
  document.getElementById('range').textContent = range(humidityValues).toFixed(2);
  document.getElementById('stdDev').textContent = stdDev(humidityValues).toFixed(2);
}

init();