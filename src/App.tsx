import { useState } from 'react';
import './App.css';

interface Meeting {
  id: number;
  date: string;
  place: string;
  keywords: string;
  organizer: string;
}

function App() {
  const [meetings] = useState<Meeting[]>([
    { id: 1, date: '15.04.2026', place: 'Tallinn, Vabaduse väljak', keywords: 'keskkond, kliimakriis', organizer: 'MTÜ Roheline Tulevik' },
    { id: 2, date: '22.04.2026', place: 'Tartu, Raekoja plats', keywords: 'haridus, noored', organizer: 'Eesti Õpilasesinduste Liit' },
    { id: 3, date: '28.04.2026', place: 'Pärnu, Rannapark', keywords: 'kultuur, muusika', organizer: 'Pärnu Kultuuri SA' },
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-900 text-white">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-white rounded"></div>
            <div>
              <h1 className="text-xl font-bold">Politsei- ja Piirivalveamet</h1>
              <p className="text-sm text-blue-200">Avalikud koosolekud</p>
            </div>
          </div>
          <nav className="space-x-4">
            <button className="bg-white text-blue-900 px-4 py-2 rounded font-semibold hover:bg-blue-50 transition">
              Logi sisse korraldajana
            </button>
            <button className="border border-white text-white px-4 py-2 rounded font-semibold hover:bg-blue-800 transition">
              Logi sisse ametnikuna
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Info Cards */}
        <section className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">📋</span>
            </div>
            <h3 className="text-lg font-bold mb-2 text-blue-900">Mis on avalik koosolek?</h3>
            <p className="text-gray-600 text-sm">
              Avalik koosolek on avalikus kohas toimuv üritus, kus käsitletakse ühiskondlikult olulisi küsimusi. 
              Koosolek peab olema avatud kõigile soovijatele.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">⚠️</span>
            </div>
            <h3 className="text-lg font-bold mb-2 text-blue-900">Teavitamise kohustus</h3>
            <p className="text-gray-600 text-sm">
              Avaliku koosoleku korraldaja peab politseile teatama vähemalt 5 päeva enne koosoleku toimumist. 
              Teade esitatakse elektrooniliselt käesolevas süsteemis.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">✅</span>
            </div>
            <h3 className="text-lg font-bold mb-2 text-blue-900">Korraldaja kohustused</h3>
            <p className="text-gray-600 text-sm">
              Korraldaja vastutab koosoleku rahumeelse läbiviimise eest, peab tagama avaliku korra 
              ja järgima politsei juhiseid turvalisuse tagamiseks.
            </p>
          </div>
        </section>

        {/* Meetings Table */}
        <section className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-blue-900">Registreeritud avalikud koosolekud</h2>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
              + Teata koosolekust
            </button>
          </div>

          {/* Filter Bar */}
          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <input
              type="text"
              placeholder="Kuupäev alates..."
              className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Kuupäev kuni..."
              className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Koht..."
              className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="bg-blue-900 text-white px-6 py-2 rounded font-semibold hover:bg-blue-800 transition">
              Otsi
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Kuupäev</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Koht</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Märksõnad</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Korraldaja</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Tegevused</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {meetings.map((meeting) => (
                  <tr key={meeting.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-4 text-sm text-gray-900">{meeting.date}</td>
                    <td className="px-4 py-4 text-sm text-gray-900">{meeting.place}</td>
                    <td className="px-4 py-4 text-sm text-gray-600">{meeting.keywords}</td>
                    <td className="px-4 py-4 text-sm text-gray-900">{meeting.organizer}</td>
                    <td className="px-4 py-4 text-sm">
                      <button className="text-blue-600 hover:text-blue-800 font-medium">
                        Vaata detaile →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-blue-900 text-white mt-12 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-blue-200">
            © 2026 Politsei- ja Piirivalveamet | Avalike koosolekute registreerimise süsteem
          </p>
          <p className="text-xs text-blue-300 mt-2">
            Kontakt: info@politsei.ee | Tel: 612 3000
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
