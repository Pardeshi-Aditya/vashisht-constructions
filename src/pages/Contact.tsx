import { useState, type FormEvent } from "react";
import { Phone, Mail, MapPin, MessageCircle, Clock } from "lucide-react";
import { SEO } from "@/components/common/SEO";
import { Container } from "@/components/common/Container";
import { SectionTitle } from "@/components/common/SectionTitle";
import { Button } from "@/components/common/Button";
import { useContent } from "@/context/ContentContext";

export default function Contact() {
  const { content } = useContent();
  const company = content.company;
  const faq = content.faq;
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(
          formData as unknown as Record<string, string>,
        ).toString(),
      });
      setSubmitted(true);
      form.reset();
    } catch {
      form.submit();
    }
  };

  return (
    <>
      <SEO
        title="Contact"
        description={`Get in touch with ${company.name} to discuss your next residential or commercial project.`}
        path="/contact"
      />

      <section className="bg-off-white pt-28 pb-16 sm:pt-36 sm:pb-24">
        <Container>
          <SectionTitle
            eyebrow="Contact"
            title={["Let's", "Connect"]}
            description="We welcome enquiries for new projects, site visits, and consultations."
          />
        </Container>
      </section>

      <section className="pb-20 sm:pb-28">
        <Container>
          <div className="grid gap-16 lg:grid-cols-2 lg:gap-20">
            <div>
              <h2 className="text-[10px] font-medium tracking-[0.2em] text-warm-gray uppercase">
                Office
              </h2>

              <address className="mt-6 space-y-6 not-italic">
                <div className="flex gap-4">
                  <MapPin
                    size={18}
                    className="mt-0.5 shrink-0 text-accent"
                    strokeWidth={1.5}
                  />
                  <div>
                    <p className="text-sm text-charcoal">
                      {company.address.line1}
                    </p>
                    <p className="text-sm text-warm-gray">
                      {company.address.line2}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Phone
                    size={18}
                    className="mt-0.5 shrink-0 text-accent"
                    strokeWidth={1.5}
                  />
                  <a
                    href={`tel:${company.phone}`}
                    className="text-sm text-charcoal hover:text-accent"
                  >
                    {company.phoneDisplay}
                  </a>
                </div>

                <div className="flex gap-4">
                  <Mail
                    size={18}
                    className="mt-0.5 shrink-0 text-accent"
                    strokeWidth={1.5}
                  />
                  <a
                    href={`mailto:${company.email}`}
                    className="text-sm text-charcoal hover:text-accent"
                  >
                    {company.email}
                  </a>
                </div>

                <div className="flex gap-4">
                  <Clock
                    size={18}
                    className="mt-0.5 shrink-0 text-accent"
                    strokeWidth={1.5}
                  />
                  <p className="text-sm text-warm-gray">{company.hours}</p>
                </div>
              </address>

              <div className="mt-10">
                <Button
                  href={`https://wa.me/${company.whatsapp}`}
                  variant="primary"
                  className="inline-flex"
                >
                  <MessageCircle size={16} strokeWidth={1.5} />
                  WhatsApp Us
                </Button>
              </div>

              <div className="mt-12 aspect-video overflow-hidden bg-stone">
                <iframe
                  title={`${company.name} office location`}
                  src={`https://maps.google.com/maps?q=${company.coordinates.lat},${company.coordinates.lng}&z=15&output=embed`}
                  className="h-full w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
            </div>

            <div>
              <h2 className="text-[10px] font-medium tracking-[0.2em] text-warm-gray uppercase">
                Send a Message
              </h2>

              {submitted ? (
                <div className="mt-8 border border-accent/20 bg-accent/5 p-8">
                  <p className="text-lg font-medium text-charcoal">
                    Thank you for reaching out.
                  </p>
                  <p className="mt-2 text-sm text-warm-gray">
                    Our team will respond within one business day.
                  </p>
                </div>
              ) : (
                <form
                  name="contact"
                  method="POST"
                  data-netlify="true"
                  netlify-honeypot="bot-field"
                  onSubmit={handleSubmit}
                  className="mt-8 space-y-6"
                >
                  <input type="hidden" name="form-name" value="contact" />
                  <p className="hidden">
                    <label>
                      Don&apos;t fill this out: <input name="bot-field" />
                    </label>
                  </p>

                  <div>
                    <label
                      htmlFor="name"
                      className="block text-xs tracking-widest text-warm-gray uppercase"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      className="mt-2 w-full border border-stone bg-white px-4 py-3 text-sm text-charcoal transition-colors focus:border-accent focus:outline-none"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-xs tracking-widest text-warm-gray uppercase"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      className="mt-2 w-full border border-stone bg-white px-4 py-3 text-sm text-charcoal transition-colors focus:border-accent focus:outline-none"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-xs tracking-widest text-warm-gray uppercase"
                    >
                      Phone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      className="mt-2 w-full border border-stone bg-white px-4 py-3 text-sm text-charcoal transition-colors focus:border-accent focus:outline-none"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-xs tracking-widest text-warm-gray uppercase"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      required
                      className="mt-2 w-full resize-none border border-stone bg-white px-4 py-3 text-sm text-charcoal transition-colors focus:border-accent focus:outline-none"
                    />
                  </div>

                  <Button type="submit" variant="primary">
                    Send Message
                  </Button>
                </form>
              )}
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-white py-16 sm:py-24">
        <Container>
          <SectionTitle eyebrow="FAQ" title={["Common", "Questions"]} />

          <div className="mt-12 space-y-0">
            {faq.map((item) => (
              <details
                key={item.question}
                className="group border-t border-stone py-6"
              >
                <summary className="cursor-pointer list-none text-base font-medium text-charcoal transition-colors group-open:text-accent [&::-webkit-details-marker]:hidden">
                  {item.question}
                </summary>
                <p className="mt-4 text-sm leading-relaxed text-warm-gray">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
