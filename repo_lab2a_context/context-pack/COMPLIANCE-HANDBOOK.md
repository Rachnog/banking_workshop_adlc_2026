# Meridian Bank — Compliance Policy MB-COMP-7 (Large-Value Reporting)

> **Fictional training document.** Aligned in spirit with public Vietnamese AML concepts
> (e.g. large-value transaction reporting); all specifics are simplified or invented.
> Not legal guidance. No real bank's policy appears here.

## 1. Obligation

Meridian Bank (BIC `DEMOVNVX`) files a **Large-Value Transaction Report (LVTR)** with the
regulator for every business day, covering all posted payments at or above the reporting
threshold.

## 2. Reporting threshold

- Threshold: **400,000,000 VND**, inclusive (a payment of exactly 400,000,000 VND is reported).
- Payments in other currencies are converted to a **VND equivalent** using the bank's daily
  reference rates (`data/fx-reference.json`; rate = VND per 1 major unit of the currency).
- VND equivalent is computed from the payment's **minor units**, honoring each currency's
  decimal places (VND and JPY have 0, USD/EUR/GBP/SGD/HKD have 2), and **rounded UP** to a
  whole VND (fail conservative: when in doubt, report).

## 3. Business dates and time

- The business date of a payment is its booking timestamp converted to
  **Asia/Ho_Chi_Minh (ICT, UTC+7, no DST)**. A payment booked 2026-07-21T17:30:00Z belongs
  to business date **2026-07-22**.
- Timestamps are STORED in UTC (bank house rule); ICT applies only to business-date
  derivation and reporting.
- The report for business date D is due **D+1, 16:00 ICT**.

## 4. What is reported

- **One row per payment** — not per ledger leg. (Every payment produces a DEBIT and a
  CREDIT transaction; reporting both would double-count.)
- Include payments with screening status CLEAR **and** FLAGGED.
- Exclude payments REJECTED by screening — they were never posted.

## 5. Control requirements

- Report generation is recorded in the audit trail (`report.lvtr_generated`), including
  business date, row count and total VND equivalent.
- A second person reviews the file before submission (out of scope for the service;
  the audit entry is what makes the review possible).

## 6. Do not conflate

The **screening thresholds** used for inline flagging (internal risk appetite, defined in the internal screening spec) are NOT the statutory LVTR threshold in §2.
Different numbers, different purposes, both in minor units internally.
