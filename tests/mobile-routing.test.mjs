import test from 'node:test';
import assert from 'node:assert/strict';
import {
  inputPorts,
  canConnect,
} from '../src/components/mobile/routingOptions.ts';

const node = (type, id = type) => ({
  id,
  type,
  position: { x: 0, y: 0 },
  data: {},
});

test('sequencers connect to synth pitch, never to an audio input', () => {
  for (const type of ['arpeggiator', 'arp2']) {
    assert.deepEqual(inputPorts(node(type), node('leadVoice')), [
      { id: 'pitch', label: 'Notes · Pitch' },
    ]);
    assert.deepEqual(inputPorts(node(type), node('mixer')), []);
    assert.deepEqual(inputPorts(node(type), node('destination')), []);
  }
});

test('audio routes expose all eight mixer channels and the vocoder carrier', () => {
  assert.deepEqual(
    inputPorts(node('drum2'), node('mixer')).map((port) => port.id),
    ['ch1', 'ch2', 'ch3', 'ch4', 'ch5', 'ch6', 'ch7', 'ch8'],
  );
  assert.equal(inputPorts(node('dualOsc'), node('vocoder'))[0].id, 'carrier');
  assert.equal(inputPorts(node('mixer'), node('destination'))[0].id, null);
});

test('sources cannot connect to themselves or use the master as a source', () => {
  assert.deepEqual(inputPorts(node('delay'), node('delay')), []);
  assert.deepEqual(inputPorts(node('destination'), node('gain')), []);
  assert.deepEqual(inputPorts(node('noise'), node('drum2')), []);
});

test('CV exposes only modulation handles that the audio engine implements', () => {
  assert.deepEqual(
    inputPorts(node('lfo'), node('oscillator')).map((port) => port.id),
    ['mod'],
  );
  assert.deepEqual(
    inputPorts(node('lfo'), node('filter')).map((port) => port.id),
    [null, 'mod'],
  );
  assert.deepEqual(inputPorts(node('lfo'), node('leadVoice')), []);
});

test('duplicate cables are rejected, including null/undefined audio handles', () => {
  const from = node('drum2');
  const to = node('mixer');
  const edges = [
    { id: 'existing', source: from.id, target: to.id, targetHandle: 'ch1' },
  ];
  assert.equal(canConnect(from, to, 'ch1', edges), false);
  assert.equal(canConnect(from, to, 'ch2', edges), true);
  assert.equal(canConnect(from, to, 'pitch', []), false);
  assert.equal(
    canConnect(to, node('destination'), null, [
      { id: 'out', source: to.id, target: 'destination' },
    ]),
    false,
  );
});
