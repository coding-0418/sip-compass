"""First-pass AI labelling with GitHub Models (gpt-4o-mini). Codebook mirrors the metric decomposition."""
import csv, json, os, random, time, requests

CODEBOOK = """Label each review about the Groww app. Return JSON {"items":[...]} with one object per review, same order:
{"i": index, "relevance": "direct"|"adjacent"|"none", "stage": one of
 "A_setup" (KYC, onboarding, AutoPay/mandate setup or activation),
 "B_execution" (SIP instalment failed, not deducted, double debit, mandate rejected or cancelled),
 "C_status" (money debited but units/order not showing, pending/processing, unclear order status),
 "D_value" (returns, NAV, current value, losses, XIRR or performance confusion),
 "E_control" (skip, pause, change amount or date, cancel, redeem/withdraw difficulty),
 "F_support" (customer support slow, unhelpful or unresolved),
 "G_other" (not about SIP or mutual fund continuation, e.g. stocks, F&O, crashes, ads, charges),
 "outcome": "stopped_or_cancelled"|"paused_or_skipped"|"considering_stop"|"continuing"|"unknown",
 "span": exact words copied from the review (max 15 words) that justify the stage, or "" if none}
relevance: direct = about the reviewer's own SIP or mutual fund investing on Groww; adjacent = about mutual funds/payments generally; none = otherwise.
Use G_other and relevance none when unsure. Do not guess an outcome; use unknown unless the review states it."""

rows = [r for r in csv.DictReader(open("research/raw_all.csv")) if r["sip_keyword"] == "True"]
random.seed(7)
play = [r for r in rows if r["source"] == "google_play"]
other = [r for r in rows if r["source"] != "google_play"]
random.shuffle(play)
sample = other + play
sample = sample[: int(os.environ.get("MAX_LABEL", "2000"))]
print("to label", len(sample), "of keyword rows", len(rows))

H = {"Authorization": f"Bearer {os.environ['GITHUB_TOKEN']}", "Content-Type": "application/json", "Accept": "application/vnd.github+json"}
out, B = [], 20
for s in range(0, len(sample), B):
    batch = sample[s:s + B]
    text = "\n".join(f"[{i}] {r['text'][:600]}" for i, r in enumerate(batch))
    body = {"model": "openai/gpt-4o-mini", "temperature": 0, "response_format": {"type": "json_object"},
            "messages": [{"role": "system", "content": CODEBOOK}, {"role": "user", "content": text}]}
    for attempt in range(4):
        r = requests.post("https://models.github.ai/inference/chat/completions", headers=H, json=body, timeout=90)
        if r.status_code == 429:
            wait = int(r.headers.get("retry-after", "30")); print("429 wait", wait); 
            if wait > 600: break
            time.sleep(wait); continue
        break
    if r.status_code != 200:
        print("stop", r.status_code, r.text[:300]); break
    try:
        items = json.loads(r.json()["choices"][0]["message"]["content"])["items"]
    except Exception as e:
        print("parse", e); continue
    for it in items:
        try:
            src = batch[int(it["i"])]
        except Exception:
            continue
        out.append({**{k: src[k] for k in ("source", "id", "date", "rating", "thumbs", "text")},
                    "relevance": it.get("relevance"), "stage": it.get("stage"), "outcome": it.get("outcome"), "span": it.get("span", "")})
    time.sleep(4.2)
    if s % 200 == 0:
        print("labelled", len(out))
with open("research/labelled.csv", "w", newline="") as f:
    w = csv.DictWriter(f, fieldnames=list(out[0].keys())); w.writeheader(); w.writerows(out)
print("done", len(out))
