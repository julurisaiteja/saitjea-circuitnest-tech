'use client';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { brand, getProduct, products } from '../../../lib/brand';
import { useCart } from '../../../lib/cart';

function useNicheState(product){
  const niche = "electronics";
  const v = brand.variants || {};
  const [warranty,setWarranty]=useState(v.warranties[0]);
  const [ram,setRam]=useState(v.ram[0]);
  const [storage,setStorage]=useState(v.storage[0]);
  const isLaptop=product?.cat==='Laptops';
  const specs=product?.specs||{};
  const price=(product?.price||0)+(warranty?.price||0)+(isLaptop&&ram==='32GB'?200:0)+(isLaptop&&storage==='1TB'?150:0)+(isLaptop&&storage==='2TB'?350:0);
  const meta=`${warranty.label}${isLaptop?` · ${ram} · ${storage}`:''}`;
  const lineKey=product?`${product.id}-${warranty.id}-${ram}-${storage}`:'';
  const ui = (<>
      <div className="grid grid-cols-2 gap-2">{Object.entries(specs).map(([k,val])=><div key={k} className="card-soft p-3"><p className="text-xs text-muted uppercase">{k}</p><p className="font-semibold text-sm">{val}</p></div>)}</div>
      {isLaptop&&(<><div><p className="text-sm font-semibold mb-2">RAM</p><div className="flex flex-wrap gap-2">{v.ram.map(s=><button key={s} onClick={()=>setRam(s)} className="chip" style={{outline:ram===s?'2px solid var(--brand)':undefined}}>{s}</button>)}</div></div>
      <div><p className="text-sm font-semibold mb-2">Storage</p><div className="flex flex-wrap gap-2">{v.storage.map(s=><button key={s} onClick={()=>setStorage(s)} className="chip" style={{outline:storage===s?'2px solid var(--brand)':undefined}}>{s}</button>)}</div></div></>)}
      <div><p className="text-sm font-semibold mb-2">Warranty</p><div className="flex flex-wrap gap-2">{v.warranties.map(s=><button key={s.id} onClick={()=>setWarranty(s)} className="chip" style={{outline:warranty.id===s.id?'2px solid var(--brand)':undefined}}>{s.label}{s.price?` +${s.price}`:''}</button>)}</div></div>
      <p className="text-sm text-muted">Trade-in estimate (demo): ${Math.round((product?.price||0)*0.18)}</p>
    </>);
  const details = (<ul className="text-sm text-muted space-y-1 list-disc pl-5"><li>Compare up to 3</li><li>Bundle savings</li><li>NestCare coverage</li></ul>);
  return { price, meta, lineKey, ui, details };
}

export default function ProductPage(){
  const { id } = useParams();
  const product = getProduct(id);
  const { add, toggleWish, wish } = useCart();
  const router = useRouter();
  const custom = useNicheState(product);
  if(!product) return <div className="mx-auto max-w-6xl px-4 py-20">Product not found. <Link href="/shop" className="underline">Back to shop</Link></div>;
  const more = products.filter(p=>p.id!==id && p.cat===product.cat).slice(0,3);
  const related = more.length ? more : products.filter(p=>p.id!==id).slice(0,3);
  const faq = [
    { q:'Shipping / delivery?', a:'Demo checkout shows ETA after address entry.' },
    { q:'Returns?', a:'Most items support 30-day exchanges in this demo narrative.' },
    { q:'Need help?', a:`Ask ${brand.aiName} (bottom-right) for niche guidance.` },
  ];
  function onAdd(){ add({ id:product.id, name:product.name, price:custom.price, img:product.img, qty:1, lineKey:custom.lineKey, meta:custom.meta }); router.push('/cart'); }
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <div className="card-soft overflow-hidden aspect-square"><img src={product.img} alt={product.name} className="h-full w-full object-cover" /></div>
          <div className="mt-3 grid grid-cols-3 gap-2">{[product.img, brand.poster, products[0].img].map((src,i)=>(
            <div key={i} className="aspect-video overflow-hidden rounded-xl opacity-90"><img src={src} alt="" className="h-full w-full object-cover" /></div>
          ))}</div>
        </div>
        <div>
          <p className="text-sm text-muted">{product.cat}</p>
          <h1 className="font-display text-4xl md:text-5xl mt-1">{product.name}</h1>
          <p className="mt-2 text-muted">{product.blurb}</p>
          <p className="mt-3 text-sm">★ {product.rating} · {product.reviews} reviews</p>
          <p className="mt-4 font-display text-3xl" style={{color:'var(--brand)'}}>${custom.price.toFixed(2)}</p>
          <div className="mt-3 flex flex-wrap gap-2">{(product.tags||[]).map(t=><span key={t} className="chip">{t}</span>)}</div>
          <div className="mt-6 space-y-5">{custom.ui}</div>
          <div className="mt-8 flex flex-wrap gap-3">
            <button className="btn-brand" onClick={onAdd}>Add to cart</button>
            <button className="btn-ghost" onClick={()=>toggleWish(product.id)}>{wish.includes(product.id)?'♥ Saved':'♡ Wishlist'}</button>
            <Link href="/special" className="btn-ghost">{brand.nav[1]}</Link>
          </div>
          <div className="mt-10 space-y-3"><h2 className="font-semibold text-lg">Details</h2>{custom.details}</div>
          <div className="mt-8 space-y-2"><h2 className="font-semibold text-lg">FAQ</h2>
            {faq.map(f=><details key={f.q} className="card-soft px-4 py-3"><summary className="cursor-pointer font-medium">{f.q}</summary><p className="mt-2 text-sm text-muted">{f.a}</p></details>)}
          </div>
        </div>
      </div>
      <section className="mt-16">
        <h2 className="font-display text-3xl">You may also like</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">{related.map(p=>(
          <Link key={p.id} href={`/product/${p.id}`} className="card-soft overflow-hidden">
            <img src={p.img} alt={p.name} className="aspect-video w-full object-cover" />
            <div className="p-3 flex justify-between"><span className="font-medium">{p.name}</span><span>${p.price}</span></div>
          </Link>))}</div>
      </section>
    </div>
  );
}
