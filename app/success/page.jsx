'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
export default function SuccessPage(){
  const [order,setOrder]=useState(null);
  useEffect(()=>{ try{ setOrder(JSON.parse(sessionStorage.getItem('sai-last-order')||'null')); }catch{} },[]);
  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center">
      <p className="chip mx-auto mb-4">Order confirmed</p>
      <h1 className="font-display text-4xl md:text-5xl">You&apos;re all set</h1>
      <p className="mt-3 text-muted">Demo purchase complete — no payment was processed.</p>
      {order&&(
        <div className="card-soft mt-8 p-6 text-left space-y-2">
          <p><span className="text-muted">Order</span> <strong>{order.id}</strong></p>
          <p><span className="text-muted">Total</span> <strong>${Number(order.total).toFixed(2)}</strong></p>
          {order.eta&&<p><span className="text-muted">ETA</span> <strong>~{order.eta} min</strong></p>}
          <ul className="text-sm text-muted pt-2 space-y-1">{(order.items||[]).map(i=><li key={i.lineKey||i.id}>{i.qty}× {i.name}</li>)}</ul>
        </div>
      )}
      <Link href="/shop" className="btn-brand mt-8">Continue shopping</Link>
    </div>
  );
}
