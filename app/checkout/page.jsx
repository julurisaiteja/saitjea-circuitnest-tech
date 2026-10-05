'use client';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../../lib/cart';
import { brand } from '../../lib/brand';
export default function CheckoutPage(){
  const { items, subtotal, clear } = useCart();
  const [code,setCode]=useState(''); const [applied,setApplied]=useState(null);
  const [eta]=useState(()=>28+Math.floor(Math.random()*15));
  const router=useRouter();
  const discount=useMemo(()=>{
    if(!applied) return 0;
    const c=String(applied).toUpperCase();
    if(c.includes('20')||c==='FIRE20') return subtotal*0.2;
    if(c.includes('15')||c==='BLOOM15'||c==='PUP15'||c==='HAUS10') return subtotal*0.15;
    if(c.includes('10')) return subtotal*0.1;
    if(c.includes('25')||c==='FRESH25') return Math.min(25,subtotal);
    if(c.includes('50')||c==='MOUNT50') return Math.min(50,subtotal);
    if(c.includes('100')||c==='NEST100') return Math.min(100,subtotal);
    if(c==='JARFIRST'||c==='FIRSTBAG') return Math.min(20,subtotal*0.25);
    if(c==='BLOOMFREE') return Math.min(28,subtotal);
    return subtotal*0.12;
  },[applied,subtotal]);
  const total=Math.max(0,subtotal-discount)+(items.length?4.99:0);
  function apply(){ const c=code.trim().toUpperCase(); const ok=[brand.offer.code.toUpperCase(),'FIRE20','BLOOM15','JARFIRST','MOUNT50','HAUS10','FRESH25','FIRSTBAG','BLOOMFREE','PUP15','NEST100']; if(ok.includes(c)) setApplied(c===brand.offer.code.toUpperCase()?brand.offer.code:c); else alert('Try '+brand.offer.code); }
  function pay(e){ e.preventDefault(); if(!items.length) return; sessionStorage.setItem('sai-last-order', JSON.stringify({ id:'ORD-'+Math.random().toString(36).slice(2,8).toUpperCase(), total, items, brand:brand.name, eta })); clear(); router.push('/success'); }
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:px-6 grid gap-8 lg:grid-cols-5">
      <form onSubmit={pay} className="lg:col-span-3 space-y-4">
        <h1 className="font-display text-4xl">Checkout</h1>
        <p className="text-muted text-sm">Stripe-style demo UI — no real charges.</p>
        <div className="card-soft p-5 space-y-3">
          <p className="font-semibold">Contact & delivery</p>
          <input required placeholder="Full name" className="w-full rounded-xl px-3 py-2 bg-surface" style={{border:'1px solid color-mix(in srgb, var(--muted) 30%, transparent)'}} />
          <input required type="email" placeholder="Email" className="w-full rounded-xl px-3 py-2 bg-surface" style={{border:'1px solid color-mix(in srgb, var(--muted) 30%, transparent)'}} />
          <input required placeholder="Address" className="w-full rounded-xl px-3 py-2 bg-surface" style={{border:'1px solid color-mix(in srgb, var(--muted) 30%, transparent)'}} />
          <div className="grid grid-cols-2 gap-3">
            <input required placeholder="City" className="rounded-xl px-3 py-2 bg-surface" style={{border:'1px solid color-mix(in srgb, var(--muted) 30%, transparent)'}} />
            <input required placeholder="ZIP" className="rounded-xl px-3 py-2 bg-surface" style={{border:'1px solid color-mix(in srgb, var(--muted) 30%, transparent)'}} />
          </div>
          <p className="text-sm" style={{color:'var(--accent)'}}>Estimated arrival ~{eta} minutes after confirmation</p>
        </div>
        <div className="card-soft p-5 space-y-3">
          <p className="font-semibold">Payment</p>
          <input required placeholder="Card number" defaultValue="4242 4242 4242 4242" className="w-full rounded-xl px-3 py-2 bg-surface" style={{border:'1px solid color-mix(in srgb, var(--muted) 30%, transparent)'}} />
          <div className="grid grid-cols-2 gap-3">
            <input required placeholder="MM/YY" defaultValue="12/28" className="rounded-xl px-3 py-2 bg-surface" style={{border:'1px solid color-mix(in srgb, var(--muted) 30%, transparent)'}} />
            <input required placeholder="CVC" defaultValue="123" className="rounded-xl px-3 py-2 bg-surface" style={{border:'1px solid color-mix(in srgb, var(--muted) 30%, transparent)'}} />
          </div>
        </div>
        <button className="btn-brand w-full justify-center" disabled={!items.length}>Pay ${total.toFixed(2)}</button>
      </form>
      <aside className="lg:col-span-2">
        <div className="card-soft p-5 sticky top-24 space-y-3">
          <p className="font-semibold">Order summary</p>
          {items.map(i=><div key={i.lineKey||i.id} className="flex justify-between text-sm gap-2"><span>{i.qty}× {i.name}</span><span>${(i.price*i.qty).toFixed(2)}</span></div>)}
          <div className="flex gap-2 pt-2">
            <input value={code} onChange={e=>setCode(e.target.value)} placeholder="Promo code" className="flex-1 rounded-xl px-3 py-2 bg-surface text-sm" style={{border:'1px solid color-mix(in srgb, var(--muted) 30%, transparent)'}} />
            <button type="button" onClick={apply} className="btn-ghost !py-2 text-sm">Apply</button>
          </div>
          {applied&&<p className="text-xs" style={{color:'var(--success)'}}>Applied {applied} (−${discount.toFixed(2)})</p>}
          <div className="border-t pt-3 text-sm space-y-1" style={{borderColor:'color-mix(in srgb, var(--muted) 25%, transparent)'}}>
            <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Delivery</span><span>${items.length?'4.99':'0.00'}</span></div>
            <div className="flex justify-between font-semibold text-base"><span>Total</span><span>${total.toFixed(2)}</span></div>
          </div>
        </div>
      </aside>
    </div>
  );
}
