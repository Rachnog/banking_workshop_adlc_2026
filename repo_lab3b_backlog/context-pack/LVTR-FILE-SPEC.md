# LVTR file specification v1.3 (fictional regulator format)

## File

- Name: `LVTR_DEMOVNVX_<YYYYMMDD>_001.csv` — `<YYYYMMDD>` is the BUSINESS date (ICT).
  Sequence is fixed at `001` in this phase (resubmission is out of scope).
- Encoding UTF-8, **no BOM**. Line endings **LF**. No trailing newline after the trailer.

## Records (comma-separated, no quoting, fields may not contain commas)

1. Header (first line):
   `REPORT,LVTR,DEMOVNVX,<YYYYMMDD>,001`
2. Transaction rows — one per reportable payment, **ordered by endToEndId ascending**:
   `TXN,<endToEndId>,<debtorAccountId>,<creditorAccountId>,<currency>,<amountMajor>,<vndEquivalent>,<YYYYMMDD>`
   - `amountMajor`: major units with the currency's exact decimals ("16000.00" USD, "400000000" VND)
   - `vndEquivalent`: whole VND, integer, no separators (rounded UP per MB-COMP-7 §2)
   - `<YYYYMMDD>`: the payment's business date (ICT)
3. Trailer (last line):
   `TRAILER,<rowCount>,<sumVndEquivalent>`

## Worked example

USD payment of 16,000.00 at reference rate 25,400 VND/USD:
vndEquivalent = 16000.00 × 25400 = 406,400,000 → reportable (≥ 400,000,000).

```
REPORT,LVTR,DEMOVNVX,20260722,001
TXN,E2E-0001,ACC-USD-001,ACC-USD-002,USD,16000.00,406400000,20260722
TXN,E2E-0002,ACC-VND-001,ACC-VND-002,VND,400000000,400000000,20260722
TRAILER,2,806400000
```
