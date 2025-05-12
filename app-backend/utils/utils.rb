# utils/date_validator.rb


require 'date'
require 'time'

module Utils

  # Method to validate the format of a date (YYYY-MM-DD)
  def self.valid_date?(str)
    Date.iso8601(str)
    true
  rescue ArgumentError
    false
  end

  # Removes expired cache entries (default: 1 hour)
  def self.clean_cache(cache, ttl_seconds = 3600)
    current_time = Time.now
    cache.delete_if do |_, value|
      current_time - value[:timestamp] > ttl_seconds
    end
  end
end
