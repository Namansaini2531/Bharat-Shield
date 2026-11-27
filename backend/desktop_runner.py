import os
import sys
from pathlib import Path

# Force unbuffered stdout/stderr so logs flush immediately to the Rust supervisor
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(line_buffering=True)
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(line_buffering=True)

# Add project root and backend directory to sys.path
PROJECT_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(PROJECT_ROOT))
sys.path.insert(0, str(PROJECT_ROOT / "backend"))

import uvicorn
from backend.app.main import app

def main():
    # Read port from CLI arguments or environment variable
    port = 8000
    if len(sys.argv) > 1:
        try:
            port = int(sys.argv[1])
        except ValueError:
            print(f"[Desktop Runner] Invalid port argument: {sys.argv[1]}, falling back to 8000")
            port = 8000
    else:
        port = int(os.environ.get("BHARAT_SHIELD_PORT", 8000))

    host = "127.0.0.1"
    print(f"BHARAT_SHIELD_SIDECAR_STARTING:{host}:{port}")

    config = uvicorn.Config(
        app=app,
        host=host,
        port=port,
        log_level="info",
        access_log=True,
    )
    server = uvicorn.Server(config)
    server.run()

if __name__ == "__main__":
    main()
