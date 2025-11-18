import { Card } from '@/components/ui/card'
import { ContactCardBlock } from '@/payload-types'
import { PageContext } from '@/types/page-context'
import { Mail, Phone, MapPin } from 'lucide-react'

export function ContactCardBlockUI({
  pageContext,
  ...contactCardBlock
}: ContactCardBlock & { pageContext: PageContext }) {
  // Build full address string from structured data
  const fullAddressString = pageContext.setting.fullAddress
    ? [
        pageContext.setting.fullAddress.streetAddress,
        pageContext.setting.fullAddress.addressLocality,
        pageContext.setting.fullAddress.addressRegion,
        pageContext.setting.fullAddress.postalCode,
        pageContext.setting.fullAddress.addressCountry,
      ]
        .filter(Boolean)
        .join(', ')
    : ''

  // Get the appropriate address text based on addressType
  const displayAddress =
    pageContext.setting.addressType === 'partial'
      ? pageContext.setting.locationText || ''
      : fullAddressString

  // Build the map URL - use Place ID if available, otherwise fall back to query search
  const mapUrl = pageContext.setting.googleMapsId
    ? `https://www.google.com/maps?q=place_id:${pageContext.setting.googleMapsId}&output=embed`
    : `https://www.google.com/maps?q=${encodeURIComponent(displayAddress)}&output=embed`

  return (
    <Card className="w-full max-w-4xl overflow-hidden bg-card">
      <div className="grid md:grid-cols-2 gap-0">
        {/* Contact Information Section */}
        <div className="p-8 md:p-12 flex flex-col justify-center bg-accent/30">
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Get in Touch</h2>
              <p className="text-muted-foreground leading-relaxed">
                We'd love to hear from you. Reach out to us anytime.
              </p>
            </div>

            <div className="space-y-4 pt-4">
              {/* Email */}
              {pageContext.setting.emails && pageContext.setting.emails.length > 0 && (
                <div className="flex items-start gap-4 group">
                  <div className="mt-1 p-2 rounded-lg bg-primary/10 text-primary">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Email</h3>
                    <a
                      href={`mailto:${pageContext.setting.emails[0].email}`}
                      className="text-foreground hover:text-primary transition-colors"
                    >
                      {pageContext.setting.emails[0].email}
                    </a>
                  </div>
                </div>
              )}

              {/* Phone */}
              {pageContext.setting.phones && pageContext.setting.phones.length > 0 && (
                <div className="flex items-start gap-4 group">
                  <div className="mt-1 p-2 rounded-lg bg-primary/10 text-primary">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Phone</h3>
                    <a
                      href={`tel:${pageContext.setting.phones[0].number.replace(/\s/g, '')}`}
                      className="text-foreground hover:text-primary transition-colors"
                    >
                      {pageContext.setting.phones[0].number}
                    </a>
                  </div>
                </div>
              )}

              {displayAddress && (
                <div className="flex items-start gap-4 group">
                  <div className="mt-1 p-2 rounded-lg bg-primary/10 text-primary">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Address</h3>
                    <p className="text-foreground leading-relaxed">{displayAddress}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="relative h-[400px] md:h-auto min-h-[400px]">
          <iframe
            src={mapUrl}
            className="absolute inset-0 w-full h-full border-0"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Office Location Map"
          />
        </div>
      </div>
    </Card>
  )
}