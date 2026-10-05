'use client';
import { useState } from 'react';
import Link from 'next/link';
import { brand, products } from '../../lib/brand';
import { useCart } from '../../lib/cart';
export default function SpecialPage(){
  const laptops=products.filter(p=>p.cat==='Laptops'||p.cat==='Audio'||p.cat==='Tablets');
  const [pick,setPick]=useState(['ultrabook','probook']);
  const { add }=useCart();
  function toggle(id){ setPick(p=>p.includes(id)?p.filter(x=>x!==id):(p.length>=3?p: [...p,id])); }
  const cols=pick.map(id=>products.find(p=>p.id===id)).filter(Boolean);
  const bundle=products.find(p=>p.id==='bundle');
  return (
    <div className="cn-special">
      <header className="cn-special-hero">
        <p className="hud-mono">{brand.nav[2]} // MATRIX</p>
        <h1 className="font-display">Compare & bundles</h1>
        <p className="text-muted mt-2">Spec matrix · up to 3 devices · Creator Bundle.</p>
      </header>
      <div className="mt-6 flex flex-wrap gap-2">{laptops.map(p=><button key={p.id} onClick={()=>toggle(p.id)} className="chip" style={{outline:pick.includes(p.id)?'2px solid var(--brand)':undefined}}>{p.name}</button>)}</div>
      <div className="mt-8 overflow-x-auto card-soft">
        <table className="w-full text-sm">
          <thead><tr><th className="p-3 text-left">Spec</th>{cols.map(c=><th key={c.id} className="p-3 text-left">{c.name}</th>)}</tr></thead>
          <tbody>
            <tr style={{borderTop:'1px solid color-mix(in srgb, var(--muted) 25%, transparent)'}}><td className="p-3 text-muted">Price</td>{cols.map(c=><td key={c.id} className="p-3">${c.price}</td>)}</tr>
            {['cpu','ram','storage','weight','battery','anc','display'].map(key=>(
              <tr key={key} style={{borderTop:'1px solid color-mix(in srgb, var(--muted) 15%, transparent)'}}>
                <td className="p-3 text-muted uppercase text-xs">{key}</td>
                {cols.map(c=><td key={c.id} className="p-3">{(c.specs&&c.specs[key])||'—'}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {bundle&&(
        <div className="mt-10 card-soft p-6 flex flex-col md:flex-row gap-6 items-center">
          <img src={bundle.img} alt="" className="h-40 w-full md:w-64 object-cover" />
          <div className="flex-1"><h2 className="font-display text-2xl">{bundle.name}</h2><p className="text-muted mt-1">{bundle.blurb}</p><p className="mt-2 font-semibold">${bundle.price} <span className="text-sm text-muted">save {bundle.specs?.save}</span></p>
            <button className="btn-brand mt-4" onClick={()=>add({id:bundle.id,name:bundle.name,price:bundle.price,img:bundle.img,qty:1,lineKey:bundle.id,meta:'Creator Bundle'})}>Add bundle</button>
            <Link href="/shop" className="btn-ghost mt-4 ml-2">Browse all</Link>
          </div>
        </div>
      )}
    </div>
  );
}
