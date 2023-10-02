// Mock function to simulate fetching devices from an API
async function mockFetchDevices() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { "ID": 4418, "DeviceUID": 970746, "DeviceType": "mcPallet", "LastSeenDateTime": "2023-03-13T11:25:14" },
          { "ID": 6553, "DeviceUID": 132783, "DeviceType": "mcSens3530", "LastSeenDateTime": "2023-02-11T23:23:20" },
          // ... more entries here
        ]);
      }, 1000);
    });
  }
  
  // Mock function to simulate fetching device data from an API
  async function mockFetchDeviceData() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            "ID": 8358,
            "DeviceUID": 778299,
            "DateTime": "2023-09-25T23:42:55",
            "SystemVoltage": 3.44,
            "LteLongitude": 83.098154,
            "LteLatitude": -28.460734,
            "WifiLongitude": 38.259106,
            "WifiLatitude": -24.030287,
            "Temperature": 1.19,
            "UltraTemperature": 44.53,
            "Humidity": 96.07,
            "AmbientLight": 712.36,
            "AcessPoint0": 9991288563,
            "AcessPoint1": 9147143312,
            // ... more entries here
          },
          // ... more entries here
        ]);
      }, 1000);
    });
  }
  
  // You can replace calls to your actual fetch functions with these mock functions for testing.
  
  
  
  
  
  
  
  async function fetchDevices() {
    try {
      const response = await fetch('/api/fetch_devices.php');
      if (response.ok) {
        const fullResponse = await response.json();
        if (fullResponse.status === 'success') {
          const actualDevices = fullResponse.devices; // Assuming the key is 'devices' based on your PHP script
          console.log('Actual Devices:', actualDevices);
    
          const selectElement = document.getElementById('device-list');
          
          // Clear previous options
          while (selectElement.firstChild) {
              selectElement.removeChild(selectElement.firstChild);
          }
    
          // Add new options
          actualDevices.forEach(device => {
              const optionElement = document.createElement('option');
              optionElement.value = device.ID;  // Use 'identifier' as the value
              optionElement.textContent = device.DeviceUID;  // Use 'DeviceUID' as the display text
              selectElement.appendChild(optionElement);
          });
    
          return actualDevices;
        } else {
          console.error('Failed to fetch devices:', fullResponse.message);
        }
      } else {
        console.error('Failed to fetch devices:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching devices:', error);
    }
  }
  
    
    // Call the function to fetch devices data
    fetchDevices();
    
  
    async function fetchDeviceData() {
        try {
          const response = await fetch('/api/fetch_device_data.php');
          if (response.ok) {
            const fullResponse = await response.json();
            if (fullResponse.status === 'success') {
              const actualDeviceData = fullResponse.deviceData;
              console.log('Actual Device Data:', actualDeviceData);
              return actualDeviceData;
            } else {
              console.error('Failed to fetch device data:', fullResponse.message);
            }
          } else {
            console.error('Failed to fetch device data:', response.status, response.statusText);
          }
        } catch (error) {
          console.error('Error fetching device data:', error);
        }
      }
      
    
    // Call the function to fetch device data
    fetchDeviceData();
    
//   // Function to fetch Google Geolocation
//   async function fetchGoogleGeolocation(macAddresses) {
//     const geoRequest = {
//         "considerIp": false,
//         "wifiAccessPoints": macAddresses.map(mac => ({ "macAddress": mac }))
//     };
//     try {
//         const response = await fetch('https://www.googleapis.com/geolocation/v1/geolocate?key=YOUR_API_KEY', {
//             method: 'POST',
//             body: JSON.stringify(geoRequest),
//             headers: { 'Content-Type': 'application/json' }
//         });
//         if (response.ok) {
//             const geoData = await response.json();
//             return geoData;
//         } else {
//             console.error('Failed to fetch geolocation:', response.status, response.statusText);
//             return null;
//         }
//     } catch (error) {
//         console.error('Error fetching geolocation:', error);
//         return null;
//     }
//   }
  
  
//   // Function to update the database with fetched location
//   async function updateDatabaseWithLocation(geoData) {
//     if (!geoData) return;
    
//     const { lat, lng } = geoData.location;
//     try {
//         const response = await fetch('/api/update_device_location.php', {
//             method: 'POST',
//             body: JSON.stringify({ WifiLatitude: lat, WifiLongitude: lng }),
//             headers: { 'Content-Type': 'application/json' }
//         });
//         if (response.ok) {
//             console.log('Successfully updated database.');
//         } else {
//             console.error('Failed to update database:', response.status, response.statusText);
//         }
//     } catch (error) {
//         console.error('Error updating database:', error);
//     }
//   }



// Simulate receiving data from IoT devices
const generateRandomValue = (min, max) => Math.random() * (max - min) + min;

// Global object to store
const gaugeInstances = {};
let mapInstance;
let currentMarker;



// Initialize map using Leaflet
const initMap = () => {
    const map = L.map('map').setView([51.505, -0.09], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    L.marker([51.5, -0.09]).addTo(map);
    mapInstance = map;
};

const updateMarkerAndView = (newLat, newLon, zoomLevel = 13) => {

    if (typeof newLat !== 'number' || typeof newLon !== 'number') {
        console.log('Latitude:', newLat, 'Type:', typeof newLat);
console.log('Longitude:', newLon, 'Type:', typeof newLon);

        console.error('Invalid types for lat or long.');
        return;
    }
    // Remove the old marker
    if (currentMarker) {
        mapInstance.removeLayer(currentMarker);
    }

    // Add a new marker
   L.marker([newLat, newLon]).addTo(mapInstance);

    // Set the map view to the new location
    mapInstance.setView([newLat, newLon], zoomLevel);
};


//'use strict';



// Initialize gauges using D3.js
const initGauges = () => {
    // Remove old gauges if they exist
    d3.selectAll('.gauge').remove();
// Configuration for the temperature gauge
const temperatureGaugeConfig = {
    size : 200,
    margin : 10,
    minValue : -30,
    maxValue : 50,
    majorTicks : 5,
    lowThreshhold : 0,
    highThreshhold : 30,
    lowThreshholdColor : '#55e2e9',
    defaultColor : '#feff1e',
    highThreshholdColor : '#cc0000',
    displayUnit: ' °C '
  };

  // Configuration for the humidity gauge
  const humidityGaugeConfig = {
    size : 200,
    margin : 10,
    minValue : 0,
    maxValue : 100,
    majorTicks : 10,
    lowThreshhold : 30,
    highThreshhold : 60,
    lowThreshholdColor : '#FFC0CB',
    defaultColor : '#ADD8E6',
    highThreshholdColor : '#55e2e9',
    displayUnit: ' % '
  };
  
  // Configuration for the ambient light gauge
  const ambientLightGaugeConfig = {
    size : 200,
    margin : 10,
    minValue : 0,
    maxValue : 3000,
    majorTicks : 5,
    lowThreshhold : 100,
    highThreshhold : 1000,
    lowThreshholdColor : '#5A5A5A',
    defaultColor : '#978A84',
    highThreshholdColor : '#feff1e',
    displayUnit: ' lux '
  };

  // Configuration for the battery voltage gauge
  const batteryVoltageGaugeConfig = {
    size : 200,
    margin : 10,
    minValue : 0, 
    maxValue : 5,
    majorTicks : 5,
    lowThreshhold : 3,
    highThreshhold : 4,
    lowThreshholdColor : '#feff1e',
    defaultColor : '#009900',
    highThreshholdColor : '#cc0000',
    displayUnit: 'V'
  };

  // Create instances of the Gauge class
  const temperatureGauge = new Gauge(temperatureGaugeConfig);
  const humidityGauge = new Gauge(humidityGaugeConfig);
  const ambientLightGauge = new Gauge(ambientLightGaugeConfig);
  const batteryVoltageGauge = new Gauge(batteryVoltageGaugeConfig);

  // Render gauges
  temperatureGauge.render(document.getElementById('temperature-gauge'), 20);
  humidityGauge.render(document.getElementById('humidity-gauge'), 40);
  ambientLightGauge.render(document.getElementById('ambient-light-gauge'), 100);
  batteryVoltageGauge.render(document.getElementById('battery-voltage-gauge'), 3.5);

  // Store instances for later updates
  gaugeInstances['temperature'] = temperatureGauge;
  gaugeInstances['humidity'] = humidityGauge;
  gaugeInstances['ambientLight'] = ambientLightGauge;
  gaugeInstances['batteryVoltage'] = batteryVoltageGauge;
};


// Initialize chart using D3.js
const initChart = () => {
    // Initialize chart
    const myChart = new ChartClass('chart');

    // Add series
    const timeStamps = [
      '2023-09-25T23:42:55',
      '2023-09-25T23:52:55',
      '2023-09-26T00:02:55',
      '2023-09-26T00:12:55',
      '2023-09-26T00:22:55',
      '2023-09-26T00:32:55'
    ];
    myChart.addSeries('Temperature (°C)', timeStamps, [22, 21, 20, 19, 20, 22], 'rgba(255, 99, 132, 1)');
    myChart.addSeries('Humidity (%)', timeStamps, [45, 44, 43, 42, 45, 47], 'rgba(54, 162, 235, 1)');
  
};


// Update widget values
const updateWidgets = async () => {
    const deviceData = await fetchDeviceData();
    const firstDeviceData = deviceData[0];
   
// Update gauge values
gaugeInstances['temperature'].update(parseFloat(firstDeviceData.Temperature));
gaugeInstances['humidity'].update(parseFloat(firstDeviceData.Humidity));
gaugeInstances['ambientLight'].update(parseFloat(firstDeviceData.AmbientLight));
gaugeInstances['batteryVoltage'].update(parseFloat(firstDeviceData.SystemVoltage));

// Update text widgets
document.getElementById("temperature-value").innerText = `${parseFloat(firstDeviceData.Temperature).toFixed(2)} °C`;
document.getElementById("humidity-value").innerText = `${parseFloat(firstDeviceData.Humidity).toFixed(2)} %`;
document.getElementById("ambient-light-value").innerText = `${parseFloat(firstDeviceData.AmbientLight).toFixed(2)} lux`;
document.getElementById("battery-voltage-value").innerText = `${parseFloat(firstDeviceData.SystemVoltage).toFixed(2)} V`;

// Update map marker
updateMarkerAndView(parseFloat(firstDeviceData.LteLatitude), parseFloat(firstDeviceData.LteLongitude), 13);




//     const newTemperature = generateRandomValue(20, 30).toFixed(2);
//     const newHumidity = generateRandomValue(40, 60).toFixed(2);
//     const newAmbientLight = generateRandomValue(100, 1000).toFixed(2);
//     const newBatteryVoltage = generateRandomValue(3.5, 4.2).toFixed(2);
//     const newLat = Math.random() * 180 - 90;
//     const newLon = Math.random() * 360 - 180;
//     document.getElementById("temperature-value").innerText = `${newTemperature} °C`;
//     document.getElementById("humidity-value").innerText = `${newHumidity} %`;
//     document.getElementById("ambient-light-value").innerText = `${newAmbientLight} lux`;
//     document.getElementById("battery-voltage-value").innerText = `${newBatteryVoltage} V`;
//    gaugeInstances['temperature'].update(parseFloat(newTemperature));
//    gaugeInstances['humidity'].update(parseFloat(newHumidity));
//    gaugeInstances['ambientLight'].update(parseFloat(newAmbientLight));
//    gaugeInstances['batteryVoltage'].update(parseFloat(newBatteryVoltage));
//    updateMarkerAndView(parseFloat(newLat), parseFloat(newLon), 13);
 };

// Initialize the dashboard
window.addEventListener("load", () => {
    initMap();
    initGauges();
    initChart();
    updateWidgets();
    // Update widgets every 5 seconds
    setInterval(updateWidgets, 5000);
});

//Chart Class
class ChartClass {
    constructor(canvasId) {
      this.canvas = document.getElementById(canvasId).getContext('2d');
      this.config = {
        type: 'line',
        data: { labels: [], datasets: [] },
        options: {
          scales: {
            x: {
              type: 'time',
              adapters: {
                date: {
                  library: 'date-fns'
                }
              },
              time: {
                unit: 'minute',
                displayFormats: {
                  minute: 'HH:mm'
                }
              }
            },
            y: {
              beginAtZero: true
            }
          },
          plugins: {
            zoom: {
              pan: { enabled: true, mode: 'x' },
              zoom: {
                wheel: { enabled: true },
                pinch: { enabled: true },
                mode: 'x'
              }
            }
          }
        }
      };
      this.chart = new Chart(this.canvas, this.config);
    }

    addSeries(label, timeStamps, data, borderColor) {
      const newDataset = {
        label: label,
        data: data.map((value, index) => ({ x: timeStamps[index], y: value })),
        borderColor: borderColor,
        borderWidth: 1,
        fill: false
      };
      this.config.data.datasets.push(newDataset);
      this.chart.update();
    }

    addPoint(timeStamp, value, seriesIndex) {
      this.config.data.datasets[seriesIndex].data.push({ x: timeStamp, y: value });
      this.chart.update();
    }

    removeSeries(seriesIndex) {
      if (this.config.data.datasets.length > seriesIndex) {
        this.config.data.datasets.splice(seriesIndex, 1);
        this.chart.update();
      }
    }
  }





//Gauge Class
class Gauge {
    constructor(configuration) {
      // default configuration settings
      const config = {
        size : 200,
        margin : 10,
        minValue : 0,
        maxValue : 10,
        majorTicks : 5,
        lowThreshhold : 3,
        highThreshhold : 7,
        scale: 'linear',
        lowThreshholdColor : '#009900',
        defaultColor : '#ffe500',
        highThreshholdColor : '#cc0000',
        transitionMs : 1000,
        displayUnit: 'Value'
      };
  
      // define arc shape and position
      this.arcPadding = 15;
      this.arcWidth = 20;
      this.labelInset = 10;
  
      this.minAngle = -90,
      this.maxAngle = 90,
      this.angleRange = this.maxAngle - this.minAngle;
  
      this.config = Object.assign(config, configuration);
      this._config();
  
    }
  
    _config() {
  
      // defined pointer shape and size
      const pointerWidth = 6;
      const pointerTailLength = 5;
      const pointerHeadLength = this._radius() - this.labelInset;
      this.lineData = [
          [pointerWidth / 2, 0],
          [0, -pointerHeadLength],
          [-(pointerWidth / 2), 0],
          [0, pointerTailLength],
          [pointerWidth / 2, 0]
        ];
  
      if (this.config.scale == 'log') {
        this.scale = d3.scaleLog()
          .range([0,1])
          .domain([this.config.minValue, this.config.maxValue]);
      }
      else {
        this.scale = d3.scaleLinear()
        .range([0,1])
        .domain([this.config.minValue, this.config.maxValue]);
      }
  
      const colorDomain = [this.config.lowThreshhold, this.config.highThreshhold].map(this.scale);
      const colorRange  = [
        this.config.lowThreshholdColor,
        this.config.defaultColor,
        this.config.highThreshholdColor
      ];
      this.colorScale = d3.scaleThreshold().domain(colorDomain).range(colorRange);
  
      let ticks = this.config.majorTicks;
      if (this.config.scale === 'log') {
        ticks = Math.log10(this.config.maxValue/this.config.minValue);
      }
      this.ticks = this.scale.ticks(ticks);
  
      this.threshholds = [
        this.config.minValue,
        this.config.lowThreshhold,
        this.config.highThreshhold,
        this.config.maxValue
      ]
      .map(d => this.scale(d));
  
      this.arc = d3.arc()
        .innerRadius(this._radius() - this.arcWidth - this.arcPadding)
        .outerRadius(this._radius() - this.arcPadding)
        .startAngle((d, i) => {
          const ratio = i > 0 ? this.threshholds[i-1] : this.threshholds[0];
          return this._deg2rad(this.minAngle + (ratio * this.angleRange));
        })
        .endAngle((d, i) => this._deg2rad(this.minAngle + this.threshholds[i] * this.angleRange));
  
    }
  
    _radius() {
  
      return (this.config.size - this.config.margin) / 2;
  
    }
  
    _deg2rad(deg) {
  
      return deg * Math.PI / 180;
  
    }
  
    setConfig(configuration) {
      this.config = Object.assign(this.config, configuration);
      this._config();
      return this;
    }
  
    render(container, newValue) {
  
    // clear gauge if exist
    d3.select(container).selectAll('svg').remove();
    d3.select(container).selectAll('div').remove();
  
    const svg = d3.select(container)
      .append('svg')
      .attr('class', 'gauge')
      .attr('width', this.config.size + this.config.margin)
      .attr('height', this.config.size / 2 + this.config.margin);
  
    // display panel arcs with color scale
    const arcs = svg.append('g')
      .attr('class', 'arc')
      .attr('transform', `translate(${this._radius()}, ${this._radius()})`);
  
    // draw the color arcs
    arcs.selectAll('path')
      .data(this.threshholds)
      .enter()
      .append('path')
      .attr('fill', d => this.colorScale(d-0.001))
      .attr('d', this.arc);
  
    // display panel - labels
    const lg = svg.append('g')
      .attr('class', 'label')
      .attr('transform', `translate(${this._radius()},${this._radius()})`);
  
    // display panel - text
    lg.selectAll('text')
      .data(this.ticks)
      .enter()
      .append('text')
      .attr('transform', d => {
         var newAngle = this.minAngle + (this.scale(d) * this.angleRange);
         return `rotate(${newAngle}) translate(0, ${this.labelInset - this._radius()})`;
       })
      .text(d3.format('1,.0f'));
  
    // display panel - ticks
    lg.selectAll('line')
      .data(this.ticks)
      .enter()
      .append('line')
      .attr('class', 'tickline')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', 0)
      .attr('y2', this.arcWidth + this.labelInset)
      .attr('transform', d => {
        const newAngle = this.minAngle + (this.scale(d) * this.angleRange);
        return `rotate(${newAngle}), translate(0, ${this.arcWidth  - this.labelInset - this._radius()})`;
      })
      .style('stroke', '#666')
      .style('stroke-width', '1px');
  
    // display pointer
    const pg = svg.append('g')
      .data([this.lineData])
      .attr('class', 'pointer')
      .attr('transform', `translate(${this._radius()},${this._radius()})`);
  
    const pointer = pg.append('path')
      .attr('d', d3.line())
      .attr('transform', `rotate(${this.minAngle})`);
  
    // display current value //uncomment this to diplay unit and value
    // const numberDiv = d3.select(container).append('div')
    //   .attr('class', 'number-div')
    //   .style('width', `${this.config.size - this.config.margin}px`);
  
    // const numberUnit = numberDiv.append('span')
    //   .attr('class', 'number-unit')
    //   .text(d => this.config.displayUnit);
  
    // const numberValue = numberDiv.append('span')
    //   .data([newValue])
    //   .attr('class', 'number-value')
    //   .text(d => d === undefined ? 0: d);
  
    this.pointer = pointer;
   // this.numberValue = numberValue;
  
    }
  
    update(newValue) {
  
      const newAngle = this.minAngle + (this.scale(newValue) * this.angleRange);
  
      this.pointer.transition()
        .duration(this.config.transitionMs)
        .attr('transform', `rotate(${newAngle})`);
  //un comment this to if dsiplaying the value
    //   this.numberValue
    //     .data([newValue])
    //     .transition()
    //     .duration(this.config.transitionMs)
    //     .style('color', this.colorScale( this.scale(newValue) ))
    //     //.text(newValue.toFixed(3))
    //     .tween("", function(d) {
    //       const interpolator = d3.interpolate( this.textContent, d );
    //       const that = this;
    //       return function( t ) {
    //         that.textContent = interpolator(t).toFixed(1);
    //       };
    //     });
    }
  
  }