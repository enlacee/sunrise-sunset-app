require 'net/http'
require 'uri'
require 'json'

class Geocoder
  class CityNotFound < StandardError; end

  def self.get_coordinates(city)
    url = URI("https://nominatim.openstreetmap.org/search?city=#{URI.encode_www_form_component(city)}&format=json")
    res = Net::HTTP.get(url)
    data = JSON.parse(res)

    raise CityNotFound, 'City not found' if data.empty?

    {
      lat: data[0]['lat'],
      lon: data[0]['lon']
    }
  end
end
