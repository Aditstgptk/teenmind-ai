# TeenMind AI — Aplikasi Skrining Risiko Depresi Remaja

Aplikasi web statis (*client-side*) untuk menghitung estimasi probabilitas risiko depresi remaja berdasarkan 12 indikator gaya hidup dan kesehatan mental dari `Teen_Mental_Health_Dataset.csv` (n = 1.200).

## Struktur File
- `index.html` — Antarmuka pengguna (HTML + Tailwind CSS CDN)
- `app.js` — Logika inferensi *Logistic Regression* (Z-score scaler + One-Hot Encoding + Sigmoid)
- `README.md` — Dokumentasi proyek & panduan deploy

## Cara Deploy (Gratis & Tanpa Backend)
1. **GitHub Pages:** Unggah seluruh isi folder ini ke repositori GitHub, lalu aktifkan **Settings → Pages → Branch: main**.
2. **Vercel / Netlify / Cloudflare Pages:** *Drag & drop* folder `teenmind-deploy` atau hubungkan repositori GitHub Anda (tidak memerlukan *build command*).
