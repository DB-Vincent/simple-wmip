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
      ctx.body = "\
                                       _____________________\n\
                                      |                     |\n\
                                      |" + centerText(ctx.request.ip) + "|\n\
                                      |___  ________________|   \n\
                                          \\/\n\
\n\
 ___________________        ____....-----....____\n\
(________________LL_)   ==============================\n\
    ______\   \_______.--'.  `---..._____...---'\n\
    `-------..__            ` ,/\n\
                `-._ -  -  - |\n\
                    `-------'"
    //   ctx.body = ctx.request.ip;
  }
}

function centerText(text) {
  textLength = text.length;
  outputText = "";

  if ((textLength % 2) === 0) {
    spacing = (21 - textLength) / 2

    for (i = 0; i < Math.floor(spacing); i++) {
      outputText += " ";
    }

    outputText += text;

    for (i = 0; i < Math.ceil(spacing); i++) {
      outputText += " ";
    }
  } else {
    spacing = (21 - textLength) / 2

    for (i = 0; i < spacing; i++) {
      outputText += " ";
    }

    outputText += text;

    for (i = 0; i < spacing; i++) {
      outputText += " ";
    }
  }

  return outputText
}

// composed middleware
const all = compose([
  responseTime,
  logger,
  respond
]);

app.use(all);

if (!module.parent) app.listen(1337);