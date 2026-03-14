import { useState } from "react";
import fs from "fs";
import path from "path";

export default function Home() {
  const [key, setKey] = useState("");

  const generateKey = () => {
    const newKey = Array.from({ length: 10 }, () => Math.floor(Math.random() * 10)).join("");
    setKey(newKey);

    // Simpan ke DB session, per file max 500
    const DB_FOLDER = path.resolve("./logindb");
    if (!fs.existsSync(DB_FOLDER)) fs.mkdirSync(DB_FOLDER, { recursive: true });

    const files = fs.readdirSync(DB_FOLDER).filter(f => f.endsWith(".json"));
    let targetFile = files[0] || "1.json";
    if (files.length) {
      // load last file
      const lastFile = files[files.length - 1];
      const data = JSON.parse(fs.readFileSync(path.join(DB_FOLDER, lastFile)));
      if (data.length >= 500) {
        const idx = files.length + 1;
        targetFile = `${idx}.json`;
        fs.writeFileSync(path.join(DB_FOLDER, targetFile), JSON.stringify([newKey]));
        return;
      }
      data.push(newKey);
      fs.writeFileSync(path.join(DB_FOLDER, lastFile), JSON.stringify(data));
    } else {
      fs.writeFileSync(path.join(DB_FOLDER, targetFile), JSON.stringify([newKey]));
    }
  };

  const copyKey = () => {
    navigator.clipboard.writeText(key);
    alert("Key copied!");
  };

  return (
    <div style={{ background: "black", height: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "white" }}>
      <button
        style={{ background: "white", color: "black", padding: "10px 20px", fontSize: "24px", border: "none", cursor: "pointer" }}
        onClick={() => { generateKey(); copyKey(); }}
      >
        {key || "Generate Key"}
      </button>
      <p style={{ marginTop: "20px" }}>ketik ini di tripwabot</p>
    </div>
  );
}