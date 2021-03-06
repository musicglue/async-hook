'use strict';

const asyncHook = require('../');
const assert = require('assert');

const fulfilledCalled = [];
const fulfilledArg = [];

const initUid = [];
const initHandle = [];
const initProvider = [];
const initParent = [];

const preUid = [];
const preHandle = [];

const postUid = [];
const postHandle = [];

const destroyUid = [];

asyncHook.addHooks({
  init: function (uid, handle, provider, parent) {
    initUid.push(uid);
    initHandle.push(handle);
    initProvider.push(provider);
    initParent.push(parent);
  },
  pre: function (uid, handle) {
    preUid.push(uid);
    preHandle.push(handle);
  },
  post: function (uid, handle) {
    postUid.push(uid);
    postHandle.push(handle);
  },
  destroy: function (uid) {
    destroyUid.push(uid);
  }
});

asyncHook.enable();

const p = Promise.resolve('a');

p.then(arg => {
  fulfilledCalled.push(true);
  fulfilledArg.push(arg);
});
p.then(arg => {
  fulfilledCalled.push(true);
  fulfilledArg.push(arg);
});

asyncHook.disable();

process.once('exit', function () {
  assert.equal(initUid.length, 2);

  for (let i = 0; i < 2; ++i) {
    assert.equal(initUid[i], preUid[i]);
    assert.equal(initUid[i], postUid[i]);
    assert.equal(initUid[i], destroyUid[i]);

    assert.equal(initHandle[i], preHandle[i]);
    assert.equal(initHandle[i], postHandle[i]);

    assert.equal(initHandle[i].constructor.name, 'PromiseWrap');
    assert.equal(initParent[i], null);
    assert.equal(initProvider[i], 0);

    assert.equal(fulfilledCalled[i], true);
    assert.equal(fulfilledArg[i], 'a');
  }
});
