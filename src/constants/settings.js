const settings = {};

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  // dev code
  settings['api_url'] = process.env.AIDOPTIMIZER_API_URL
    ? process.env.AIDOPTIMIZER_API_URL
    : 'http://localhost:8000';
} else {
  // production code
  settings['api_url'] = process.env.AIDOPTIMIZER_API_URL
    ? process.env.AIDOPTIMIZER_API_URL
    : 'https://aidapi.bioinformatix.io';
}

settings['media_url'] = 'https://bioinformatix.nyc3.digitaloceanspaces.com/bioinformatix/media/';

export default settings;
