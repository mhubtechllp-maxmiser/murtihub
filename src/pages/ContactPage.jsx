import React, { useState, useEffect } from 'react';
import { Mail } from 'lucide-react';
import { cmsService } from '../services/cmsService';
import ContactForm from '../components/contact/ContactForm';
import './ContactPage.scss';

export default function ContactPage() {
  const [brand, setBrand] = useState(cmsService.getBrand());

  useEffect(() => {
    const unsub = cmsService.subscribe('brand', setBrand);
    return unsub;
  }, []);

  return (
    <div className="contact-page-root">
      {/* Header Banner */}
      <section className="page-header-banner">
        <div className="container">
          <span className="banner-eyebrow">Initiate Technical Engagement</span>
          <h1 className="banner-title text-display">
            Let's Build What&#10;Comes Next.
          </h1>
          <p className="banner-desc lead-paragraph">
            Have an idea, system or digital challenge? Let's engineer the next step. Direct partner
            consultation with senior systems architects.
          </p>
        </div>
      </section>

      {/* Main Engagement Grid */}
      <section className="section section-light contact-main-section">
        <div className="container">
          <div className="contact-layout-grid">
            {/* Left Technical Meta Column */}
            <div className="contact-meta-column">
              <div className="meta-card">
                <span className="meta-card-tag">Direct Inquiries</span>
                <h3 className="meta-title">Executive Communication</h3>
                <p className="meta-desc">
                  Every inquiry is reviewed directly by a designated partner and senior systems
                  architect. We do not filter conversations through generic sales funnels.
                </p>

                <div className="meta-info-item">
                  <Mail size={18} className="text-accent" />
                  <div>
                    <span className="info-key">Primary Dispatch Email</span>
                    <a href={`mailto:${brand.email || 'enquiry@murtihub.co.in'}`} className="info-val info-link">
                      {brand.email || 'enquiry@murtihub.co.in'}
                    </a>
                  </div>
                </div>


              </div>
            </div>

            {/* Right Contact Form Column */}
            <div className="contact-form-column">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
