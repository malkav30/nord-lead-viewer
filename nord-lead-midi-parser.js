// Generated by CoffeeScript 1.3.1
(function() {
  var DATA_TYPE, DEBUG, MANUFACTURER_ID, MODEL_ID, SINGLE_PATCH_DATA_LENGTH, bang, inlets, msg_counter, msg_int, outlets, output_result, parse_percussion_data, parse_raw_data, parse_single_patch_data, patch_counter, percussion, probe_if_patch, probe_if_pkit, probe_raw_data, raw, raw_data, root, status, sysex_finished,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  DEBUG = false;

  MANUFACTURER_ID = 51;

  MODEL_ID = 4;

  DATA_TYPE = {
    INVALID: 0,
    PATCH: 1,
    PKIT: 2,
    OTHERS: 100
  };

  SINGLE_PATCH_DATA_LENGTH = 132;

  inlets = 1;

  outlets = 2;

  patch_counter = 0;

  msg_counter = 0;

  raw_data = [];

  status = 0;

  msg_int = function(n) {
    switch (n) {
      case 240:
        status = 1;
        return raw_data = [];
      case 247:
        status = 0;
        return sysex_finished(raw_data);
      default:
        return raw_data.push(n);
    }
  };

  bang = function(b) {
    return outlet(0, parse_raw_data(raw_data));
  };

  raw = function(r) {
    var elt, i, _i, _len, _results;
    _results = [];
    for (i = _i = 0, _len = raw_data.length; _i < _len; i = ++_i) {
      elt = raw_data[i];
      _results.push(outlet(1, [i, elt]));
    }
    return _results;
  };

  percussion = function(n) {
    var data, result;
    if (probe_raw_data(raw_data) === DATA_TYPE.PKIT) {
      data = parse_raw_data(raw_data);
      result = parse_percussion_data(data, n);
      return output_result(result);
    }
  };

  sysex_finished = function(raw_data) {
    var data, result, t;
    t = probe_raw_data(raw_data);
    switch (t) {
      case DATA_TYPE.PATCH:
        data = parse_raw_data(raw_data);
        result = parse_single_patch_data(data);
        return output_result(result);
      case DATA_TYPE.PKIT:
        data = parse_raw_data(raw_data);
        result = parse_percussion_data(data, 0);
        return output_result(result);
    }
  };

  probe_raw_data = function(raw_data) {
    if (raw_data[0] === MANUFACTURER_ID && raw_data[2] === MODEL_ID) {
      if (probe_if_patch(raw_data)) {
        return DATA_TYPE.PATCH;
      } else if (probe_if_pkit(raw_data)) {
        return DATA_TYPE.PKIT;
      } else {
        return DATA_TYPE.OTHERS;
      }
    } else {
      return DATA_TYPE.INVALID;
    }
  };

  probe_if_patch = function(raw_data) {
    var c1, c2, c3, _i, _ref, _ref1, _ref2, _results;
    c1 = raw_data.length === 137;
    c2 = raw_data[3] === 0 && (_ref = raw_data[4], __indexOf.call([0, 1, 2, 3], _ref) >= 0);
    c3 = (_ref1 = raw_data[3], __indexOf.call([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], _ref1) >= 0) && (_ref2 = raw_data[4], __indexOf.call((function() {
      _results = [];
      for (_i = 0; _i <= 98; _i++){ _results.push(_i); }
      return _results;
    }).apply(this), _ref2) >= 0);
    return c1 && (c2 || c3);
  };

  probe_if_pkit = function(raw_data) {
    var c1, c2, c3, _ref, _ref1, _ref2;
    c1 = raw_data.length = 1061;
    c2 = raw_data[3] === 0 && (_ref = raw_data[4], __indexOf.call([16, 17, 18, 19], _ref) >= 0);
    c3 = (_ref1 = raw_data[3], __indexOf.call([1, 2, 3, 4], _ref1) >= 0) && (_ref2 = raw_data[4], __indexOf.call([99, 100, 101, 102, 103, 104, 105, 106, 107, 108], _ref2) >= 0);
    return c1 && (c2 || c3);
  };

  parse_single_patch_data = function(data) {
    var i, l, result;
    l = SINGLE_PATCH_DATA_LENGTH / 2;
    result = (function() {
      var _i, _results;
      _results = [];
      for (i = _i = 0; 0 <= l ? _i < l : _i > l; i = 0 <= l ? ++_i : --_i) {
        _results.push(data[i * 2] + 16 * data[i * 2 + 1]);
      }
      return _results;
    })();
    return result;
  };

  parse_percussion_data = function(data, index) {
    var b, e, p_data;
    b = index * SINGLE_PATCH_DATA_LENGTH;
    e = b + SINGLE_PATCH_DATA_LENGTH;
    p_data = data.slice(b, e);
    return parse_single_patch_data(p_data);
  };

  parse_raw_data = function(raw_data) {
    return raw_data.slice(5);
  };

  output_result = function(result) {
    var elt, i, _i, _len, _results;
    if (result) {
      _results = [];
      for (i = _i = 0, _len = result.length; _i < _len; i = ++_i) {
        elt = result[i];
        _results.push(outlet(0, [i, elt]));
      }
      return _results;
    }
  };

  root.inlets = inlets;

  root.outlets = outlets;

  root.bang = bang;

  root.msg_int = msg_int;

  root.percussion = percussion;

  if (DEBUG) {
    root.raw = raw;
  }

}).call(this);
