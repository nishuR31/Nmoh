import React from 'react';
import { Shield, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Privacy = () => {
  return (
    <div className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <ChevronRight size={14} />
          <span className="text-foreground">Privacy Policy</span>
        </nav>

        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 rounded-xl bg-primary/10">
              <Shield size={28} className="text-primary" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Privacy Policy</h1>
              <p className="text-muted-foreground mt-1">
                Last updated: January 2025
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="glass rounded-2xl p-6 md:p-8 space-y-8">
            <section>
              <h2 className="text-xl font-semibold mb-3">Overview</h2>
              <p className="text-muted-foreground leading-relaxed">
                This Product Hub is a personal project management tool. We respect 
                your privacy and are committed to protecting any personal information.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Data Collection</h2>
              <p className="text-muted-foreground leading-relaxed">
                This application primarily stores data locally in your browser. 
                Settings and preferences are saved using localStorage and remain 
                on your device.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Cookies</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may use minimal cookies for essential functionality. No tracking 
                or advertising cookies are used.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Third-Party Services</h2>
              <p className="text-muted-foreground leading-relaxed">
                This application may link to external product URLs. Each external 
                site has its own privacy policy and practices.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Contact</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have questions about this privacy policy, please reach out 
                through the contact information provided on the About page.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
