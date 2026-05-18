import { getMessages } from '@/lib/i18n';
import NavBar from '@/components/NavBar';
import SiteFooter from '@/app/sections/SiteFooter';
import ContactForm from './ContactForm';

export default async function ContactsPage() {
  const { contacts, common, home } = await getMessages();

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFAF7]">
      <NavBar t={common.nav} />

      <main className="flex-1">
        {/* Hero */}
        <section className="py-16 bg-white border-b border-[#E8DDD4]">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <span className="text-xs uppercase tracking-widest text-[#C4704F] mb-3 block">{contacts.badge}</span>
            <h1 className="text-3xl md:text-4xl font-light text-[#1A1410] mb-4">{contacts.title}</h1>
            <p className="text-[#6B5B4E]">{contacts.subtitle}</p>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Info */}
            <div className="space-y-4">
              <div className="bg-white border border-[#E8DDD4] p-5 flex gap-4">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C4704F" strokeWidth="1.5" className="flex-shrink-0 mt-0.5">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 014.72 13.5a19.79 19.79 0 01-3.07-8.67A2 2 0 013.63 2.84h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l.79-.79a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                </svg>
                <div>
                  <p className="text-xs uppercase tracking-widest text-[#9C8A7E] mb-1">{contacts.infoCards[2].title}</p>
                  <a href={`tel:${contacts.phone.replace(/\s/g, '')}`} className="text-[#1A1410] hover:text-[#C4704F] transition-colors font-medium">
                    {contacts.phone}
                  </a>
                </div>
              </div>

              <div className="bg-white border border-[#E8DDD4] p-5 flex gap-4">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C4704F" strokeWidth="1.5" className="flex-shrink-0 mt-0.5">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <div>
                  <p className="text-xs uppercase tracking-widest text-[#9C8A7E] mb-1">{contacts.infoCards[1].title}</p>
                  <a href={`mailto:${contacts.email}`} className="text-[#1A1410] hover:text-[#C4704F] transition-colors font-medium">
                    {contacts.email}
                  </a>
                  <p className="text-xs text-[#9C8A7E] mt-1">{contacts.infoCards[1].desc}</p>
                </div>
              </div>

              <div className="bg-white border border-[#E8DDD4] p-5 flex gap-4">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C4704F" strokeWidth="1.5" className="flex-shrink-0 mt-0.5">
                  <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                </svg>
                <div>
                  <p className="text-xs uppercase tracking-widest text-[#9C8A7E] mb-1">{contacts.infoCards[0].title}</p>
                  <p className="text-[#1A1410] font-medium">{contacts.hours}</p>
                </div>
              </div>

              <div className="bg-white border border-[#E8DDD4] p-5 flex gap-4">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C4704F" strokeWidth="1.5" className="flex-shrink-0 mt-0.5">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
                </svg>
                <div>
                  <p className="text-xs uppercase tracking-widest text-[#9C8A7E] mb-1">Address</p>
                  <p className="text-[#1A1410] text-sm leading-relaxed">{contacts.address}</p>
                </div>
              </div>
            </div>

            {/* Form */}
            <ContactForm t={contacts.form} />
          </div>
        </div>
      </main>

      <SiteFooter t={home.footer} />
    </div>
  );
}
