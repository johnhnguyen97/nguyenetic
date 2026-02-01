import { Header } from "@/components/layout/Header"
import { Hero } from "@/components/sections/Hero"
import { Work } from "@/components/sections/Work"
import { Services } from "@/components/sections/Services"

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Work />
        <Services />

        {/* About Section */}
        <section id="about" className="py-32 px-6 bg-card/50">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <p className="text-sm tracking-[0.3em] text-accent-gold mb-4 font-mono">
                  私について
                </p>
                <h2 className="text-[clamp(1.75rem,4vw,3rem)] font-bold mb-6">
                  Building at the intersection of technology and design
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    I help businesses establish and grow their digital presence through
                    thoughtful design and modern technology. From custom web applications
                    to comprehensive marketing strategies, I deliver solutions that drive results.
                  </p>
                  <p>
                    With expertise spanning full-stack development, SEO optimization,
                    and digital marketing, I provide end-to-end services that take your
                    business from concept to success.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 rounded-2xl border border-border bg-background">
                  <div className="text-3xl font-bold text-accent-cyber mb-2">50+</div>
                  <div className="text-sm text-muted-foreground">Projects Delivered</div>
                </div>
                <div className="p-6 rounded-2xl border border-border bg-background">
                  <div className="text-3xl font-bold text-accent-sakura mb-2">100%</div>
                  <div className="text-sm text-muted-foreground">Client Satisfaction</div>
                </div>
                <div className="p-6 rounded-2xl border border-border bg-background">
                  <div className="text-3xl font-bold text-accent-gold mb-2">5+</div>
                  <div className="text-sm text-muted-foreground">Years Experience</div>
                </div>
                <div className="p-6 rounded-2xl border border-border bg-background">
                  <div className="text-3xl font-bold text-foreground mb-2">24/7</div>
                  <div className="text-sm text-muted-foreground">Support Available</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-32 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-sm tracking-[0.3em] text-accent-cyber mb-4 font-mono">
              お問い合わせ
            </p>
            <h2 className="text-[clamp(1.75rem,4vw,3rem)] font-bold mb-6">
              Let&apos;s Build Something Together
            </h2>
            <p className="text-muted-foreground text-lg mb-10 max-w-2xl mx-auto">
              Ready to elevate your digital presence? Whether you need a new website,
              want to improve your SEO, or launch a marketing campaign — I&apos;m here to help.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="mailto:hello@nguyenetic.com"
                className="inline-flex items-center gap-2 px-8 py-4 bg-foreground text-background rounded-full font-medium hover:scale-105 transition-transform"
              >
                Start a Project
              </a>
              <a
                href="https://calendly.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 border border-border rounded-full font-medium hover:border-accent-cyber hover:text-accent-cyber transition-colors"
              >
                Schedule a Call
              </a>
            </div>

            <div className="mt-16 pt-16 border-t border-border">
              <p className="text-sm text-muted-foreground mb-4">Or reach out directly</p>
              <a
                href="mailto:hello@nguyenetic.com"
                className="text-xl font-medium hover:text-accent-cyber transition-colors"
              >
                hello@nguyenetic.com
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Nguyenetic. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground font-mono">
            技術と美学の融合
          </p>
        </div>
      </footer>
    </>
  )
}
