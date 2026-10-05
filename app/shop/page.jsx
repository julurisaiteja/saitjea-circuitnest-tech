'use client';
import Link from 'next/link';
import { useMemo, useState, useEffect } from 'react';
import { brand, products } from '../../lib/brand';
import { useCart } from '../../lib/cart';

export default function ShopPage() {
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('All');
  const [sort, setSort] = useState('featured');
  const { toggleWish, wish } = useCart();
  const cats = ['All', ...Array.from(new Set(products.map((p) => p.cat)))];

  useEffect(() => {
    const c = new URLSearchParams(window.location.search).get('cat');
    if (c && cats.includes(c)) setCat(c);
  }, []);

  const list = useMemo(() => {
    let out = products.filter((p) => {
      const hay = (p.name + ' ' + p.blurb + ' ' + (p.tags || []).join(' ') + ' ' + JSON.stringify(p.specs || {})).toLowerCase();
      return (cat === 'All' || p.cat === cat) && hay.includes(q.toLowerCase());
    });
    if (sort === 'price-asc') out = [...out].sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') out = [...out].sort((a, b) => b.price - a.price);
    if (sort === 'rating') out = [...out].sort((a, b) => b.rating - a.rating);
    return out;
  }, [q, cat, sort]);

  return (
    <div className="cn-shop">
      <header className="cn-shop-hero">
        <p className="hud-mono">CATALOG // TELEMETRY TABLE</p>
        <h1 className="hud-brand cn-shop-title">{brand.nav[0]} / {brand.nav[1]}</h1>
        <p className="text-muted mt-2">Search SKUs, filter modules, sort by price or rating — wishlist persists locally.</p>
        <div className="cn-shop-controls">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="QUERY // name, tag, spec…"
            className="cn-input"
            aria-label="Search catalog"
          />
          <select value={cat} onChange={(e) => setCat(e.target.value)} className="cn-input" aria-label="Filter category">
            {cats.map((c) => <option key={c}>{c}</option>)}
          </select>
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="cn-input" aria-label="Sort">
            <option value="featured">Featured</option>
            <option value="price-asc">Price ↑</option>
            <option value="price-desc">Price ↓</option>
            <option value="rating">Top rated</option>
          </select>
        </div>
        <div className="cn-mod-tabs">
          {cats.map((c) => (
            <button key={c} type="button" className={`cn-mod-tab ${cat === c ? 'is-on' : ''}`} onClick={() => setCat(c)}>
              {c}
            </button>
          ))}
        </div>
      </header>

      <div className="cn-table-wrap">
        <table className="hud-table cn-shop-table">
          <thead>
            <tr>
              <th>Unit</th>
              <th>Module</th>
              <th>Profile</th>
              <th>Price</th>
              <th>Score</th>
              <th>Wish</th>
              <th>Link</th>
            </tr>
          </thead>
          <tbody>
            {list.map((p) => (
              <tr key={p.id}>
                <td>
                  <div className="cn-unit">
                    <img src={p.img} alt="" />
                    <span>{p.name}</span>
                  </div>
                </td>
                <td className="hud-mono">{p.cat}</td>
                <td className="text-muted cn-blurb">{p.blurb}</td>
                <td style={{ color: 'var(--accent)' }}>${p.price}</td>
                <td>★ {p.rating}</td>
                <td>
                  <button type="button" className="cn-wish" onClick={() => toggleWish(p.id)} aria-label="Wishlist">
                    {wish.includes(p.id) ? '♥' : '♡'}
                  </button>
                </td>
                <td><Link href={`/product/${p.id}`} style={{ color: 'var(--brand)' }}>VIEW</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
        {!list.length && <p className="cn-empty">NO MATCHES // adjust query filters</p>}
      </div>

      <div className="cn-mobile-cards">
        {list.map((p) => (
          <article key={p.id} className="card-soft overflow-hidden">
            <Link href={`/product/${p.id}`} className="block aspect-[4/3] overflow-hidden">
              <img src={p.img} alt={p.name} className="h-full w-full object-cover" />
            </Link>
            <div className="p-4">
              <div className="flex justify-between gap-2">
                <Link href={`/product/${p.id}`} className="font-semibold">{p.name}</Link>
                <button type="button" onClick={() => toggleWish(p.id)} aria-label="Wishlist">{wish.includes(p.id) ? '♥' : '♡'}</button>
              </div>
              <p className="hud-mono mt-2">{p.cat}</p>
              <p className="text-sm text-muted mt-1">{p.blurb}</p>
              <div className="mt-3 flex justify-between"><span style={{ color: 'var(--accent)' }}>${p.price}</span><span className="text-xs text-muted">★ {p.rating}</span></div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
