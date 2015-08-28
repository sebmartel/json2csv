'use strict';

var test = require('tape');
var async = require('async');
var json2csv = require('../lib/json2csv');
var loadFixtures = require('./helpers/load-fixtures');
var jsonDefault = require('./fixtures/json/default');
var jsonQuotes = require('./fixtures/json/quotes');
var jsonNested = require('./fixtures/json/nested');
var jsonDefaultValue = require('./fixtures/json/defaultValue');
var csvFixtures = {};

async.parallel(loadFixtures(csvFixtures), function (err) {
  if (err) {
    /*eslint-disable no-console*/
    console.log(err);
    /*eslint-enable no-console*/
  }

  test('should error if fieldNames don\'t line up to fields', function (t) {
    var params = {
      data: jsonDefault,
      field: ['carModel'],
      fieldNames: ['test', 'blah']
    };
    function _validate(err, csv) {
      t.equal(err.message, 'fieldNames and fields should be of the same length, if fieldNames is provided.');
      t.notOk(csv);
    }
    json2csv(params, _validate);

    var csv;
    try {
      csv = json2csv(params);
    } catch(e) {
      _validate(e, csv);
    }
    t.end();
  });

  test('should parse json to csv', function (t) {
    var params = {
      data: jsonDefault,
      fields: ['carModel', 'price', 'color']
    };
    function _validate(err, csv) {
      t.error(err);
      t.equal(csv, csvFixtures.default);
    }
    json2csv(params, _validate);
    _validate(null, json2csv(params));
    t.end();
  });

  test('should parse json to csv without fields', function (t) {
    var params = {
      data: jsonDefault
    };
    function _validate(err, csv) {
      t.error(err);
      t.equal(csv, csvFixtures.default);
    }
    json2csv(params, _validate);
    _validate(null, json2csv(params));
    t.end();
  });

  test('should parse json to csv without column title', function (t) {
    var params = {
      data: jsonDefault,
      fields: ['carModel', 'price', 'color'],
      hasCSVColumnTitle: false
    };
    function _validate(err, csv) {
      t.error(err);
      t.equal(csv, csvFixtures.withoutTitle);
    }
    json2csv(params, _validate);
    _validate(null, json2csv(params));
    t.end();
  });

  test('should parse data:{} to csv with only column title', function (t) {
    var params = {
      data: {},
      fields: ['carModel', 'price', 'color']
    };
    function _validate(err, csv) {
      t.error(err);
      t.equal(csv, '"carModel","price","color"');
    }
    json2csv(params, _validate);
    _validate(null, json2csv(params));
    t.end();
  });

  test('should parse data:[null] to csv with only column title', function (t) {
    var params = {
      data: [null],
      fields: ['carModel', 'price', 'color']
    };
    function _validate(err, csv) {
      t.error(err);
      t.equal(csv, '"carModel","price","color"');
    }
    json2csv(params, _validate);
    _validate(null, json2csv(params));
    t.end();
  });

  test('should output only selected fields', function (t) {
    var params = {
      data: jsonDefault,
      fields: ['carModel', 'price']
    };
    function _validate(err, csv) {
      t.error(err);
      t.equal(csv, csvFixtures.selected);
    }
    json2csv(params, _validate);
    _validate(null, json2csv(params));
    t.end();
  });

  test('should output not exist field with empty value', function (t) {
    var params = {
      data: jsonDefault,
      fields: ['first not exist field', 'carModel', 'price', 'not exist field', 'color']
    };
    function _validate(error, csv) {
      t.error(error);
      t.equal(csv, csvFixtures.withNotExistField);
    }
    json2csv(params, _validate);
    _validate(null, json2csv(params));
    t.end();
  });

  test('should output reversed order', function (t) {
    var params = {
      data: jsonDefault,
      fields: ['price', 'carModel']
    };
    function _validate(error, csv) {
      t.error(error);
      t.equal(csv, csvFixtures.reversed);
    }
    json2csv(params, _validate);
    _validate(null, json2csv(params));
    t.end();
  });

  test('should output a string', function (t) {
    var params = {
      data: jsonDefault,
      fields: ['carModel', 'price', 'color']
    };
    function _validate(error, csv) {
      t.error(error);
      t.ok(typeof csv === 'string');
    }
    json2csv(params, _validate);
    _validate(null, json2csv(params));
    t.end();
  });

  test('should escape quotes with double quotes', function (t) {
    var params = {
      data: jsonQuotes,
      fields: ['a string']
    };
    function _validate(error, csv) {
      t.error(error);
      t.equal(csv, csvFixtures.quotes);
    }
    json2csv(params, _validate);
    _validate(null, json2csv(params));
    t.end();
  });

  test('should use a custom delimiter when \'quotes\' property is present', function (t) {
    var params = {
      data: jsonDefault,
      fields: ['carModel', 'price'],
      quotes: '\''
    };
    function _validate(error, csv) {
      t.error(error);
      t.equal(csv, csvFixtures.withSimpleQuotes);
    }
    json2csv(params, _validate);
    _validate(null, json2csv(params));
    t.end();
  });

  test('should be able to don\'t output quotes when using \'quotes\' property', function (t) {
    var params = {
      data: jsonDefault,
      fields: ['carModel', 'price'],
      quotes: ''
    };
    function _validate(error, csv) {
      t.error(error);
      t.equal(csv, csvFixtures.withoutQuotes);
    }
    json2csv(params, _validate);
    _validate(null, json2csv(params));
    t.end();
  });

  test('should use a custom delimiter when \'del\' property is present', function (t) {
    var params = {
      data: jsonDefault,
      fields: ['carModel', 'price', 'color'],
      del: '\t'
    };
    function _validate(error, csv) {
      t.error(error);
      t.equal(csv, csvFixtures.tsv);
    }
    json2csv(params, _validate);
    _validate(null, json2csv(params));
    t.end();
  });

  test('should use a custom eol character when \'eol\' property is present', function (t) {
    var params = {
      data: jsonDefault,
      fields: ['carModel', 'price', 'color'],
      eol: ';'
    };
    function _validate(error, csv) {
      t.error(error);
      t.equal(csv, csvFixtures.eol);
    }
    json2csv(params, _validate);
    _validate(null, json2csv(params));
    t.end();
  });

  test('should use a custom eol character when \'newLine\' property is present', function (t) {
    var params = {
      data: jsonDefault,
      fields: ['carModel', 'price', 'color'],
      newLine: '\r\n'
    };
    function _validate(error, csv) {
      t.error(error);
      t.equal(csv, csvFixtures.newLine);
    }
    json2csv(params, _validate);
    _validate(null, json2csv(params));
    t.end();
  });

  test('should name columns as specified in \'fieldNames\' property', function (t) {
    var params = {
      data: jsonDefault,
      fields: ['carModel', 'price'],
      fieldNames: ['Car Model', 'Price USD']
    };
    function _validate(error, csv) {
      t.error(error);
      t.equal(csv, csvFixtures.fieldNames);
    }
    json2csv(params, _validate);
    _validate(null, json2csv(params));
    t.end();
  });

  test('should output nested properties', function (t) {
    var params = {
      data: jsonNested,
      fields: ['car.make', 'car.model', 'price', 'color', 'car.ye.ar'],
      fieldNames: ['Make', 'Model', 'Price', 'Color', 'Year'],
      nested: true
    };
    function _validate(error, csv) {
      t.error(error);
      t.equal(csv, csvFixtures.nested);
    }
    json2csv(params, _validate);
    _validate(null, json2csv(params));
    t.end();
  });

  test('should output default values when missing data', function (t) {
    params = {
      data: jsonDefaultValue,
      fields: ['carModel', 'price'],
      defaultValue: 'NULL'
    };
    function  _validate(error, csv) {
      t.error(error);
      t.equal(csv, csvFixtures.defaultValue);
    }
    json2csv(params, _validate);
    _validate(null, json2csv(params));
    t.end();
  });
});
