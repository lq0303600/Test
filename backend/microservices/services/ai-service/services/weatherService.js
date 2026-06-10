const axios = require('axios');

const WeatherService = {
  async getWeather(city = '北京') {
    try {
      const apiUrl = `https://api.openweathermap.org/data/2.5/weather`;
      const apiKey = '7453d2a46892ee37b3d22590b05b0d69';
      
      const response = await axios.get(apiUrl, {
        params: {
          q: encodeURIComponent(city),
          appid: apiKey,
          units: 'metric',
          lang: 'zh_cn'
        },
        timeout: 10000
      });

      const data = response.data;
      return this.formatWeatherResponse(data);
    } catch (error) {
      console.error('获取天气数据失败:', error.message);
      return this.getMockWeather(city);
    }
  },

  async getWeatherForecast(city = '北京', days = 3) {
    try {
      const apiUrl = `https://api.openweathermap.org/data/2.5/forecast`;
      const apiKey = '7453d2a46892ee37b3d22590b05b0d69';
      
      const response = await axios.get(apiUrl, {
        params: {
          q: encodeURIComponent(city),
          appid: apiKey,
          units: 'metric',
          lang: 'zh_cn'
        },
        timeout: 10000
      });

      const data = response.data;
      return this.formatForecastResponse(data, days);
    } catch (error) {
      console.error('获取天气预报失败:', error.message);
      return this.getMockForecast(city, days);
    }
  },

  formatWeatherResponse(data) {
    const weatherIcons = {
      'Clear': '☀️',
      'Clouds': '☁️',
      'Rain': '🌧️',
      'Drizzle': '🌦️',
      'Thunderstorm': '⛈️',
      'Snow': '❄️',
      'Mist': '🌫️',
      'Fog': '🌫️',
      'Haze': '😶‍🌫️',
      'Wind': '💨'
    };

    const main = data.weather[0].main;
    const icon = weatherIcons[main] || '🌤️';

    return {
      city: data.name,
      temperature: Math.round(data.main.temp),
      feels_like: Math.round(data.main.feels_like),
      humidity: data.main.humidity,
      wind_speed: data.wind.speed,
      wind_direction: this.getWindDirection(data.wind.deg),
      description: data.weather[0].description,
      main: main,
      icon: icon,
      pressure: data.main.pressure,
      visibility: data.visibility,
      uv_index: this.calculateUVIndex(data.main.temp, data.clouds.all),
      air_quality: this.getAirQuality(data.main.pressure),
      sunrise: new Date(data.sys.sunrise * 1000).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      sunset: new Date(data.sys.sunset * 1000).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      timestamp: new Date().toISOString()
    };
  },

  formatForecastResponse(data, days) {
    const dailyData = [];
    const seenDates = new Set();
    let count = 0;

    data.list.forEach(item => {
      const date = item.dt_txt.split(' ')[0];
      if (!seenDates.has(date) && count < days) {
        seenDates.add(date);
        dailyData.push({
          date: date,
          temperature: {
            min: Math.round(item.main.temp_min),
            max: Math.round(item.main.temp_max)
          },
          weather: item.weather[0].main,
          description: item.weather[0].description,
          icon: this.getWeatherIcon(item.weather[0].main),
          precipitation: item.pop * 100
        });
        count++;
      }
    });

    return {
      city: data.city.name,
      forecast: dailyData
    };
  },

  getWeatherIcon(main) {
    const icons = {
      'Clear': '☀️',
      'Clouds': '☁️',
      'Rain': '🌧️',
      'Drizzle': '🌦️',
      'Thunderstorm': '⛈️',
      'Snow': '❄️',
      'Mist': '🌫️',
      'Fog': '🌫️',
      'Haze': '😶‍🌫️',
      'Wind': '💨'
    };
    return icons[main] || '🌤️';
  },

  getWindDirection(deg) {
    const directions = ['北风', '东北风', '东风', '东南风', '南风', '西南风', '西风', '西北风'];
    const index = Math.round(deg / 45) % 8;
    return directions[index];
  },

  calculateUVIndex(temp, cloudiness) {
    if (temp > 30 && cloudiness < 30) return '强';
    if (temp > 25 && cloudiness < 50) return '中等';
    return '弱';
  },

  getAirQuality(pressure) {
    if (pressure > 1015) return '优';
    if (pressure > 1005) return '良';
    return '一般';
  },

  getMockWeather(city) {
    const mockData = {
      '北京': { temp: 28, feels_like: 30, humidity: 65, wind: 3, desc: '晴转多云', icon: '☀️', wind_dir: '东南风' },
      '上海': { temp: 30, feels_like: 33, humidity: 75, wind: 4, desc: '多云', icon: '☁️', wind_dir: '东风' },
      '广州': { temp: 33, feels_like: 38, humidity: 85, wind: 2, desc: '雷阵雨', icon: '⛈️', wind_dir: '南风' },
      '深圳': { temp: 32, feels_like: 37, humidity: 82, wind: 3, desc: '多云转晴', icon: '🌤️', wind_dir: '东南风' },
      '杭州': { temp: 29, feels_like: 32, humidity: 70, wind: 3, desc: '晴', icon: '☀️', wind_dir: '东北风' },
      '南京': { temp: 27, feels_like: 29, humidity: 68, wind: 2, desc: '多云', icon: '☁️', wind_dir: '北风' },
      '武汉': { temp: 31, feels_like: 35, humidity: 72, wind: 3, desc: '晴', icon: '☀️', wind_dir: '南风' },
      '成都': { temp: 25, feels_like: 27, humidity: 80, wind: 1, desc: '阴', icon: '☁️', wind_dir: '微风' },
      '西安': { temp: 26, feels_like: 28, humidity: 55, wind: 2, desc: '晴', icon: '☀️', wind_dir: '西北风' },
      '重庆': { temp: 34, feels_like: 40, humidity: 88, wind: 1, desc: '小雨', icon: '🌧️', wind_dir: '无风' }
    };

    const data = mockData[city] || mockData['北京'];

    return {
      city: city,
      temperature: data.temp,
      feels_like: data.feels_like,
      humidity: data.humidity,
      wind_speed: data.wind,
      wind_direction: data.wind_dir,
      description: data.desc,
      main: data.desc.includes('晴') ? 'Clear' : data.desc.includes('雨') ? 'Rain' : 'Clouds',
      icon: data.icon,
      pressure: 1013,
      visibility: 10000,
      uv_index: data.temp > 30 ? '强' : '中等',
      air_quality: '良',
      sunrise: '05:30',
      sunset: '19:45',
      timestamp: new Date().toISOString()
    };
  },

  getMockForecast(city, days) {
    const weatherOptions = [
      { weather: 'Clear', icon: '☀️', desc: '晴' },
      { weather: 'Clouds', icon: '☁️', desc: '多云' },
      { weather: 'Rain', icon: '🌧️', desc: '小雨' },
      { weather: 'Drizzle', icon: '🌦️', desc: '阵雨' }
    ];

    const forecast = [];
    const today = new Date();

    for (let i = 1; i <= days; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const weather = weatherOptions[Math.floor(Math.random() * weatherOptions.length)];
      const baseTemp = this.getMockWeather(city).temperature;

      forecast.push({
        date: date.toISOString().split('T')[0],
        temperature: {
          min: baseTemp - 3 - Math.floor(Math.random() * 4),
          max: baseTemp + 2 + Math.floor(Math.random() * 4)
        },
        weather: weather.weather,
        description: weather.desc,
        icon: weather.icon,
        precipitation: Math.floor(Math.random() * 60)
      });
    }

    return {
      city: city,
      forecast: forecast
    };
  },

  async getWeatherSummary(city = '北京') {
    const current = await this.getWeather(city);
    const forecast = await this.getWeatherForecast(city, 3);

    return {
      current: current,
      forecast: forecast.forecast
    };
  }
};

module.exports = WeatherService;