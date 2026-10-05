'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { brand } from '../lib/brand';
import { useCart } from '../lib/cart';
import AIAssistant from './AIAssistant';

const links = [
  { href: '/shop', label: brand.nav[0] },
  { href: '/shop?cat=Audio', label: brand.nav[1] },
  { href: '/special', label: brand.nav[2] },
  { href: '/#bundles', label: brand.nav[3] },
];

export default function Shell({ children }) {
  const { count } = useCart();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <div data-diamond="batch-1" className="cn-shell">
      <a href="#main" className="skip-link">Skip to telemetry</a>
      <div className="offer-banner cn-banner">SYS // {brand.offer.code} · {brand.offer.label}</div>
      <header className="cn-header">
        <div className="cn-header-inner">
          <Link href="/" className="cn-logo">
            <span className="cn-logo-brackets" aria-hidden="true">[</span>
            <span className="font-display cn-logo-text">{brand.name}</span>
            <span className="cn-logo-brackets" aria-hidden="true">]</span>
          </Link>
          <nav className="cn-nav" aria-label="Primary">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="cn-nav-link">{l.label}</Link>
            ))}
            <Link href="/cart" className="btn-brand cn-cart">CART{count > 0 ? `/${count}` : ''}</Link>
          </nav>
          <div className="cn-mobile">
            <Link href="/cart" className="btn-brand !py-2 !px-3 text-sm">CART {count || ''}</Link>
            <button type="button" className="cn-burger" aria-expanded={open} aria-controls="cn-drawer" onClick={() => setOpen((v) => !v)}>
              <span /><span /><span />
              <span className="sr-only">Menu</span>
            </button>
          </div>
        </div>
        <div id="cn-drawer" className="cn-drawer" hidden={!open}>
          <p className="hud-mono mb-3">NAV // MODULES</p>
          <nav aria-label="Mobile">
            {links.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)}>{l.label}</Link>
            ))}
            <Link href="/cart" onClick={() => setOpen(false)}>CART{count > 0 ? ` · ${count}` : ''}</Link>
          </nav>
        </div>
      </header>
      <main id="main">{children}</main>
      <footer className="cn-footer">
        <div className="cn-footer-grid">
          <div>
            <p className="hud-mono">NODE // STOREFRONT</p>
            <p className="font-display cn-footer-brand mt-2">{brand.name}</p>
            <p className="text-muted mt-2 max-w-md">{brand.description}</p>
          </div>
          <div>
            <p className="hud-mono mb-2">Links</p>
            <ul>
              {links.map((l) => <li key={l.href}><Link href={l.href}>{l.label}</Link></li>)}
            </ul>
          </div>
          <div>
            <p className="hud-mono mb-2">Integrity</p>
            <ul>
              <li>Secure checkout UI (demo)</li>
              <li>Wishlist · compare matrix</li>
              <li>{brand.aiName}</li>
            </ul>
          </div>
          <div>
            <p className="hud-mono mb-2">Uplink</p>
            <form className="cn-mail" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="email@signal.net" aria-label="Email uplink" />
              <button type="submit" className="btn-brand !py-2">SYNC</button>
            </form>
          </div>
        </div>
        <p className="cn-legal">Demo storefront · no real payments · {brand.name}</p>
      </footer>
      <div className="sticky-cta md:hidden">
        <Link href="/special" className="btn-brand !py-2 !px-4 text-sm">{brand.nav[2]}</Link>
        <Link href="/shop" className="btn-ghost !py-2 !px-4 text-sm">Catalog</Link>
      </div>
      <AIAssistant />
    </div>
  );
}
