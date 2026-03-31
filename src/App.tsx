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
  regNumber: string;
  startDate: string;
  endDate: string;
  place: string;
  topic: string;
  organizer: string;
  participantCount: string;
  lat: number;
  lng: number;
}

function App() {
  const [viewMode, setViewMode] = useState<'table' | 'map'>('table');
  const [showTaraModal, setShowTaraModal] = useState(false);
  
  const [meetings] = useState<Meeting[]>([
    { 
      id: 1, 
      regNumber: '1-1/2026/234',
      startDate: '15.04.2026 14:00',
      endDate: '15.04.2026 18:00',
      place: 'Tallinn, Vabaduse väljak',
      topic: 'Kliimakriisi ja keskkonnakaitse teemaline avalik arutelu',
      organizer: 'MTÜ Roheline Tulevik',
      participantCount: 'kuni 500',
      lat: 59.4339, 
      lng: 24.7281 
    },
    { 
      id: 2, 
      regNumber: '1-1/2026/198',
      startDate: '22.04.2026 12:00',
      endDate: '22.04.2026 16:00',
      place: 'Tartu, Raekoja plats 1',
      topic: 'Haridusreformi avalik arutelu - õpilaste õigused ja kohustused',
      organizer: 'Eesti Õpilasesinduste Liit',
      participantCount: 'kuni 200',
      lat: 58.3806, 
      lng: 26.7226 
    },
    { 
      id: 3, 
      regNumber: '1-1/2026/212',
      startDate: '28.04.2026 16:00',
      endDate: '28.04.2026 20:00',
      place: 'Pärnu, Rannapark (lähedal laululava)',
      topic: 'Kultuuri- ja muusikafestivali avalik tutvustus',
      organizer: 'Pärnu Kultuuri Sihtasutus',
      participantCount: 'kuni 1000',
      lat: 58.3850, 
      lng: 24.4978 
    },
    { 
      id: 4, 
      regNumber: '1-1/2026/156',
      startDate: '05.04.2026 10:00',
      endDate: '05.04.2026 14:00',
      place: 'Tallinn, Toompea loss (Lossi plats 1a)',
      topic: 'Kodanikualgatus põhiseaduse muutmise kohta - avalik arutelu',
      organizer: 'MTÜ Avatud Eesti',
      participantCount: 'kuni 150',
      lat: 59.4368, 
      lng: 24.7378 
    },
    { 
      id: 5, 
      regNumber: '1-1/2026/267',
      startDate: '30.04.2026 18:00',
      endDate: '30.04.2026 21:00',
      place: 'Narva, Peetri plats 3',
      topic: 'Piiriäärsete omavalitsuste koostöö ja arengu avalik arutelu',
      organizer: 'Narva Linnavalitsus',
      participantCount: 'kuni 300',
      lat: 59.3777, 
      lng: 28.1903 
    },
    { 
      id: 6, 
      regNumber: '1-1/2026/189',
      startDate: '18.04.2026 13:00',
      endDate: '18.04.2026 17:00',
      place: 'Viljandi, Keskväljak (Vabaduse plats)',
      topic: 'Maapiirkondade areng ja toetused - avalik infopäev',
      organizer: 'Viljandi Maavalitsus',
      participantCount: 'kuni 100',
      lat: 58.3639, 
      lng: 25.5897 
    },
    { 
      id: 7, 
      regNumber: '1-1/2026/223',
      startDate: '25.04.2026 15:00',
      endDate: '25.04.2026 19:00',
      place: 'Jõhvi, Keskväljak (Rakvere tn 13a)',
      topic: 'Ida-Virumaa tööhõive ja majanduse avalik foorum',
      organizer: 'Ida-Viru Ettevõtluskeskus',
      participantCount: 'kuni 250',
      lat: 59.3592, 
      lng: 27.4211 
    },
    { 
      id: 8, 
      regNumber: '1-1/2026/245',
      startDate: '12.04.2026 11:00',
      endDate: '12.04.2026 15:00',
      place: 'Kuressaare, Keskväljak (Tallinna 2)',
      topic: 'Saarte elukvaliteet ja ühendused - avalik arutelu',
      organizer: 'Saarte Koostöö Selts',
      participantCount: 'kuni 120',
      lat: 58.2488, 
      lng: 22.4847 
    },
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#004277] text-white">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">Politsei- ja Piirivalveamet</h1>
            <p className="text-sm text-blue-200">Avalikust koosolekust teavitamise iseteenindus</p>
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
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-[#004277]">
            <h3 className="text-lg font-bold mb-2 text-[#004277]">Mis on avalik koosolek?</h3>
            <p className="text-gray-600 text-sm">
              Avalik koosolek on avalikus kohas toimuv üritus, kus käsitletakse ühiskondlikult olulisi küsimusi. 
              Koosolek peab olema avatud kõigile soovijatele.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-[#004277]">
            <h3 className="text-lg font-bold mb-2 text-[#004277]">Teavitamise kohustus</h3>
            <p className="text-gray-600 text-sm">
              Avaliku koosoleku korraldaja peab politseile teatama vähemalt 5 päeva enne koosoleku toimumist. 
              Teade esitatakse elektrooniliselt käesolevas süsteemis.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-[#004277]">
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
              type="date"
              placeholder="Alguskuupäev"
              className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#004277]"
            />
            <input
              type="date"
              placeholder="Lõppkuupäev"
              className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#004277]"
            />
            <input
              type="text"
              placeholder="Otsing..."
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
                <thead className="bg-gray-100 border-b-2 border-gray-300">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Reg. nr</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Algus</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Lõpp</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Koht</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Teema</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Korraldaja</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Osalejaid</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {meetings.map((meeting) => (
                    <tr key={meeting.id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3 text-sm text-[#004277] font-medium">{meeting.regNumber}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{meeting.startDate}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{meeting.endDate}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{meeting.place}</td>
                      <td className="px-4 py-3 text-sm text-gray-700 max-w-xs">{meeting.topic}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{meeting.organizer}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{meeting.participantCount}</td>
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
                      <div className="p-2 min-w-[250px]">
                        <p className="text-xs text-gray-500 mb-1">Reg. nr: {meeting.regNumber}</p>
                        <h3 className="font-bold text-[#004277] mb-2 text-sm">{meeting.topic}</h3>
                        <p className="text-xs text-gray-600 mb-1">
                          <strong>Algus:</strong> {meeting.startDate}
                        </p>
                        <p className="text-xs text-gray-600 mb-1">
                          <strong>Lõpp:</strong> {meeting.endDate}
                        </p>
                        <p className="text-xs text-gray-600 mb-1">
                          <strong>Koht:</strong> {meeting.place}
                        </p>
                        <p className="text-xs text-gray-600 mb-1">
                          <strong>Korraldaja:</strong> {meeting.organizer}
                        </p>
                        <p className="text-xs text-gray-600">
                          <strong>Osalejaid:</strong> {meeting.participantCount}
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
        <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-8">
            {/* Header */}
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Politsei- ja Piirivalveamet
              </h1>
              <p className="text-sm text-gray-600">
                Avalikust koosolekust teavitamise iseteenindus
              </p>
            </div>

            {/* Demo Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-700">
                <strong className="text-blue-900">Demo režiim:</strong> Toimivad kasutatakse käsitsi sisestatud andmeid 
                TARA-autentimise (ID-kaart, Mobiil-ID, Smart-ID). 
                Prototüübis sisestage oma andmed käsitsi. Avalikku koosolek 
                korraldamist tuleb Korraldusseaduse § 74 kohaselt teatada politseile 5 töopäeva ette.
              </p>
            </div>

            {/* Authentication Tabs */}
            <div className="flex border-b border-gray-200 mb-6">
              <button className="flex-1 py-3 px-4 text-sm font-medium border-b-2 border-black text-gray-900">
                <span className="mr-2">💳</span>
                ID-kaart
              </button>
              <button className="flex-1 py-3 px-4 text-sm font-medium text-gray-500 hover:text-gray-700">
                <span className="mr-2">📱</span>
                Mobiil-ID
              </button>
              <button className="flex-1 py-3 px-4 text-sm font-medium text-gray-500 hover:text-gray-700">
                <span className="mr-2">🔐</span>
                Smart-ID
              </button>
            </div>

            {/* Form */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nimi
                </label>
                <input
                  type="text"
                  placeholder="Mari Maasikas"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Isikukood
                </label>
                <input
                  type="text"
                  placeholder="39001010000"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="space-y-3">
              <button 
                onClick={() => setShowTaraModal(false)}
                className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition"
              >
                Logi sisse korraldajana
              </button>
              <button 
                onClick={() => setShowTaraModal(false)}
                className="w-full bg-white text-gray-700 py-3 rounded-lg font-medium border border-gray-300 hover:bg-gray-50 transition"
              >
                Logi sisse ametnikuna
              </button>
            </div>

            {/* Footer Link */}
            <div className="mt-6 text-center">
              <button 
                onClick={() => setShowTaraModal(false)}
                className="text-sm text-blue-600 hover:text-blue-800 underline"
              >
                Vaata avalduse nõudmuste kaarti
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
