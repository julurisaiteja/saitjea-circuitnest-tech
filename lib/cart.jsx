'use client';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { STORAGE_KEY, WISH_KEY } from './brand';
const CartCtx = createContext(null);
export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [wish, setWish] = useState([]);
  const [ready, setReady] = useState(false);
  useEffect(() => { try { setItems(JSON.parse(localStorage.getItem(STORAGE_KEY)||'[]')); setWish(JSON.parse(localStorage.getItem(WISH_KEY)||'[]')); } catch{} setReady(true); }, []);
  useEffect(() => { if (ready) localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); }, [items, ready]);
  useEffect(() => { if (ready) localStorage.setItem(WISH_KEY, JSON.stringify(wish)); }, [wish, ready]);
  const api = useMemo(() => ({
    items, wish, ready,
    count: items.reduce((n,i)=>n+(i.qty||1),0),
    subtotal: items.reduce((n,i)=>n+i.price*(i.qty||1),0),
    add(item){ setItems(prev=>{ const key=item.lineKey||item.id; const idx=prev.findIndex(p=>(p.lineKey||p.id)===key); if(idx>=0){ const next=[...prev]; next[idx]={...next[idx], qty:(next[idx].qty||1)+(item.qty||1)}; return next;} return [...prev,{...item,qty:item.qty||1,lineKey:key}]; }); },
    setQty(lineKey, qty){ setItems(prev=>prev.map(i=>(i.lineKey||i.id)===lineKey?{...i,qty}:i).filter(i=>i.qty>0)); },
    remove(lineKey){ setItems(prev=>prev.filter(i=>(i.lineKey||i.id)!==lineKey)); },
    clear(){ setItems([]); },
    toggleWish(id){ setWish(prev=>prev.includes(id)?prev.filter(x=>x!==id):[...prev,id]); },
  }), [items, wish, ready]);
  return <CartCtx.Provider value={api}>{children}</CartCtx.Provider>;
}
export function useCart(){ const c=useContext(CartCtx); if(!c) throw new Error('useCart'); return c; }
