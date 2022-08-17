const fs = require('fs');

exports.getEndpoints = (req, res, next) => {
  fs.readFile(
    '/Users/damianmartin/Northcoders/backend/be-nc-news/endpoints.json',
    'utf8',
    (err, data) => {
      if (err) {
        next(err);
      }
      const parsedData = JSON.parse(data);
      res.status(200).send(parsedData);
    }
  );
};
