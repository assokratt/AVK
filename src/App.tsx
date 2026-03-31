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
  status: 'draft' | 'submitted' | 'approved' | 'completed';
  submittedDate?: string;
  lat: number;
  lng: number;
}

type ViewMode = 'public' | 'organizer';

function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('public');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showTaraModal, setShowTaraModal] = useState(false);
  const [showNewMeetingForm, setShowNewMeetingForm] = useState(false);
  const [mapView, setMapView] = useState<'table' | 'map'>('table');
  const [userMeetings, setUserMeetings] = useState<Meeting[]>([]);
  
  const [publicMeetings] = useState<Meeting[]>([
    {
      id: 1,
      startDateTime: '05.06.2026 17:45',
      endDateTime: '05.06.2026 18:00',
      location: 'Harju maakond, Tallinn, Kesklinna linnaosa, Tammsaare park A.H. Tammsaare monumendi ees',
      route: null,
      purpose: 'Juutide invasioonist, okupatsioonist ja genotsiidist Palestiinas, Liibanonis ning Süürias',
      organizer: 'Indrek Kabel, acb.acb@mail.com',
      status: 'approved',
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
      status: 'approved',
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
      status: 'submitted', // Example of a different status
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
      status: 'approved',
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
      status: 'submitted',
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
      status: 'approved',
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
      status: 'completed',
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
      status: 'approved',
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
      status: 'submitted',
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
      status: 'approved',
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
      status: 'approved',
      lat: 59.4275,
      lng: 24.7586
    },
  ]);

  // OrganizerDashboard: Status badges logic
  const getStatusBadgeClass = (status: Meeting['status']) => {
    switch (status) {
      case 'submitted':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // TARA Modal - mock data for demonstration
  const handleLogin = () => {
    setIsLoggedIn(true);
    setViewMode('organizer');
    setShowTaraModal(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setViewMode('public');
  };

  const handleAddMeeting = (meeting: Omit<Meeting, 'id' | 'status' | 'submittedDate'>) => {
    const newMeeting: Meeting = {
      ...meeting,
      id: Date.now(),
      status: 'submitted',
      submittedDate: new Date().toLocaleDateString('et-EE')
    };
    setUserMeetings([...userMeetings, newMeeting]);
    setShowNewMeetingForm(false);
  };

  // Render different views based on mode
  if (viewMode === 'organizer' && isLoggedIn) {
    return <OrganizerDashboard 
      meetings={userMeetings} 
      onLogout={handleLogout}
      onNewMeeting={() => setShowNewMeetingForm(true)}
      showForm={showNewMeetingForm}
      onCloseForm={() => setShowNewMeetingForm(false)}
      onSubmitMeeting={handleAddMeeting}
    />;
  }

  // Public view (original)
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

        {/* Meetings Section - Continued in next message due to length */}
        <MeetingsSection meetings={publicMeetings} mapView={mapView} setMapView={setMapView} />
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
        <TaraModal onClose={() => setShowTaraModal(false)} onLogin={handleLogin} />
      )}
    </div>
  );
}

// Component: OrganizerDashboard
interface OrganizerDashboardProps {
  meetings: Meeting[];
  onLogout: () => void;
  onNewMeeting: () => void;
  showForm: boolean;
  onCloseForm: () => void;
  onSubmitMeeting: (meeting: Omit<Meeting, 'id' | 'status' | 'submittedDate'>) => void;
}

function OrganizerDashboard({ meetings, onLogout, onNewMeeting, showForm, onCloseForm, onSubmitMeeting }: OrganizerDashboardProps) {
  if (showForm) {
    return <NewMeetingForm onClose={onCloseForm} onSubmit={onSubmitMeeting} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Korraldaja töölaud</h1>
            <p className="text-sm text-gray-600">Mari Maasikas</p>
          </div>
          <button 
            onClick={onLogout}
            className="text-sm text-gray-600 hover:text-gray-800 underline"
          >
            Logi välja
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Minu teated</h2>
            <p className="text-sm text-gray-600">Ülevaade esitatud koosolekute teadetest</p>
          </div>
          <button 
            onClick={onNewMeeting}
            className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition flex items-center"
          >
            <span className="mr-2">+</span> Uus teade
          </button>
        </div>

        {/* Meetings List */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-lg font-bold mb-2">Esitatud teated</h3>
          <p className="text-sm text-gray-600 mb-6">Kõik teie esitatud avalike koosolekute teated</p>

          {meetings.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📅</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Teateid pole esitatud</h3>
              <p className="text-gray-600 mb-6">Alustage uue avaliku koosoleku teate esitamist</p>
              <button 
                onClick={onNewMeeting}
                className="bg-black text-white px-6 py-2 rounded font-medium hover:bg-gray-800 transition"
              >
                + Esita esimene teade
              </button>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Kuupäev</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Asukoht</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Eesmärk</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Osalejaid</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Staatus</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Esitatud</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {meetings.map((meeting) => (
                  <tr key={meeting.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3 text-sm">
                      {meeting.startDateTime.split(' ')[0]}
                      <div className="text-xs text-gray-500">{meeting.startDateTime.split(' ')[1]} - {meeting.endDateTime.split(' ')[1]}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{meeting.location.split(',').slice(-2).join(',')}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 max-w-xs truncate">{meeting.purpose}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">11</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        meeting.status === 'submitted' ? 'bg-yellow-100 text-yellow-800' :
                        meeting.status === 'approved' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {meeting.status === 'submitted' ? 'Menetluses' : 
                         meeting.status === 'approved' ? 'Teatavaks võetud' : 'Lõppenud'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{meeting.submittedDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Stats - Only show if there are meetings */}
        {/* Removed as per request */}
      </main>
    </div>
  );
}

// Component: NewMeetingForm
interface NewMeetingFormProps {
  onClose: () => void;
  onSubmit: (meeting: Omit<Meeting, 'id' | 'status' | 'submittedDate'>) => void;
}

function NewMeetingForm({ onClose, onSubmit }: NewMeetingFormProps) {
  const [formData, setFormData] = useState({
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    county: '',
    city: '',
    district: '',
    street: '',
    houseNumber: '',
    route: '',
    purpose: '',
    participantCount: '',
    organizerName: '',
    organizerPhone: '',
    organizerEmail: '',
    lat: 59.437,
    lng: 24.7536
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const meeting: Omit<Meeting, 'id' | 'status' | 'submittedDate'> = {
      startDateTime: `${formData.startDate} ${formData.startTime}`,
      endDateTime: `${formData.endDate} ${formData.endTime}`,
      location: `${formData.county}, ${formData.city}, ${formData.district}, ${formData.street} ${formData.houseNumber}`.trim(),
      route: formData.route || null,
      purpose: formData.purpose,
      organizer: `${formData.organizerName}, tel. ${formData.organizerPhone}, e-post: ${formData.organizerEmail}`,
      lat: formData.lat,
      lng: formData.lng
    };
    
    onSubmit(meeting);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Uus avaliku koosoleku teade</h1>
            <p className="text-sm text-gray-600">Täitke kõik kohustuslikud väljad</p>
          </div>
          <button 
            onClick={onClose}
            className="text-sm text-gray-600 hover:text-gray-800"
          >
            ✕ Sulge
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-[#004277] mb-6">TEADE AVALIKU KOOSOLEKU KORRALDAMISEST</h2>
          
          {/* Section 1: Time and Location */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-800 mb-4">1. Aeg ja koht</h3>
            
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alguskuupäev *
                </label>
                <input
                  type="date"
                  required
                  value={formData.startDate}
                  onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004277]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Algusaeg *
                </label>
                <input
                  type="time"
                  required
                  value={formData.startTime}
                  onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004277]"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lõppkuupäev *
                </label>
                <input
                  type="date"
                  required
                  value={formData.endDate}
                  onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004277]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lõppaeg *
                </label>
                <input
                  type="time"
                  required
                  value={formData.endTime}
                  onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004277]"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maakond *
                </label>
                <input
                  type="text"
                  required
                  placeholder="nt Harju maakond"
                  value={formData.county}
                  onChange={(e) => setFormData({...formData, county: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004277]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Linn/vald *
                </label>
                <input
                  type="text"
                  required
                  placeholder="nt Tallinn"
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004277]"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Linnaosa *
                </label>
                <input
                  type="text"
                  required
                  placeholder="nt Kesklinna linnaosa"
                  value={formData.district}
                  onChange={(e) => setFormData({...formData, district: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004277]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tänav *
                </label>
                <input
                  type="text"
                  required
                  placeholder="nt Vabaduse väljak"
                  value={formData.street}
                  onChange={(e) => setFormData({...formData, street: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004277]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maja nr
                </label>
                <input
                  type="text"
                  placeholder="nt 1"
                  value={formData.houseNumber}
                  onChange={(e) => setFormData({...formData, houseNumber: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004277]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Marsruut (kui on)
              </label>
              <textarea
                placeholder="Kirjeldage marsruuti, kui tegemist on rongkäiguga"
                value={formData.route}
                onChange={(e) => setFormData({...formData, route: e.target.value})}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004277]"
              />
            </div>
          </div>

          {/* Section 2: Purpose */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-800 mb-4">2. Koosoleku eesmärk</h3>
            <textarea
              required
              placeholder="Kirjeldage koosoleku eesmärki ja teemat..."
              value={formData.purpose}
              onChange={(e) => setFormData({...formData, purpose: e.target.value})}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004277]"
            />
          </div>

          {/* Section 3: Participants */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-800 mb-4">3. Osalejate arv (ligikaudne)</h3>
            <input
              type="number"
              required
              placeholder="nt 100"
              value={formData.participantCount}
              onChange={(e) => setFormData({...formData, participantCount: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004277]"
            />
          </div>

          {/* Section 4: Organizer */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-800 mb-4">4. Korraldaja andmed</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nimi *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Eesnimi Perekonnanimi"
                  value={formData.organizerName}
                  onChange={(e) => setFormData({...formData, organizerName: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004277]"
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefon *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="5xxxxxxx"
                    value={formData.organizerPhone}
                    onChange={(e) => setFormData({...formData, organizerPhone: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004277]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    E-post *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="nimi@email.ee"
                    value={formData.organizerEmail}
                    onChange={(e) => setFormData({...formData, organizerEmail: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004277]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition"
            >
              Tühista
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#004277] text-white rounded-lg font-medium hover:bg-[#00335c] transition"
            >
              Esita teade politseile
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

// Component: MeetingsSection
interface MeetingsSectionProps {
  meetings: Meeting[];
  mapView: 'table' | 'map';
  setMapView: (view: 'table' | 'map') => void;
}

function MeetingsSection({ meetings, mapView, setMapView }: MeetingsSectionProps) {
  return (
    <section className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#004277]">Registreeritud avalikud koosolekud</h2>
        
        {/* View Toggle */}
        <div className="inline-flex bg-gray-200 rounded-lg p-1">
          <button
            onClick={() => setMapView('table')}
            className={`px-4 py-2 rounded-md font-semibold transition ${
              mapView === 'table'
                ? 'bg-[#004277] text-white'
                : 'text-gray-700 hover:bg-gray-300'
            }`}
          >
            Tabelina
          </button>
          <button
            onClick={() => setMapView('map')}
            className={`px-4 py-2 rounded-md font-semibold transition ${
              mapView === 'map'
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
      {mapView === 'table' && (
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
      {mapView === 'map' && (
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
  );
}

// Component: TaraModal
interface TaraModalProps {
  onClose: () => void;
  onLogin: () => void;
}

function TaraModal({ onClose, onLogin }: TaraModalProps) {
  return (
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
            <strong className="text-blue-900">Demo režiim:</strong> Prototüübis sisestage oma andmed käsitsi. 
            Avaliku koosoleku korraldamist tuleb Korraldusseaduse § 74 kohaselt teatada politseile 5 töopäeva ette.
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
              defaultValue="Mari Maasikas"
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
              defaultValue="39001010000"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          <button 
            onClick={onLogin}
            className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition"
          >
            Logi sisse korraldajana
          </button>
          <button 
            onClick={onClose}
            className="w-full bg-white text-gray-700 py-3 rounded-lg font-medium border border-gray-300 hover:bg-gray-50 transition"
          >
            Tühista
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
