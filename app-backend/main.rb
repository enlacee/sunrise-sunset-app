require 'sinatra'
require 'json'
require 'net/http'
require 'uri'
require 'dotenv/load'
require_relative './services/geocoder'
require_relative './services/sun_api'
require_relative './utils/utils'  # File of validation

set :bind, '0.0.0.0' # Allow external access if needed

# CORS simple
before do
  response.headers['Access-Control-Allow-Origin'] = '*'
  response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
  response.headers['Access-Control-Allow-Headers'] = 'Origin, Content-Type, Accept, Authorization'
end

# Cache Simple on memory
$cache = {}

get '/ping' do
  content_type :json
  { status: 'ok' }.to_json
end

get '/sun' do
  content_type :json

  expected_params = %w[city startDate endDate]
  received_params = params.keys

  unexpected = received_params - expected_params
  unless unexpected.empty?
    halt 400, { error: "Unexpected parameters: #{unexpected.join(', ')}" }.to_json
  end

  city = params['city']&.strip
  start_date = params['startDate']
  end_date = params['endDate']

  if city.nil? || city.empty?
    halt 400, { error: 'The `city` parameter  is required.' }.to_json
  end

  # Date validation
  if start_date && !Utils.valid_date?(start_date)
    halt 400, { error: "`startDate` must be in YYYY-MM-DD format." }.to_json
  end

  if end_date && !Utils.valid_date?(end_date)
    halt 400, { error: "`endDate` must be in YYYY-MM-DD format." }.to_json
  end

  if start_date && end_date
    if Date.parse(start_date) > Date.parse(end_date)
      halt 400, { error: "`startDate` cannot be after `endDate`." }.to_json
    end
  end

  # Clear the cache before each query
  Utils.clean_cache($cache)

  cache_key = "#{city}-#{start_date}-#{end_date}"

  # Check if the data is in cache
  if $cache.key?(cache_key)
    # If the data is in cache, we return directly
    return $cache[cache_key][:data].to_json
  end

  coords = Geocoder.get_coordinates(city)
  sun_data = SunAPI.get_sun_data(coords[:lat], coords[:lon], start_date, end_date)

  # Save to cache with timestamp
  $cache[cache_key] = {
    data: {
      city: city,
      coordinates: coords,
      date_range: { start: start_date, end: end_date },
      sun: sun_data
    },
    timestamp: Time.now
  }

  # Return data with cache
  $cache[cache_key][:data].to_json
rescue Geocoder::CityNotFound => e
  halt 404, { error: e.message }.to_json
rescue SunAPI::ApiError => e
  halt 502, { error: e.message }.to_json
rescue SocketError
  halt 503, { error: 'No internet connection or incorrect URL' }.to_json
rescue => e
  halt 500, { error: 'Internal Server Error', details: e.message }.to_json
end
