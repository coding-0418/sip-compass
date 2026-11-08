"""Collect public Groww reviews/posts about SIPs. Runs in GitHub Actions (internet access)."""
import json, re, time, csv, sys, urllib.request, urllib.parse
from google_play_scraper import reviews, Sort

APP = "com.nextbillion.groww"
SIP = re.compile(r"\b(sip|sips|systematic|instal+ment|mandate|auto ?pay|autopay|nach|mutual fund|mutual funds|\bmf\b|nav|units? (not|are|is)|allot)", re.I)
rows = []

def play(sort, label, target):
    token, n = None, 0
    while n < target:
        try:
            res, token = reviews(APP, lang="en", country="in", sort=sort, count=200, continuation_token=token)
        except Exception as e:
            print("play error", e); break
        if not res: break
        for r in res:
            rows.append({"source": "google_play", "sort": label, "id": r["reviewId"], "date": str(r["at"])[:10],
                         "rating": r["score"], "thumbs": r["thumbsUpCount"], "text": (r["content"] or "").replace("\n", " ")})
        n += len(res)
        if token is None: break
        time.sleep(0.3)
    print(label, n, file=sys.stderr)

play(Sort.NEWEST, "newest", 40000)
play(Sort.MOST_RELEVANT, "relevant", 6000)

# App Store public RSS (max 10 pages x 50)
for page in range(1, 11):
    for s in ["mostrecent", "mosthelpful"]:
        url = f"https://itunes.apple.com/in/rss/customerreviews/page={page}/id=1404871703/sortby={s}/json"
        try:
            d = json.load(urllib.request.urlopen(url, timeout=20))
            for e in d.get("feed", {}).get("entry", [])[1:] if page == 1 else d.get("feed", {}).get("entry", []):
                if "content" not in e: continue
                rows.append({"source": "app_store", "sort": s, "id": e["id"]["label"], "date": e.get("updated", {}).get("label", "")[:10],
                             "rating": int(e["im:rating"]["label"]), "thumbs": 0,
                             "text": (e["title"]["label"] + ". " + e["content"]["label"]).replace("\n", " ")})
        except Exception as ex:
            print("appstore", page, s, ex, file=sys.stderr)

# Reddit public JSON search (may be blocked on CI)
UA = {"User-Agent": "sip-research-script/0.1 (academic project)"}
for sub in ["IndiaInvestments", "mutualfunds", "personalfinanceindia", "IndianStreetBets"]:
    for q in ["SIP stopped", "SIP failed", "SIP mandate", "Groww SIP", "pause SIP", "first SIP"]:
        url = f"https://www.reddit.com/r/{sub}/search.json?q={urllib.parse.quote(q)}&restrict_sr=1&limit=100&sort=relevance"
        try:
            d = json.load(urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=20))
            for c in d["data"]["children"]:
                p = c["data"]
                rows.append({"source": "reddit", "sort": f"{sub}:{q}", "id": p["id"], "date": time.strftime("%Y-%m-%d", time.gmtime(p["created_utc"])),
                             "rating": "", "thumbs": p.get("score", 0), "text": (p["title"] + ". " + (p.get("selftext") or "")).replace("\n", " ")[:3000]})
        except Exception as ex:
            print("reddit", sub, q, ex, file=sys.stderr)
        time.sleep(1.2)

seen, uniq = set(), []
for r in rows:
    k = (r["source"], r["id"])
    if k in seen: continue
    seen.add(k); uniq.append(r)
for r in uniq:
    r["sip_keyword"] = bool(SIP.search(r["text"]))
with open("research/raw_all.csv", "w", newline="") as f:
    w = csv.DictWriter(f, fieldnames=list(uniq[0].keys())); w.writeheader(); w.writerows(uniq)
summary = {"raw_rows": len(rows), "unique": len(uniq),
           "by_source": {s: sum(1 for r in uniq if r["source"] == s) for s in {r["source"] for r in uniq}},
           "sip_keyword": {s: sum(1 for r in uniq if r["source"] == s and r["sip_keyword"]) for s in {r["source"] for r in uniq}}}
json.dump(summary, open("research/scrape_summary.json", "w"), indent=1)
print(json.dumps(summary))
