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
  startDateTime: string;
  endDateTime: string;
  location: string;
  route: string | null;
  purpose: string;
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
      startDateTime: '05.06.2026 17:45',
      endDateTime: '05.06.2026 18:00',
      location: 'Harju maakond, Tallinn, Kesklinna linnaosa, Tammsaare park A.H. Tammsaare monumendi ees',
      route: null,
      purpose: 'Juutide invasioonist, okupatsioonist ja genotsiidist Palestiinas, Liibanonis ning Süürias',
      organizer: 'Indrek Kabel, acb.acb@mail.com',
      lat: 59.4275,
      lng: 24.7586
    },
    {
      id: 2,
      startDateTime: '29.05.2026 17:45',
      endDateTime: '29.05.2026 18:00',
      location: 'Harju maakond, Tallinn, Kesklinna linnaosa, Tammsaare park A.H. Tammsaare monumendi ees',
      route: null,
      purpose: 'Juutide invasioonist, okupatsioonist ja genotsiidist Palestiinas, Liibanonis ning Süürias',
      organizer: 'Indrek Kabel, acb.acb@mail.com',
      lat: 59.4275,
      lng: 24.7586
    },
    {
      id: 3,
      startDateTime: '27.05.2026 16:00',
      endDateTime: '27.05.2026 17:00',
      location: 'Harju maakond, Tallinn, Kesklinna linnaosa, Pikk tn 19',
      route: null,
      purpose: 'Pikett – „Meeleavaldus sõja vastu"',
      organizer: 'Tarmo Kruusimäe, tel. 5219885',
      lat: 59.4412,
      lng: 24.7453
    },
    {
      id: 4,
      startDateTime: '22.05.2026 17:45',
      endDateTime: '22.05.2026 18:00',
      location: 'Harju maakond, Tallinn, Kesklinna linnaosa, Tammsaare park A.H. Tammsaare monumendi ees',
      route: null,
      purpose: 'Juutide invasioonist, okupatsioonist ja genotsiidist Palestiinas, Liibanonis ning Süürias',
      organizer: 'Indrek Kabel, acb.acb@mail.com',
      lat: 59.4275,
      lng: 24.7586
    },
    {
      id: 5,
      startDateTime: '20.05.2026 16:00',
      endDateTime: '20.05.2026 17:00',
      location: 'Harju maakond, Tallinn, Kesklinna linnaosa, Pikk tn 19',
      route: null,
      purpose: 'Pikett – „Meeleavaldus sõja vastu"',
      organizer: 'Tarmo Kruusimäe, tel. 5219885',
      lat: 59.4412,
      lng: 24.7453
    },
    {
      id: 6,
      startDateTime: '17.05.2026 11:00',
      endDateTime: '17.05.2026 11:30',
      location: 'Harju maakond, Tallinn, Kesklinna linnaosa, Liivalaia tn 38',
      route: 'Ristikäik ümber kiriku aia, liigutakse kõnniteedel',
      purpose: 'Aprilli-ja maikuu Ülestõusmispüha ristirongkäigud, kümme rongkäiku',
      organizer: 'Tallinna Jumalaema Sündimise (Kaasani) Kogudus, Vladimir Jaanimägi, tel. 55668601',
      lat: 59.4295,
      lng: 24.7502
    },
    {
      id: 7,
      startDateTime: '16.05.2026 11:45',
      endDateTime: '16.05.2026 16:00',
      location: 'Ida-Viru maakond, Jõhvi vald, Jõhvi linn, Pargi tn T2',
      route: null,
      purpose: 'Kohalike elanikega suhtlemine, nende murede ja õnnede jagamine ning erakonna maailmavaate tutvustamine',
      organizer: 'Sotsiaaldemokraatlik Erakond, Mark Gerassimenko, tel. 53587765, e-post: mark.gerassimenko@gmail.com',
      lat: 59.3592,
      lng: 27.4211
    },
    {
      id: 8,
      startDateTime: '15.05.2026 17:45',
      endDateTime: '15.05.2026 18:00',
      location: 'Harju maakond, Tallinn, Kesklinna linnaosa, Tammsaare park A.H. Tammsaare monumendi ees',
      route: null,
      purpose: 'Juutide invasioonist, okupatsioonist ja genotsiidist Palestiinas, Liibanonis ning Süürias',
      organizer: 'Indrek Kabel, acb.acb@mail.com',
      lat: 59.4275,
      lng: 24.7586
    },
    {
      id: 9,
      startDateTime: '13.05.2026 16:00',
      endDateTime: '13.05.2026 17:00',
      location: 'Harju maakond, Tallinn, Kesklinna linnaosa, Pikk tn 19',
      route: null,
      purpose: 'Pikett – „Meeleavaldus sõja vastu"',
      organizer: 'Tarmo Kruusimäe, tel. 5219885',
      lat: 59.4412,
      lng: 24.7453
    },
    {
      id: 10,
      startDateTime: '10.05.2026 11:00',
      endDateTime: '10.05.2026 11:30',
      location: 'Harju maakond, Tallinn, Kesklinna linnaosa, Liivalaia tn 38',
      route: 'Ristikäik ümber kiriku aia, liigutakse kõnniteedel',
      purpose: 'Aprilli-ja maikuu Ülestõusmispüha ristirongkäigud, kümme rongkäiku',
      organizer: 'Tallinna Jumalaema Sündimise (Kaasani) Kogudus, Vladimir Jaanimägi, tel. 55668601',
      lat: 59.4295,
      lng: 24.7502
    },
    {
      id: 11,
      startDateTime: '08.05.2026 17:45',
      endDateTime: '08.05.2026 18:00',
      location: 'Harju maakond, Tallinn, Kesklinna linnaosa, Tammsaare park A.H. Tammsaare monumendi ees',
      route: null,
      purpose: 'Juutide invasioonist, okupatsioonist ja genotsiidist Palestiinas, Liibanonis ning Süürias',
      organizer: 'Indrek Kabel, acb.acb@mail.com',
      lat: 59.4275,
      lng: 24.7586
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
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Algus</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Lõpp</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Koht / Marsruut</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Eesmärk</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Korraldaja</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {meetings.map((meeting) => (
                    <tr key={meeting.id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">{meeting.startDateTime}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">{meeting.endDateTime}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {meeting.location}
                        {meeting.route && (
                          <div className="text-gray-500 italic mt-1">
                            Marsruut: {meeting.route}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 max-w-md">{meeting.purpose}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{meeting.organizer}</td>
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
                      <div className="p-2 min-w-[300px]">
                        <h3 className="font-bold text-[#004277] mb-2 text-sm">Avalik koosolek</h3>
                        <p className="text-xs text-gray-900 mb-1">
                          <strong>Algus:</strong> {meeting.startDateTime}
                        </p>
                        <p className="text-xs text-gray-900 mb-1">
                          <strong>Lõpp:</strong> {meeting.endDateTime}
                        </p>
                        <p className="text-xs text-gray-600 mb-1">
                          <strong>Koht:</strong> {meeting.location}
                        </p>
                        {meeting.route && (
                          <p className="text-xs text-gray-500 italic mb-1">
                            <strong>Marsruut:</strong> {meeting.route}
                          </p>
                        )}
                        <p className="text-xs text-gray-600 mb-1">
                          <strong>Eesmärk:</strong> {meeting.purpose}
                        </p>
                        <p className="text-xs text-gray-600">
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
