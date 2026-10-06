import json, threading, time
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from urllib.parse import urlparse
import urllib.request

PORT = 8080
state = {"nano": "", "enabled": False, "pan": 0, "tilt": 90, "last": 0}

class Handler(SimpleHTTPRequestHandler):
    def _json(self, code=200):
        body=json.dumps(state).encode()
        self.send_response(code); self.send_header("Content-Type","application/json")
        self.send_header("Access-Control-Allow-Origin","*")
        self.send_header("Content-Length",str(len(body))); self.end_headers(); self.wfile.write(body)

    def do_GET(self):
        if urlparse(self.path).path == "/api/state":
            self._json(); return
        super().do_GET()

    def do_POST(self):
        p=urlparse(self.path).path
        if p == "/api/config":
            n=int(self.headers.get("Content-Length","0")); data=json.loads(self.rfile.read(n) or b"{}")
            state["nano"]=data.get("nano","").strip()
            self._json(); return
        if p == "/api/command":
            n=int(self.headers.get("Content-Length","0")); data=json.loads(self.rfile.read(n) or b"{}")
            state.update({k:v for k,v in data.items() if k in ("enabled","pan","tilt")})
            state["last"]=time.time()
            nano=state["nano"]
            if nano:
                try:
                    req=urllib.request.Request("http://"+nano+"/api/command",
                        data=json.dumps(data).encode(),
                        headers={"Content-Type":"application/json"}, method="POST")
                    urllib.request.urlopen(req, timeout=0.7).read()
                except Exception:
                    pass
            self._json(); return
        self.send_error(404)

if __name__=="__main__":
    print(f"NEXUS server: http://0.0.0.0:{PORT}")
    ThreadingHTTPServer(("0.0.0.0",PORT),Handler).serve_forever()
