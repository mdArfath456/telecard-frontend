import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { orderApi, paymentApi } from "../api/client";
import StatusBadge from "../components/StatusBadge";
import { money, datetime } from "../utils/helpers";
import Icon from "../components/Icon";
export default function OrderDetails() {
  const { id } = useParams();
  const [o, setO] = useState(null),
    [p, setP] = useState(null);
  useEffect(() => {
    orderApi.mineOne(id).then((r) => setO(r.data));
    paymentApi
      .get(id)
      .then((r) => setP(r.data))
      .catch(() => {});
  }, [id]);
  if (!o)
    return (
      <div className="screen-loader">
        <div className="spinner" />
      </div>
    );
  return (
    <div className="page-wrap">
      <Link className="back-link" to="/orders">
        ← Orders
      </Link>
      <div className="order-detail-head">
        <div>
          <span className="eyebrow">Order placed {datetime(o.createdAt)}</span>
          <h1>#{o.orderNumber}</h1>
          <StatusBadge value={o.status} />
        </div>
        <strong className="order-total">{money(o.totalAmount)}</strong>
      </div>
      <div className="order-detail-grid">
        <section className="checkout-panel">
          <h2>Items</h2>
          {o.items?.map((i) => (
            <div className="detail-item" key={i.id}>
              <div>
                <b>{i.cardName}</b>
                <small>
                  {i.cardNetwork} · {i.cardType}
                </small>
              </div>
              <span>×{i.quantity}</span>
              <strong>{money(i.subtotal)}</strong>
              {i.cardDetails && (
                <div className="card-details">
                  <Icon name="shield" size={15} />
                  <span>{i.cardDetails}</span>
                </div>
              )}
            </div>
          ))}
        </section>
        <aside className="summary">
          <span className="eyebrow">Payment</span>
          {p ? (
            <>
              <h2>{money(p.amount)}</h2>
              <StatusBadge value={p.status} />
              <div className="summary-row">
                <span>Method</span>
                <b>{p.paymentMethod}</b>
              </div>
              {p.utrNumber && (
                <div className="summary-row">
                  <span>UTR</span>
                  <b>{p.utrNumber}</b>
                </div>
              )}
            </>
          ) : (
            <p className="muted">Payment record is not available yet.</p>
          )}
          {o.adminRemarks && (
            <div className="admin-note">
              <b>Admin note</b>
              <p>{o.adminRemarks}</p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
