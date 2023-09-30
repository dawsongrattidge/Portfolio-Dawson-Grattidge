
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
    // Remove the old marker
    if (currentMarker) {
        mapInstance.removeLayer(currentMarker);
    }

    // Add a new marker
    currentMarker = L.marker([newLat, newLon]).addTo(map);

    // Set the map view to the new location
    mapInstance.setView([newLat, newLon], zoomLevel);
};


'use strict';



// Initialize gauges using D3.js
const initGauges = () => {
    // Remove old gauges if they exist
    d3.selectAll('.gauge').remove();
// Configuration for the temperature gauge
const temperatureGaugeConfig = {
    size : 200,
    margin : 10,
    minValue : 20,
    maxValue : 30,
    majorTicks : 5,
    displayUnit: ' °C '
  };

  // Configuration for the humidity gauge
  const humidityGaugeConfig = {
    size : 200,
    margin : 10,
    minValue : 40,
    maxValue : 60,
    majorTicks : 5,
    displayUnit: ' % '
  };

  // Configuration for the ambient light gauge
  const ambientLightGaugeConfig = {
    size : 200,
    margin : 10,
    minValue : 100,
    maxValue : 1000,
    majorTicks : 5,
    displayUnit: ' lux '
  };

  // Configuration for the battery voltage gauge
  const batteryVoltageGaugeConfig = {
    size : 200,
    margin : 10,
    minValue : 0,
    maxValue : 5,
    majorTicks : 5,
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
    const data = Array.from({ length: 10 }, () => Math.floor(Math.random() * 40) + 10);
    const svg = d3.select('#d3-chart').append('svg').attr('width', 400).attr('height', 300);
    const x = d3.scaleLinear().domain([0, data.length - 1]).range([0, 400]);
    const y = d3.scaleLinear().domain([0, d3.max(data)]).range([300, 0]);

    const line = d3.line()
        .x((d, i) => x(i))
        .y(d => y(d));

    svg.append('path')
        .datum(data)
        .attr('d', line)
        .attr('stroke', 'steelblue')
        .attr('stroke-width', 2)
        .attr('fill', 'none');
};


// Update widget values
const updateWidgets = () => {
    const newTemperature = generateRandomValue(20, 30).toFixed(2);
    const newHumidity = generateRandomValue(40, 60).toFixed(2);
    const newAmbientLight = generateRandomValue(100, 1000).toFixed(2);
    const newBatteryVoltage = generateRandomValue(3.5, 4.2).toFixed(2);
    const newLat = Math.random() * 180 - 90;
    const newLon = Math.random() * 360 - 180;
    document.getElementById("temperature-value").innerText = `${newTemperature} °C`;
    document.getElementById("humidity-value").innerText = `${newHumidity} %`;
    document.getElementById("ambient-light-value").innerText = `${newAmbientLight} lux`;
    document.getElementById("battery-voltage-value").innerText = `${newBatteryVoltage} V`;
   gaugeInstances['temperature'].update(parseFloat(newTemperature));
   gaugeInstances['humidity'].update(parseFloat(newHumidity));
   gaugeInstances['ambientLight'].update(parseFloat(newAmbientLight));
   gaugeInstances['batteryVoltage'].update(parseFloat(newBatteryVoltage));
   updateMarkerAndView(newLat, newLon)
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
  
    // display current value
    const numberDiv = d3.select(container).append('div')
      .attr('class', 'number-div')
      .style('width', `${this.config.size - this.config.margin}px`);
  
    const numberUnit = numberDiv.append('span')
      .attr('class', 'number-unit')
      .text(d => this.config.displayUnit);
  
    const numberValue = numberDiv.append('span')
      .data([newValue])
      .attr('class', 'number-value')
      .text(d => d === undefined ? 0: d);
  
    this.pointer = pointer;
    this.numberValue = numberValue;
  
    }
  
    update(newValue) {
  
      const newAngle = this.minAngle + (this.scale(newValue) * this.angleRange);
  
      this.pointer.transition()
        .duration(this.config.transitionMs)
        .attr('transform', `rotate(${newAngle})`);
  
      this.numberValue
        .data([newValue])
        .transition()
        .duration(this.config.transitionMs)
        .style('color', this.colorScale( this.scale(newValue) ))
        //.text(newValue.toFixed(3))
        .tween("", function(d) {
          const interpolator = d3.interpolate( this.textContent, d );
          const that = this;
          return function( t ) {
            that.textContent = interpolator(t).toFixed(1);
          };
        });
    }
  
  }