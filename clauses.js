// Contract clause QA for legal-tech review: flags clauses that commonly deserve
// a second look - broad indemnities, unlimited liability hints, auto-renewals
// without notice windows, perpetual IP language, vague payment terms, and
// missing termination or governing-law clauses. Heuristic review of pasted
// text. Pure functions, no DOM. NOT legal advice.
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.ContractClauseCheck = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  function parseLines(input) {
    const rows = [];
    const skipped = [];
    input.split('\n').forEach((raw, i) => {
      const line = raw.trim();
      if (!line) return;
      const p = raw.split('|').map((s) => s.trim());
      if (p.length >= 2 && p[0]) rows.push({ section: p[0], text: p.slice(1).join(' | '), line: i + 1 });
      else skipped.push(i + 1);
    });
    return { rows, skipped };
  }

  function check(input) {
    const { rows, skipped } = typeof input === 'string' ? parseLines(input) : input;
    const findings = [];
    const push = (level, code, text) => findings.push({ level, code, text });
    const all = rows.map((r) => r.text).join('\n');

    rows.forEach((r) => {
      if (/indemnif/i.test(r.text) && /any and all|all claims|without limitation/i.test(r.text))
        push('warn', 'BROAD_INDEMNITY', `Line ${r.line} (${r.section}): indemnity with "any and all"-style breadth - verify whether the indemnity is mutual and bounded; broad one-way indemnities shift heavy risk.`);
      if (/liabilit|liabl/i.test(r.text) && !/cap|limit|maximum|aggregate|exceed/i.test(r.text))
        push('warn', 'UNLIMITED_LIABILITY_HINT', `Line ${r.line} (${r.section}): liability language with no cap/limit wording nearby - verify whether liability is capped elsewhere in the agreement.`);
      if (/auto.?renew|automatically renew/i.test(r.text) && !/\d+\s*(days|months).{0,40}notice|notice.{0,40}\d+\s*(days|months)/i.test(r.text))
        push('warn', 'AUTO_RENEWAL_NO_NOTICE_HINT', `Line ${r.line} (${r.section}): auto-renewal wording with no notice window visible - verify a cancellation notice period exists.`);
      if (/perpetu|irrevocab/i.test(r.text) && /(intellectual property|\bIP\b|assign|license)/i.test(r.text))
        push('warn', 'PERPETUAL_IP_HINT', `Line ${r.line} (${r.section}): perpetual/irrevocable wording near IP or assignment - verify the scope; perpetual grants are hard to unwind.`);
      if (/payment|fee|invoice|compensation/i.test(r.text) && !/\bnet\s*\d+|\d+\s*(days|business days)|due date/i.test(r.text))
        push('warn', 'VAGUE_PAYMENT_TERMS', `Line ${r.line} (${r.section}): payment language with no due-window wording - verify a concrete payment term (e.g. net-30) is stated.`);
    });

    if (rows.length && !/governing law|jurisdiction|courts of/i.test(all))
      push('warn', 'MISSING_GOVERNING_LAW', 'No governing-law or jurisdiction wording found in the pasted text - verify a governing-law clause exists in the full agreement.');
    if (rows.length && !/terminat/i.test(all))
      push('warn', 'MISSING_TERMINATION_CLAUSE', 'No termination wording found in the pasted text - verify exit rights (notice, cause, effect) exist in the full agreement.');
    if (skipped.length) push('warn', 'UNPARSED', `Line(s) ${skipped.join(', ')} skipped - expected section | clause-text.`);
    if (rows.length && !findings.some((f) => f.level !== 'ok'))
      push('ok', 'NO_PATTERNS_FLAGGED', `${rows.length} clause(s) passed these heuristics - absence of a flag is not a clean bill of health; see Limitations.`);
    return { findings, stats: { clauses: rows.length } };
  }
  return { parseLines, check };
});
