const test = require('node:test');
const assert = require('node:assert/strict');
const { check } = require('../clauses.js');

test('broad any-and-all indemnity is flagged', () => {
  const { findings } = check('Indemnity | Client shall indemnify Company against any and all claims.');
  assert.ok(findings.some((f) => f.code === 'BROAD_INDEMNITY'));
});

test('liability without cap wording is flagged', () => {
  const { findings } = check('Liability | Neither party shall be liable for damages.');
  assert.ok(findings.some((f) => f.code === 'UNLIMITED_LIABILITY_HINT'));
});

test('capped liability is not flagged', () => {
  const { findings } = check('Liability | Liability shall not exceed the aggregate fees paid.');
  assert.ok(!findings.some((f) => f.code === 'UNLIMITED_LIABILITY_HINT'));
});

test('auto-renewal without notice window is flagged', () => {
  const { findings } = check('Renewal | This agreement shall auto-renew annually.');
  assert.ok(findings.some((f) => f.code === 'AUTO_RENEWAL_NO_NOTICE_HINT'));
});

test('perpetual IP wording is flagged', () => {
  const { findings } = check('IP | All work product is assigned in perpetuity, irrevocably.');
  assert.ok(findings.some((f) => f.code === 'PERPETUAL_IP_HINT'));
});

test('vague payment terms are flagged, concrete terms are not', () => {
  const { findings } = check('Payment | Client shall pay the fees as invoiced.');
  assert.ok(findings.some((f) => f.code === 'VAGUE_PAYMENT_TERMS'));
  const concrete = check('Payment | Invoices are due net 30 days.');
  assert.ok(!concrete.findings.some((f) => f.code === 'VAGUE_PAYMENT_TERMS'));
});

test('missing governing law and termination are flagged, malformed lines unparsed', () => {
  const { findings } = check('Scope | Vendor provides services.\nbadline');
  assert.ok(findings.some((f) => f.code === 'MISSING_GOVERNING_LAW'));
  assert.ok(findings.some((f) => f.code === 'MISSING_TERMINATION_CLAUSE'));
  assert.ok(findings.some((f) => f.code === 'UNPARSED'));
});
