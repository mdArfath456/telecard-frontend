import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { cartApi } from "../api/client";
import Icon from "../components/Icon";
import { money } from "../utils/helpers";
export default function Cart() {
  const [cart, setCart] = useState(null);
  const [busy, setBusy] = useState(false);
  const nav = useNavigate();
  const load = async () => {
    const r = await cartApi.get();
    setCart(r.data);
  };
  useEffect(() => {
    let mounted = true;
    const fetchCart = async () => {
      try {
        const r = await cartApi.get();
        if (mounted) setCart(r.data);
      } catch (e) {
        if (mounted) setCart({ items: [], totalItems: 0, totalAmount: 0 });
      }
    };
    fetchCart();
    return () => {
      mounted = false;
    };
  }, []);
  const run = async (fn) => {
    setBusy(true);
    try {
      const r = await fn();
      setCart(r.data || cart);
    } finally {
      setBusy(false);
    }
  };
  if (!cart)
    return (
      <div className="screen-loader">
        <div className="spinner" />
      </div>
    );
  return (
    <div className="page-wrap">
      <div className="page-hero compact">
        <span className="eyebrow">Your selection</span>
        <h1>Shopping cart</h1>
        <p>
          {cart.totalItems || 0} item{cart.totalItems === 1 ? "" : "s"} ready
          for checkout.
        </p>
      </div>
      {!cart.items?.length ? (
        <div className="empty">
          <Icon name="cart" size={32} />
          <h3>Your cart is empty</h3>
          <p>Discover a card and add it to your collection.</p>
          <Link className="primary-btn" to="/cards">
            Browse cards
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-list">
            {cart.items.map((i) => (
              <div className="cart-item" key={i.cartItemId}>
                <img
                  src={i.imageUrl || "/placeholder-card.svg"}
                  onError={(e) =>
                    (e.currentTarget.src = "/placeholder-card.svg")
                  }
                />
                <div className="cart-main">
                  <span className="muted">
                    {i.cardNetwork} · {i.cardType}
                  </span>
                  <h3>{i.cardName}</h3>
                  <strong>{money(i.price)}</strong>
                  <div className="cart-actions">
                    <div className="qty">
                      <button
                        onClick={() =>
                          run(() => cartApi.decrease(i.cartItemId))
                        }
                      >
                        −
                      </button>
                      <b>{i.quantity}</b>
                      <button
                        onClick={() =>
                          run(() => cartApi.increase(i.cartItemId))
                        }
                      >
                        +
                      </button>
                    </div>
                    <button
                      className="danger-link"
                      onClick={() => run(() => cartApi.remove(i.cartItemId))}
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <strong className="subtotal">{money(i.subtotal)}</strong>
              </div>
            ))}
          </div>
          <aside className="summary">
            <span className="eyebrow">Order summary</span>
            <h2>Ready to checkout?</h2>
            <div className="summary-row">
              <span>Items</span>
              <b>{cart.totalItems}</b>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <b>{money(cart.totalAmount)}</b>
            </div>
            <button
              disabled={busy}
              className="primary-btn full"
              onClick={() => nav("/checkout")}
            >
              Continue <Icon name="arrow" size={17} />
            </button>
            <button
              className="secondary-btn full"
              onClick={() => run(() => cartApi.clear())}
            >
              Clear cart
            </button>
          </aside>
        </div>
      )}
    </div>
  );
}
