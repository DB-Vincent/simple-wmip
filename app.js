const compose = require('koa-compose');
const Koa = require('koa');
const app = module.exports = new Koa();

// x-response-time
async function responseTime(ctx, next) {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  ctx.set('X-Response-Time', ms + 'ms');
}

// logger
async function logger(ctx, next) {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  if ('test' != process.env.NODE_ENV) {
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
  }
}

// response
async function respond(ctx, next) {
  await next();
  if ('/' != ctx.url) return;

  if (process.env.REVERSE_PROXY == "true" || process.env.REVERSE_PROXY == "True") {
      ctx.body = ctx.header['x-forwarded-for'];
  } else {
      ctx.body = ctx.request.ip;
  }
}

// composed middleware
const all = compose([
  responseTime,
  logger,
  respond
]);

app.use(all);

if (!module.parent) app.listen(1337);