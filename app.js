'use strict';

const express = require('express');
const createRenderer = require('./renderer');

const port = process.env.PORT || 3001;

let renderer = null;

const app = express();


app.disable('x-powered-by');


app.use(async (req, res, next) => {
  if (!req.query.url) {
    return res.status(400).send('For example, You can visit to add ?url=http://github.com');
  }

  try {

    const html = await renderer.render(req.query.url);
    res.status(200).send(html);

  } catch (e) {
    next(e);
  }
});


app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Oops, An expected error seems to have occurred.');
});


createRenderer().then((createdRender) => {
  renderer = createdRender;
  console.info('Initialized renderer.');

  app.listen(port, () => {
    console.info(`Listen port on ${port}.`);
  });
}).catch((e) => {
  console.error('Fail to initialze renderer.', e);
});
