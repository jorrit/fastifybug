import fastify from 'fastify';
import fastifyStatic from 'fastify-static';
import { join } from 'path';

const server = fastify({
  logger: true, //process.env.NODE_ENV !== 'production',
  trustProxy: true,
});

// Serve public files.
server.register(fastifyStatic, {
  root: join(__dirname, 'public'),
  prefix: '/',
  cacheControl: true,
  dotfiles: 'ignore',
  etag: true,
});

server.get('/embed.js', (request, reply) => {
  // TODO: caching headers
  // TODO: get variables
  // TODO: read config.
  // TODO: send reply.
  reply.type('application/javascript; charset=UTF-8');
  reply.send('console.log("test");');
});

server.listen(process.env.PORT || 3200, '0.0.0.0').catch(err => {
  console.error('Failed to start server', err);
  process.exit(1);
});

export {};
