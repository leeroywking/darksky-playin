DROP TABLE IF EXISTS events;

CREATE TABLE events(
id SERIAL PRIMARY KEY,
location VARCHAR(100),
time VARCHAR(10),
summary VARCHAR(50),
icon VARCHAR(25),
sunriseTime VARCHAR(10),
sunsetTime VARCHAR(10),
moonPhase VARCHAR(10),
precipIntensity VARCHAR(10),
precipIntensityMax VARCHAR(10),
precipProbability VARCHAR(10),
temperatureHigh VARCHAR(10),
temperatureHighTime VARCHAR(10),
temperatureLow VARCHAR(10),
temperatureLowTime VARCHAR(10),
apparentTemperatureHigh VARCHAR(10),
apparentTemperatureHighTime VARCHAR(10),
apparentTemperatureLow VARCHAR(10),
apparentTemperatureLowTime VARCHAR(10),
dewPoint VARCHAR(10),
humidity VARCHAR(10),
pressure VARCHAR(10),
windSpeed VARCHAR(10),
windGust VARCHAR(10),
windGustTime VARCHAR(10),
windBearing VARCHAR(10),
cloudCover VARCHAR(10),
uvIndex VARCHAR(10),
uvIndexTime VARCHAR(10),
visibility VARCHAR(10),
ozone VARCHAR(10),
temperatureMin VARCHAR(10),
temperatureMinTime VARCHAR(10),
temperatureMax VARCHAR(10),
temperatureMaxTime VARCHAR(10),
apparentTemperatureMin VARCHAR(10),
apparentTemperatureMinTime VARCHAR(10),
apparentTemperatureMax VARCHAR(10),
apparentTemperatureMaxTime VARCHAR(10),
formattedloc VARCHAR(50),
saveTime VARCHAR(13),
userId VARCHAR(25),
);


DROP TABLE IF EXISTS userPeople;

CREATE TABLE userPeople(
id SERIAL PRIMARY KEY,
userId VARCHAR(25),
userName VARCHAR(25),
dataFields VARCHAR(500)
)