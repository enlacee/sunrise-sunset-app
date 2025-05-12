require 'net/http'
require 'uri'
require 'json'

class SunAPI
  class ApiError < StandardError; end

  # Method to get sun data for a date range
  def self.get_sun_data(lat, lon, start_date, end_date)
    # We convert the dates from strings to Date
    start_date = Date.parse(start_date)
    end_date = Date.parse(end_date)

    sun_data = []

    # We loop through the date range and get the data for each day
    (start_date..end_date).each do |date|
      data = get_sun_data_for_day(lat, lon, date)
      sun_data << {
        date: date.to_s,
        sun_data: data
      }
    end

    sun_data
  end

  def self.get_sun_data_for_day(lat, lon, date)
    url = URI("https://api.sunrise-sunset.org/json?lat=#{lat}&lng=#{lon}&date=#{date}&formatted=0")
    res = Net::HTTP.get(url)
    data = JSON.parse(res)

    raise ApiError, 'API de sunrise-sunset falló' unless data['status'] == 'OK'

    data['results']
  end
end
