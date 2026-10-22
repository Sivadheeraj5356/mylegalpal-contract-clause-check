# Contract Clause Check

A client-side heuristic review of contract clauses, built with MyLegalPal's problem in mind: founders and small businesses sign contracts they have not fully read, and a first-pass screen for the clauses that usually deserve a second look is genuinely useful.

Paste clauses, one per line as `section | <clause-text>`, and the tool flags:

- **BROAD_INDEMNITY** - indemnity with "any and all"-style breadth
- **UNLIMITED_LIABILITY_HINT** - liability language with no cap/limit wording nearby
- **AUTO_RENEWAL_NO_NOTICE_HINT** - auto-renewal without a visible notice window
- **PERPETUAL_IP_HINT** - perpetual/irrevocable wording near IP or assignment
- **VAGUE_PAYMENT_TERMS** - payment language with no due-window wording
- **MISSING_GOVERNING_LAW / MISSING_TERMINATION_CLAUSE** - those clauses absent from the pasted text
- **UNPARSED** - lines that do not match the expected format

Plain HTML, CSS and JavaScript. No build step, no external services. **Not legal advice.**

## Run

Open `index.html` in a browser, paste clauses, click "Run clause check".

## Test

```
npm test
```

## Limitations

This is a wording-pattern screen, not legal review:

- It matches phrases; contract meaning depends on the whole document, context and jurisdiction. Every finding says "verify".
- A flag is a prompt to read more carefully, not a defect - broad wording is sometimes intended.
- Absence of a clause in pasted text does not prove it is absent from the full agreement.
- Tests verify the rules match their intended sample patterns; they do not prove real contracts are assessed correctly. This tool gives no legal advice.
