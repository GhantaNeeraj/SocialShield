import app from '../backend-node/server.js';

export default function handler(request, response) {
  return app(request, response);
}
