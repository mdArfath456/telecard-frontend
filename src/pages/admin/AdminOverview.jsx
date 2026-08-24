import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { cardApi, orderApi, paymentApi, adminApi } from "../../api/client";
import { money } from "../../utils/helpers";
import StatusBadge from "../../components/StatusBadge";
import Icon from "../../components/Icon";
export default function AdminOverview() {
  const [s, setS] = useState(null);
  useEffect(() => {
    let mounted = true;
    const loadOverview = async () => {
      try {
        const [a, b, c, d] = await Promise.all([
          cardApi.all(),
          orderApi.all(),
          paymentApi.all(),
          adminApi.users(),
        ]);
        if (mounted)
          setS({
            cards: a.data,
            orders: b.data,
            payments: c.data,
            users: d.data,
          });
      } catch (e) {
        if (mounted) setS({ cards: [], orders: [], payments: [], users: [] });
      }
    };
    loadOverview();
    return () => {
      mounted = false;
    };
  }, []);
  if (!s)
    return (
      <div className="screen-loader">
        <div className="spinner" />
        <span>Loading overview…</span>
      </div>
    );
  const revenue = s.orders
      .filter((o) => o.status === "COMPLETED")
      .reduce((a, b) => a + Number(b.totalAmount || 0), 0),
    pending = s.payments.filter((p) => p.status === "SUBMITTED").length;
  return (
    <div>
      <div className="admin-page-head">
        <div>
          <span className="eyebrow">Overview</span>
          <h1>Good to see you.</h1>
          <p>Here is what is happening across your card marketplace.</p>
        </div>
        <Link className="primary-btn" to="/admin/cards">
          Manage cards <Icon name="arrow" size={16} />
        </Link>
      </div>
      <div className="stats">
        <div className="stat">
          <span>Cards</span>
          <strong>{s.cards.length}</strong>
          <small>
            {s.cards.filter((x) => x.status === "ACTIVE").length} active
          </small>
        </div>
        <div className="stat">
          <span>Orders</span>
          <strong>{s.orders.length}</strong>
          <small>
            {s.orders.filter((x) => x.status === "PAYMENT_PENDING").length}{" "}
            awaiting payment
          </small>
        </div>
        <div className="stat">
          <span>Revenue</span>
          <strong>{money(revenue)}</strong>
          <small>Completed orders</small>
        </div>
        <div className="stat accent">
          <span>Payment reviews</span>
          <strong>{pending}</strong>
          <small>Need attention</small>
        </div>
      </div>
      <div className="dashboard-grid">
        <section className="data-panel">
          <div className="panel-head">
            <div>
              <span className="eyebrow">Recent orders</span>
              <h2>Order activity</h2>
            </div>
            <Link to="/admin/orders">View all</Link>
          </div>
          {s.orders.slice(0, 6).map((o) => (
            <Link className="mini-row" to="/admin/orders" key={o.id}>
              <div>
                <b>#{o.orderNumber}</b>
                <span>{o.userName}</span>
              </div>
              <div>
                <StatusBadge value={o.status} />
                <strong>{money(o.totalAmount)}</strong>
              </div>
            </Link>
          ))}
        </section>
        <section className="data-panel">
          <div className="panel-head">
            <div>
              <span className="eyebrow">Payments</span>
              <h2>Review queue</h2>
            </div>
            <Link to="/admin/payments">Open</Link>
          </div>
          {s.payments
            .filter((p) => p.status === "SUBMITTED")
            .slice(0, 6)
            .map((p) => (
              <Link className="mini-row" to="/admin/payments" key={p.id}>
                <div>
                  <b>{p.userName}</b>
                  <span>UTR {p.utrNumber}</span>
                </div>
                <div>
                  <StatusBadge value={p.status} />
                  <strong>{money(p.amount)}</strong>
                </div>
              </Link>
            ))}
          {!pending && (
            <div className="empty small">
              <Icon name="check" />
              <p>Payment queue is clear.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
