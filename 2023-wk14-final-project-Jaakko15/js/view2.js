const latestReadingsEndpoint = 'http://webapi19sa-1.course.tamk.cloud/v1/weather/limit/50';

async function fetchData(endpoint) {
    const response = await fetch(endpoint);
    const data = await response.json();
    return data.reverse();
}

function createTable(tableId, data) {
    const table = document.getElementById(tableId);
    const tbody = table.querySelector('tbody');
    tbody.innerHTML = '';

    for (const row of data) {
        const tr = document.createElement('tr');
        const dateTime = new Date(row.date_time).toLocaleString();
        const dataType = Object.keys(row.data)[0];
        const value = row.data[dataType];
        tr.innerHTML = `
            <td>${dateTime}</td>
            <td>${dataType}</td>
            <td>${value}</td>
        `;
        tbody.appendChild(tr);
    }
}

function filterData(data, signal, timeSpan) {
    const currentTime = new Date();

    return data.filter(row => {
        const dataType = Object.keys(row.data)[0];

        if (signal && dataType !== signal) {
            return false;
        }

        if (timeSpan !== 'live') {
            const rowTime = new Date(row.date_time);
            const timeDifference = (currentTime - rowTime) / (1000 * 60 * 60);

            if (timeDifference > parseFloat(timeSpan)) {
                return false;
            }
        }

        return true;
    });
}

async function updateTable() {
    const signalSelect = document.getElementById('signalSelect');
    const timeSelect = document.getElementById('timeSelect');
    const selectedSignal = signalSelect.value;
    const selectedTimeSpan = timeSelect.value;

    const latestReadingsData = await fetchData(latestReadingsEndpoint);
    const filteredData = filterData(latestReadingsData, selectedSignal, selectedTimeSpan);

    createTable('readingsTable', filteredData);
}

async function init() {
    const signalSelect = document.getElementById('signalSelect');
    const timeSelect = document.getElementById('timeSelect');

    signalSelect.addEventListener('change', updateTable);
    timeSelect.addEventListener('change', updateTable);

    // Fetch and display 50 latest readings
    await updateTable();
}

init();
