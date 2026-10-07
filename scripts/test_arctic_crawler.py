import urllib.request
import urllib.error
import json
import time

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
}

def fetch_page(url, max_retries=5):
    for attempt in range(max_retries):
        try:
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req, timeout=15) as resp:
                data = json.loads(resp.read().decode('utf-8'))
                return data.get('data', [])
        except urllib.error.HTTPError as e:
            if e.code in (422, 429, 503, 504):
                wait = (attempt + 1) * 1.5
                time.sleep(wait)
            else:
                print(f"HTTP error {e.code} on {url}: {e.read().decode('utf-8', errors='ignore')[:100]}")
                break
        except Exception as ex:
            time.sleep(1.0)
    return []

# Test pagination on r/india
print("Testing pagination on r/india...")
posts_collected = []
before = None

for i in range(5):
    url = "https://arctic-shift.photon-reddit.com/api/posts/search?subreddit=india&limit=100"
    if before:
        url += f"&before={before}"
    
    batch = fetch_page(url)
    if not batch:
        print(f"Batch {i+1}: empty or failed")
        break
    
    posts_collected.extend(batch)
    before = batch[-1]['created_utc']
    print(f"Batch {i+1}: got {len(batch)} posts (total: {len(posts_collected)}), oldest TS: {before} -> {time.strftime('%Y-%m-%d %H:%M:%S', time.gmtime(before))}")
    time.sleep(0.5)

print(f"Successfully collected {len(posts_collected)} real posts from r/india!")
if posts_collected:
    print(f"Sample post: [{posts_collected[0].get('subreddit')}] {posts_collected[0].get('author')}: {posts_collected[0].get('title')}")
    print(f"URL: {posts_collected[0].get('url')}")
    print(f"Permalink: https://reddit.com{posts_collected[0].get('permalink')}")
