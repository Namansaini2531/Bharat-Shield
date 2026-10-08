import urllib.request
import json
import time

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

subreddits = [
    'india', 'indiasocial', 'delhi', 'mumbai', 'bangalore', 
    'developersIndia', 'IndiaInvestments', 'IndiaSpeaks', 
    'unitedstatesofindia', 'LegalAdviceIndia'
]

for sub in subreddits:
    t0 = time.time()
    url = f'https://arctic-shift.photon-reddit.com/api/posts/search?subreddit={sub}&limit=100'
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            posts = data.get('data', [])
            title = posts[0].get('title', '')[:40] if posts else 'none'
            elapsed = time.time() - t0
            print(f'r/{sub}: fetched {len(posts)} posts in {elapsed:.2f}s (Latest: "{title}...")')
    except Exception as e:
        print(f'r/{sub}: ERROR {e}')
