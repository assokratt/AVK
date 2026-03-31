# AVK v2 - Avalike Koosolekute Registreerimise Süsteem

Kaasaegne veebilehe prototüüp Politsei- ja Piirivalveameti avalike koosolekute registreerimiseks.

## 🚀 Funktsioonid

- ✨ Kaasaegne, puhta disainiga kasutajaliides
- 📋 Info-kaardid avalike koosolekute kohta
- 📊 Tabelvaade registreeritud koosolekutele
- 🔍 Otsingu- ja filtreerimisfunktsioonid
- 📱 Täielikult responsiivne (mobile-friendly)
- 🎨 Tailwind CSS styling

## 🛠️ Tehnoloogiad

- **React 19** + TypeScript
- **Vite** (kiire build tool)
- **Tailwind CSS** (utility-first CSS)
- **GitHub Pages** (deployment)

## 📦 Paigaldamine

```bash
# Klooni repo
git clone https://github.com/tiqbit/avk-v2.git
cd avk-v2

# Paigalda dependencies
npm install

# Käivita development server
npm run dev
```

Ava brauseris: `http://localhost:5173`

## 🌐 Deployment GitHub Pages'i

```bash
# Build ja deploy
npm run deploy
```

Leht on kättesaadav: `https://tiqbit.github.io/avk-v2/`

## 📁 Projekti struktuur

```
avk-v2-vite/
├── src/
│   ├── App.tsx           # Põhikomponent
│   ├── App.css           # Custom styles
│   ├── index.css         # Tailwind imports
│   └── main.tsx          # Entry point
├── public/               # Staatilised failid
├── dist/                 # Build output
└── package.json
```

## 🎨 Disain

Põhineb Figma disainil, sisaldab:
- Sinist värviskeemi (PPA brändiga kooskõlas)
- Grid-põhist paigutust
- Hover-efekte ja transitions
- Shadow'id ja rounded corners

## 🔧 Arendamine

```bash
# Development mode (hot reload)
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 📄 Litsents

MIT

## 👤 Autor

Teo (@tiqbit)

---

**Märkus:** See on prototüüp. Tootmiskasutuseks vaja lisada:
- Backend API integratsioon
- Autentimine (Tara)
- Andmebaasi ühendus
- Vormi validatsioon
- Error handling
