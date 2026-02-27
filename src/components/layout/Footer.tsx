'use client';

import Link from 'next/link';
import { Heart, Twitter, Facebook, Linkedin, Instagram } from 'lucide-react';
import { useAppStore } from '@/stores/app-store';
import { getTranslations } from '@/i18n';

const footerLinks = {
  product: [
    { key: 'home', href: '/' },
    { key: 'tools', href: '/tools' },
    { key: 'help', href: '/help' },
  ],
  resources: [
    { key: 'faq', href: '/help' },
    { key: 'blog', href: '/blog' },
  ],
  company: [
    { key: 'about', href: '/about' },
    { key: 'contact', href: '/contact' },
  ],
  legal: [
    { key: 'privacy', href: '/legal/privacy' },
    { key: 'terms', href: '/legal/terms' },
    { key: 'cookies', href: '/legal/cookies' },
  ],
};

const socialLinks = [
  { name: 'Twitter', href: 'https://twitter.com/xeerfiles', icon: Twitter },
  { name: 'Facebook', href: 'https://facebook.com/xeerfiles', icon: Facebook },
  { name: 'LinkedIn', href: 'https://linkedin.com/company/xeerfiles', icon: Linkedin },
  { name: 'Instagram', href: 'https://instagram.com/xeerfiles', icon: Instagram },
];

export function Footer() {
  const { locale } = useAppStore();
  const t = getTranslations(locale);

  const getLinkLabel = (key: string) => {
    return t.footer[key as keyof typeof t.footer] || key;
  };

  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="page-container py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center shadow-lg shadow-primary/25">
                <span className="text-white font-bold text-xl">X</span>
              </div>
              <span className="text-xl font-bold">
                <span className="gradient-text">Xeer</span>
                <span className="text-foreground"> Files</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              Professional PDF tools for everyone. Fast, secure, and easy to use.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">
              {t.footer.product}
            </h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.key}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {getLinkLabel(link.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">
              {t.footer.resources}
            </h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.key}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {getLinkLabel(link.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">
              {t.footer.company}
            </h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.key}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {getLinkLabel(link.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">
              {t.footer.legal}
            </h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.key}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {getLinkLabel(link.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Xeer Files. {t.footer.copyright}
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            {t.footer.madeWith} <Heart className="w-4 h-4 text-red-500 fill-red-500" /> for productivity
          </p>
        </div>
      </div>
    </footer>
  );
}
