import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './App.css';

// Fix default marker icon issue with Leaflet + Vite
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

interface Meeting {
  id: number;
  date: string;
  place: string;
  keywords: string;
  organizer: string;
  lat: number;
  lng: number;
}

function App() {
  const [viewMode, setViewMode] = useState<'table' | 'map'>('table');
  const [showTaraModal, setShowTaraModal] = useState(false);
  
  const [meetings] = useState<Meeting[]>([
    { 
      id: 1, 
      date: '15.04.2026', 
      place: 'Tallinn, Vabaduse väljak', 
      keywords: 'keskkond, kliimakriis', 
      organizer: 'MTÜ Roheline Tulevik',
      lat: 59.4339, 
      lng: 24.7281 
    },
    { 
      id: 2, 
      date: '22.04.2026', 
      place: 'Tartu, Raekoja plats', 
      keywords: 'haridus, noored', 
      organizer: 'Eesti Õpilasesinduste Liit',
      lat: 58.3806, 
      lng: 26.7226 
    },
    { 
      id: 3, 
      date: '28.04.2026', 
      place: 'Pärnu, Rannapark', 
      keywords: 'kultuur, muusika', 
      organizer: 'Pärnu Kultuuri SA',
      lat: 58.3850, 
      lng: 24.4978 
    },
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#004277] text-white">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded"></div>
            <div>
              <h1 className="text-xl font-bold">Politsei- ja Piirivalveamet</h1>
              <p className="text-sm text-blue-200">Avalikust koosolekust teavitamise iseteenindus</p>
            </div>
          </div>
          <nav>
            <button 
              onClick={() => setShowTaraModal(true)}
              className="bg-[#FFB81C] text-[#004277] px-6 py-2 rounded font-bold hover:bg-[#FFC940] transition"
            >
              Sisene iseteenindusse
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
            <h3 className="text-lg font-bold mb-2 text-[#004277]">Mis on avalik koosolek?</h3>
            <p className="text-gray-600 text-sm">
              Avalik koosolek on avalikus kohas toimuv üritus, kus käsitletakse ühiskondlikult olulisi küsimusi. 
              Koosolek peab olema avatud kõigile soovijatele.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">⚠️</span>
            </div>
            <h3 className="text-lg font-bold mb-2 text-[#004277]">Teavitamise kohustus</h3>
            <p className="text-gray-600 text-sm">
              Avaliku koosoleku korraldaja peab politseile teatama vähemalt 5 päeva enne koosoleku toimumist. 
              Teade esitatakse elektrooniliselt käesolevas süsteemis.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">✅</span>
            </div>
            <h3 className="text-lg font-bold mb-2 text-[#004277]">Korraldaja kohustused</h3>
            <p className="text-gray-600 text-sm">
              Korraldaja vastutab koosoleku rahumeelse läbiviimise eest, peab tagama avaliku korra 
              ja järgima politsei juhiseid turvalisuse tagamiseks.
            </p>
          </div>
        </section>

        {/* Meetings Section */}
        <section className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#004277]">Registreeritud avalikud koosolekud</h2>
            
            {/* View Toggle */}
            <div className="inline-flex bg-gray-200 rounded-lg p-1">
              <button
                onClick={() => setViewMode('table')}
                className={`px-4 py-2 rounded-md font-semibold transition ${
                  viewMode === 'table'
                    ? 'bg-[#004277] text-white'
                    : 'text-gray-700 hover:bg-gray-300'
                }`}
              >
                Tabelina
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`px-4 py-2 rounded-md font-semibold transition ${
                  viewMode === 'map'
                    ? 'bg-[#004277] text-white'
                    : 'text-gray-700 hover:bg-gray-300'
                }`}
              >
                Kaardil
              </button>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <input
              type="text"
              placeholder="Kuupäev alates..."
              className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#004277]"
            />
            <input
              type="text"
              placeholder="Kuupäev kuni..."
              className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#004277]"
            />
            <input
              type="text"
              placeholder="Koht..."
              className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#004277]"
            />
            <button className="bg-[#004277] text-white px-6 py-2 rounded font-semibold hover:bg-[#00335c] transition">
              Otsi
            </button>
          </div>

          {/* Table View */}
          {viewMode === 'table' && (
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
                        <button className="text-[#004277] hover:text-[#00335c] font-medium">
                          Vaata detaile →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Map View */}
          {viewMode === 'map' && (
            <div className="h-[600px] rounded-lg overflow-hidden border border-gray-300">
              <MapContainer 
                center={[58.5953, 25.0136]} 
                zoom={7} 
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {meetings.map((meeting) => (
                  <Marker key={meeting.id} position={[meeting.lat, meeting.lng]}>
                    <Popup>
                      <div className="p-2">
                        <h3 className="font-bold text-[#004277] mb-1">{meeting.place}</h3>
                        <p className="text-sm text-gray-600 mb-1">
                          <strong>Kuupäev:</strong> {meeting.date}
                        </p>
                        <p className="text-sm text-gray-600 mb-1">
                          <strong>Märksõnad:</strong> {meeting.keywords}
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Korraldaja:</strong> {meeting.organizer}
                        </p>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#004277] text-white mt-12 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-blue-200">
            © 2026 Politsei- ja Piirivalveamet | Avalikust koosolekust teavitamise iseteenindus
          </p>
          <p className="text-xs text-blue-300 mt-2">
            Kontakt: info@politsei.ee | Tel: 612 3000
          </p>
        </div>
      </footer>

      {/* TARA Modal */}
      {showTaraModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-[#004277]">Autentimine</h2>
              <button 
                onClick={() => setShowTaraModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>
            
            <p className="text-gray-600 mb-6">
              Iseteenindusesse sisenemine nõuab autentimist läbi TARA teenuse.
            </p>

            <div className="space-y-3">
              <button className="w-full bg-[#004277] text-white py-3 rounded-lg font-semibold hover:bg-[#00335c] transition flex items-center justify-center">
                <span className="mr-2">🇪🇪</span>
                ID-kaart
              </button>
              <button className="w-full bg-[#004277] text-white py-3 rounded-lg font-semibold hover:bg-[#00335c] transition flex items-center justify-center">
                <span className="mr-2">📱</span>
                Mobiil-ID
              </button>
              <button className="w-full bg-[#004277] text-white py-3 rounded-lg font-semibold hover:bg-[#00335c] transition flex items-center justify-center">
                <span className="mr-2">🔐</span>
                Smart-ID
              </button>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">
                TARA autentimisteenus on riiklik tugiteenus, mis võimaldab turvalist sisselogimist.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
