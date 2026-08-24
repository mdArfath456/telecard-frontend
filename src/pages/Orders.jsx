import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { orderApi } from "../api/client";
import StatusBadge from "../components/StatusBadge";
import { money, datetime } from "../utils/helpers";
import Icon from "../components/Icon";
export default function Orders() {
  const [o, setO] = useState(null);
  useEffect(() => {
    let mounted = true;
    const fetchOrders = async () => {
      try {
        const r = await orderApi.mine();
        if (mounted) setO(r.data);
      } catch (e) {
        if (mounted) setO([]);
      }
    };
    fetchOrders();
    return () => {
      mounted = false;
    };
  }, []);
  return (
    <div className="page-wrap">
      <div className="page-hero compact">
        <span className="eyebrow">Your account</span>
        <h1>Orders</h1>
        <p>Track payment reviews, fulfillment and completed card details.</p>
      </div>
      {o === null ? (
        <div className="screen-loader">
          <div className="spinner" />
        </div>
      ) : !o.length ? (
        <div className="empty">
          <Icon name="box" size={32} />
          <h3>No orders yet</h3>
          <p>Your completed orders will appear here.</p>
          <Link className="primary-btn" to="/cards">
            Browse cards
          </Link>
        </div>
      ) : (
        <div className="order-list">
          {o.map((x) => (
            <Link to={`/orders/${x.id}`} className="order-row" key={x.id}>
              <div>
                <span className="muted">{datetime(x.createdAt)}</span>
                <h3>#{x.orderNumber}</h3>
                <p>
                  {x.items?.length} item{x.items?.length === 1 ? "" : "s"} ·{" "}
                  {x.userName}
                </p>
              </div>
              <div className="order-right">
                <StatusBadge value={x.status} />
                <strong>{money(x.totalAmount)}</strong>
                <Icon name="arrow" size={18} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
