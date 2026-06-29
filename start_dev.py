import subprocess
import sys
import time
import os
from pathlib import Path

def main():
    print("=== Starting LLM Drift Monitor Dev Environment ===")
    
    # 1. Generate data if needed (running the existing run_all.py to ensure 4 runs of data)
    db_path = Path("data/drift_monitor.db")
    if not db_path.exists():
        print("\n[1/3] Database not found. Running harness to generate initial data...")
        subprocess.run(["uv", "run", "python", "run_all.py"], check=True, shell=True)
    else:
        print("\n[1/3] Database found. Skipping data generation.")
        print("      (If you want fresh data, delete data/drift_monitor.db and restart)")

    # 2. Start the Backend
    print("\n[2/3] Starting FastAPI Backend (Port 8000)...")
    
    # We use shell=False to avoid orphaned processes on Windows
    # uv is an executable so it doesn't need shell=True
    backend_process = subprocess.Popen(
        ["uv", "run", "uvicorn", "api.main:app", "--host", "0.0.0.0", "--port", "8000"],
        stdout=sys.stdout,
        stderr=sys.stderr,
        shell=False
    )
    
    # 3. Start the Frontend
    print("\n[3/3] Starting Next.js Frontend (Port 3000)...")
    frontend_dir = Path("frontend").absolute()
    npm_cmd = "npm.cmd" if os.name == "nt" else "npm"
    frontend_process = subprocess.Popen(
        [npm_cmd, "run", "dev"],
        cwd=frontend_dir,
        stdout=sys.stdout,
        stderr=sys.stderr,
        shell=False
    )
    
    print("\n" + "="*50)
    print(" All services started!")
    print("Dashboard:        http://localhost:3000")
    print("Backend API Docs: http://localhost:8000/docs")
    print("Press Ctrl+C to stop all services.")
    print("="*50 + "\n")
    
    try:
        # Keep the main thread alive while subprocesses run
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\nShutting down services...")
        backend_process.terminate()
        frontend_process.terminate()
        backend_process.wait()
        frontend_process.wait()
        print("Shutdown complete.")

if __name__ == "__main__":
    main()
