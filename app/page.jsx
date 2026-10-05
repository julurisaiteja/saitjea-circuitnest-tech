'use client';
import Link from 'next/link';
import { brand, products } from '../lib/brand';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick((x) => x + 1), 2800);
    return () => clearInterval(t);
  }, []);
  const live = typeof brand.stats[0].value === 'number' ? brand.stats[0].value + (tick % 7) : brand.stats[0].value;
  const bundle = products.find((p) => p.id === 'bundle');

  return (
    <>
      <section className="hud-hero">
        <video autoPlay muted loop playsInline poster={brand.poster}>
          <source src={brand.video} type="video/mp4" />
        </video>
        <div className="hud-frame" aria-hidden="true" />
        <div className="hud-scan" aria-hidden="true" />
        <div className="hud-copy">
          <p className="hud-mono hud-blink">SYS // STOREFRONT ONLINE</p>
          <p className="hud-brand mt-3 reveal-scan">{brand.name}</p>
          <h1 className="mt-4 text-xl md:text-2xl text-white/85 reveal-scan delay-1">{brand.tagline}</h1>
          <p className="mt-3 text-muted max-w-lg reveal-scan delay-2">{brand.description}</p>
          <div className="mt-8 flex flex-wrap gap-3 reveal-scan delay-3">
            <Link href="/special" className="btn-brand">Compare gear</Link>
            <Link href="/shop" className="btn-ghost">Catalog</Link>
          </div>
        </div>
      </section>

      <section className="px-4 py-10 max-w-6xl mx-auto">
        <p className="hud-mono mb-4">Telemetry</p>
        <div className="grid gap-3 md:grid-cols-3">
          {brand.stats.map((s, i) => (
            <div key={s.label} className="card-soft p-5 cn-tele">
              <p className="hud-mono">{String(i + 1).padStart(2, '0')}</p>
              <p className="hud-brand" style={{ fontSize: '2.4rem' }}>{i === 0 ? live : s.value}</p>
              <p className="hud-mono mt-2">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 py-6 max-w-6xl mx-auto">
        <p className="hud-mono mb-4">Spec index</p>
        <table className="hud-table">
          <thead>
            <tr><th>Unit</th><th>Profile</th><th>Price</th><th>Link</th></tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td className="text-muted">{p.blurb}</td>
                <td style={{ color: 'var(--accent)' }}>${p.price}</td>
                <td><Link href={`/product/${p.id}`} style={{ color: 'var(--brand)' }}>VIEW</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section id="bundles" className="cn-bundle-band">
        <p className="hud-mono">{brand.nav[3]} // SIGNAL</p>
        {bundle && (
          <div className="cn-bundle-card">
            <div>
              <h2 className="hud-brand" style={{ fontSize: 'clamp(2rem,5vw,3.2rem)' }}>{bundle.name}</h2>
              <p className="text-muted mt-2">{bundle.blurb}</p>
              <p className="hud-mono mt-3">{brand.offer.code} · {brand.offer.detail}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/special" className="btn-brand">Open matrix</Link>
                <Link href={`/product/${bundle.id}`} className="btn-ghost">Inspect SKU</Link>
              </div>
            </div>
            <img src={bundle.img} alt={bundle.name} className="cn-bundle-img" />
          </div>
        )}
      </section>

      <section className="cn-modules">
        <p className="hud-mono mb-4">Module rails</p>
        <div className="cn-module-grid">
          {['Laptops', 'Audio', 'Wearables', 'Accessories'].map((m) => (
            <Link key={m} href={`/shop?cat=${encodeURIComponent(m)}`} className="card-soft p-5 cn-module">
              <p className="hud-mono">LOAD</p>
              <p className="hud-brand mt-2" style={{ fontSize: '1.6rem' }}>{m}</p>
            </Link>
          ))}
        </div>
      </section>

      <section id="reviews" className="px-4 py-14 max-w-6xl mx-auto grid gap-4 md:grid-cols-2">
        {brand.reviews.map((r) => (
          <blockquote key={r.name} className="card-soft p-5">
            <p className="hud-mono">{r.name}</p>
            <p className="mt-3">&ldquo;{r.text}&rdquo;</p>
          </blockquote>
        ))}
      </section>
    </>
  );
}
