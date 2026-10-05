'use client';
import Link from 'next/link';
import { useCart } from '../../lib/cart';
import { brand } from '../../lib/brand';
export default function CartPage(){
  const { items, setQty, remove, subtotal } = useCart();
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:px-6">
      <h1 className="font-display text-4xl">Cart</h1>
      {!items.length&&<p className="mt-6 text-muted">Your cart is empty. <Link href="/shop" className="underline">Browse {brand.name}</Link></p>}
      <div className="mt-8 space-y-4">{items.map(i=>(
        <div key={i.lineKey||i.id} className="card-soft p-4 flex gap-4">
          <img src={i.img} alt="" className="h-20 w-20 rounded-xl object-cover" />
          <div className="flex-1">
            <div className="flex justify-between gap-2"><div><p className="font-semibold">{i.name}</p>{i.meta&&<p className="text-xs text-muted mt-1">{i.meta}</p>}</div><p className="font-semibold">${(i.price*i.qty).toFixed(2)}</p></div>
            <div className="mt-3 flex items-center gap-3">
              <button className="chip" onClick={()=>setQty(i.lineKey||i.id,i.qty-1)}>−</button><span>{i.qty}</span>
              <button className="chip" onClick={()=>setQty(i.lineKey||i.id,i.qty+1)}>+</button>
              <button className="text-sm text-muted ml-auto" onClick={()=>remove(i.lineKey||i.id)}>Remove</button>
            </div>
          </div>
        </div>))}</div>
      {items.length>0&&(
        <div className="mt-8 card-soft p-5">
          <div className="flex justify-between"><span>Subtotal</span><strong>${subtotal.toFixed(2)}</strong></div>
          <p className="text-xs text-muted mt-2">Promo codes apply on checkout · try {brand.offer.code}</p>
          <Link href="/checkout" className="btn-brand mt-4 w-full justify-center">Checkout</Link>
        </div>
      )}
    </div>
  );
}
