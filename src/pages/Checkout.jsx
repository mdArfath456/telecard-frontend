import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { cartApi, orderApi, paymentApi } from "../api/client";
import { money, apiError } from "../utils/helpers";
import Icon from "../components/Icon";
export default function Checkout() {
  const [cart, setCart] = useState(null),
    [selected, setSelected] = useState({}),
    [step, setStep] = useState(1),
    [order, setOrder] = useState(null),
    [payment, setPayment] = useState(null),
    [form, setForm] = useState({
      paymentMethod: "UPI",
      payerName: "",
      utrNumber: "",
      screenshot: null,
    }),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  const nav = useNavigate();
  useEffect(() => {
    let mounted = true;
    const fetchCart = async () => {
      try {
        const r = await cartApi.get();
        if (!mounted) return;
        setCart(r.data);
        const x = {};
        r.data.items.forEach((i) => (x[i.cartItemId] = i.quantity));
        setSelected(x);
      } catch (e) {
        if (mounted) setError(apiError(e));
      }
    };
    fetchCart();
    return () => {
      mounted = false;
    };
  }, []);
  const toggle = (id, max) =>
    setSelected((s) => {
      const n = { ...s };
      if (n[id]) delete n[id];
      else n[id] = Math.min(1, max);
      return n;
    });
  const changeQty = (id, delta, max) =>
    setSelected((s) => {
      if (!s[id]) return s;
      const q = Math.max(1, Math.min(max, s[id] + delta));
      return { ...s, [id]: q };
    });
  const createOrder = async () => {
    const items = Object.entries(selected).map(([cartItemId, quantity]) => ({
      cartItemId: Number(cartItemId),
      quantity,
    }));
    if (!items.length) {
      setError("Select at least one cart item.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const r = await orderApi.create({ items });
      setOrder(r.data);
      const p = await paymentApi.create(r.data.id);
      setPayment(p.data);
      setStep(2);
    } catch (e) {
      setError(apiError(e));
    } finally {
      setBusy(false);
    }
  };
  const submitPayment = async (e) => {
    e.preventDefault();
    if (!form.screenshot) {
      setError("Payment screenshot is required.");
      return;
    }
    const fd = new FormData();
    fd.append("paymentMethod", form.paymentMethod);
    fd.append("payerName", form.payerName);
    fd.append("utrNumber", form.utrNumber);
    fd.append("screenshot", form.screenshot);
    setBusy(true);
    setError("");
    try {
      await paymentApi.submit(order.id, fd);
      setStep(3);
    } catch (e) {
      setError(apiError(e));
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
    <div className="page-wrap checkout">
      <div className="checkout-head">
        <span className="eyebrow">Secure checkout</span>
        <h1>Complete your order</h1>
        <div className="steps">
          <span className={step >= 1 ? "active" : ""}>
            1 <b>Review</b>
          </span>
          <i />
          <span className={step >= 2 ? "active" : ""}>
            2 <b>Payment</b>
          </span>
          <i />
          <span className={step >= 3 ? "active" : ""}>
            3 <b>Submitted</b>
          </span>
        </div>
      </div>
      {error && <div className="form-error">{error}</div>}
      {step === 1 && (
        <div className="checkout-grid">
          <div className="checkout-panel">
            <h2>Select items</h2>
            <p className="muted">
              Choose the cards and quantities you want to convert into this
              order.
            </p>
            {cart.items.map((i) => (
              <label
                className={`select-item ${selected[i.cartItemId] ? "chosen" : ""}`}
                key={i.cartItemId}
              >
                <input
                  type="checkbox"
                  checked={!!selected[i.cartItemId]}
                  onChange={() => toggle(i.cartItemId, i.quantity)}
                />
                <img
                  src={i.imageUrl || "/placeholder-card.svg"}
                  onError={(e) =>
                    (e.currentTarget.src = "/placeholder-card.svg")
                  }
                />
                <div>
                  <b>{i.cardName}</b>
                  <small>
                    {i.quantity} in cart · {money(i.price)} each
                  </small>
                  {selected[i.cartItemId] && (
                    <div className="checkout-qty qty">
                      <button
                        type="button"
                        onClick={() => changeQty(i.cartItemId, -1, i.quantity)}
                      >
                        −
                      </button>
                      <b>{selected[i.cartItemId]}</b>
                      <button
                        type="button"
                        onClick={() => changeQty(i.cartItemId, 1, i.quantity)}
                      >
                        +
                      </button>
                    </div>
                  )}
                </div>
                <strong>
                  {money(
                    Number(i.price || 0) * Number(selected[i.cartItemId] || 0),
                  )}
                </strong>
              </label>
            ))}
          </div>
          <aside className="summary">
            <span className="eyebrow">Next step</span>
            <h2>Review & pay</h2>
            <p>
              Orders start as payment pending. After submission, an admin
              reviews your UTR and screenshot.
            </p>
            <button
              className="primary-btn full"
              disabled={busy}
              onClick={createOrder}
            >
              {busy ? "Creating…" : "Create order"}
              <Icon name="arrow" size={17} />
            </button>
          </aside>
        </div>
      )}
      {step === 2 && (
        <form className="checkout-grid" onSubmit={submitPayment}>
          <div className="checkout-panel">
            <div className="payment-amount">
              <span>Amount due</span>
              <strong>{money(order.totalAmount)}</strong>
              <small>Order #{order.orderNumber}</small>
            </div>
            <h2>Submit payment</h2>
            <p className="muted">
              Payment is handled manually through the backend's QR/payment
              review flow.
            </p>
            <div className="form two">
              <label>
                Payment method
                <select
                  value={form.paymentMethod}
                  onChange={(e) =>
                    setForm({ ...form, paymentMethod: e.target.value })
                  }
                >
                  <option value="UPI">UPI</option>
                  <option value="BANK_TRANSFER">Bank transfer</option>
                  <option value="MANUAL_QR">Manual QR</option>
                </select>
              </label>
              <label>
                Payer name
                <input
                  value={form.payerName}
                  onChange={(e) =>
                    setForm({ ...form, payerName: e.target.value })
                  }
                  placeholder="Name on payment"
                />
              </label>
              <label className="span-2">
                UTR / transaction number
                <input
                  value={form.utrNumber}
                  onChange={(e) =>
                    setForm({ ...form, utrNumber: e.target.value })
                  }
                  required
                />
              </label>
              <label className="upload span-2">
                Payment screenshot
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setForm({
                      ...form,
                      screenshot: e.target.files?.[0] || null,
                    })
                  }
                />
                <small>{form.screenshot?.name || "PNG/JPG up to 10MB"}</small>
              </label>
            </div>
          </div>
          <aside className="summary">
            <span className="eyebrow">Order total</span>
            <h2>{money(order.totalAmount)}</h2>
            <div className="summary-row">
              <span>Status</span>
              <b>Payment pending</b>
            </div>
            <button className="primary-btn full" disabled={busy}>
              {busy ? "Submitting…" : "Submit payment"}
              <Icon name="check" size={17} />
            </button>
          </aside>
        </form>
      )}
      {step === 3 && (
        <div className="success-panel">
          <div className="success-icon">
            <Icon name="check" size={30} />
          </div>
          <span className="eyebrow">Payment submitted</span>
          <h1>You're all set.</h1>
          <p>
            Your payment for <b>#{order.orderNumber}</b> is now awaiting
            verification. We'll update the order after review.
          </p>
          <div className="hero-actions">
            <button
              className="primary-btn"
              onClick={() => nav(`/orders/${order.id}`)}
            >
              View order <Icon name="arrow" size={17} />
            </button>
            <button className="secondary-btn" onClick={() => nav("/cards")}>
              Continue shopping
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
