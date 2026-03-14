import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import fs from "fs";
import path from "path";

export default function Connect({ query }) {
  const router = useRouter();
  const { key, lid } = query || {};
  const [loggedIn, setLoggedIn] = useState(false);
  const [jid, setJid] = useState(lid);

  useEffect(() => {
    if (!key || !lid) return;

    const DB_FOLDER = path.resolve("./logindb");
    const files = fs.existsSync(DB_FOLDER) ? fs.readdirSync(DB_FOLDER) : [];
    let found = false;
    for (const file of files) {
      const data = JSON.parse(fs.readFileSync(path.join(DB_FOLDER, file)));
      if (data.includes(key)) {
        found = true;
        break;
      }
    }
    if (found) setLoggedIn(true);
  }, [key, lid]);

  const maskedKey = key ? `${key.slice(0,2)}*****${key.slice(7)}` : "";

  const goDash = () => router.push("/dash");

  return (
    <div style={{ background: "black", height: "100vh", color: "white", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      {loggedIn && (
        <>
          <div style={{ position: "absolute", top: 10, left: 10 }}>
            <p>key : {maskedKey}</p>
            <p>jid : {jid}</p>
          </div>
          <button onClick={goDash} style={{ background: "white", color: "black", padding: "10px 20px", fontSize: "24px", border: "none", cursor: "pointer" }}>
            Continue
          </button>
        </>
      )}
      {!loggedIn && <p>Key not valid or not logged in</p>}
    </div>
  );
}