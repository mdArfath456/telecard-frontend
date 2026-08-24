import React, { useEffect, useState } from "react";
import { orderApi } from "../../api/client";
import { money, datetime, apiError } from "../../utils/helpers";
import StatusBadge from "../../components/StatusBadge";
import Icon from "../../components/Icon";
const statuses = [
  "PAYMENT_PENDING",
  "PAYMENT_SUBMITTED",
  "PAYMENT_VERIFIED",
  "PAYMENT_REJECTED",
  "PROCESSING",
  "COMPLETED",
  "CANCELLED",
];
export default function AdminOrders() {
  const [orders, setOrders] = useState([]),
    [open, setOpen] = useState(null);
  const load = () => orderApi.all().then((r) => setOrders(r.data));
  useEffect(() => {
    load();
  }, []);
  const change = async (id, status) => {
    try {
      await orderApi.status(id, status);
      load();
      orderApi.one(id).then((r) => setOpen(r.data));
    } catch (e) {
      alert(apiError(e));
    }
  };
  return (
    <div>
      <div className="admin-page-head">
        <div>
          <span className="eyebrow">Fulfillment</span>
          <h1>Orders</h1>
          <p>Move orders from payment review to card fulfillment.</p>
        </div>
      </div>
      <div className="table-panel">
        <table>
          <thead>
            <tr>
              <th>Order</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Created</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td>
                  <b>#{o.orderNumber}</b>
                </td>
                <td>
                  <div>
                    <b>{o.userName}</b>
                    <span className="table-sub">{o.userEmail}</span>
                  </div>
                </td>
                <td>{money(o.totalAmount)}</td>
                <td>
                  <StatusBadge value={o.status} />
                </td>
                <td>{datetime(o.createdAt)}</td>
                <td>
                  <button
                    className="table-link"
                    onClick={() =>
                      orderApi.one(o.id).then((r) => setOpen(r.data))
                    }
                  >
                    Open
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {open && (
        <div className="modal-backdrop">
          <div className="modal xlarge">
            <div className="modal-head">
              <div>
                <span className="eyebrow">Order detail</span>
                <h2>#{open.orderNumber}</h2>
                <StatusBadge value={open.status} />
              </div>
              <button onClick={() => setOpen(null)}>
                <Icon name="close" />
              </button>
            </div>
            <div className="order-modal-grid">
              <div>
                <h3>Items</h3>
                {open.items?.map((i) => (
                  <div className="detail-item" key={i.id}>
                    <div>
                      <b>{i.cardName}</b>
                      <small>
                        {i.cardNetwork} · {i.cardType}
                      </small>
                    </div>
                    <span>×{i.quantity}</span>
                    <strong>{money(i.subtotal)}</strong>
                  </div>
                ))}
              </div>
              <div>
                <h3>Update status</h3>
                <div className="status-options">
                  {statuses.map((s) => (
                    <button
                      key={s}
                      className={open.status === s ? "selected" : ""}
                      onClick={() => change(open.id, s)}
                    >
                      <StatusBadge value={s} />
                    </button>
                  ))}
                </div>
                {open.status === "PROCESSING" && (
                  <Fulfill
                    order={open}
                    onDone={() => {
                      load();
                      orderApi.one(open.id).then((r) => setOpen(r.data));
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
function Fulfill({ order, onDone }) {
  const [items, setItems] = useState(
      order.items.map((i) => ({
        orderItemId: i.id,
        cardDetails: i.cardDetails || "",
      })),
    ),
    [remarks, setRemarks] = useState(order.adminRemarks || "");
  const save = async () => {
    try {
      await orderApi.fulfill(order.id, { items, remarks });
      onDone();
    } catch (e) {
      alert(apiError(e));
    }
  };
  return (
    <div className="fulfill">
      <h3>Assign card details</h3>
      {items.map((x, i) => (
        <label key={x.orderItemId}>
          Item {i + 1}
          <input
            value={x.cardDetails}
            onChange={(e) =>
              setItems((a) =>
                a.map((z, j) =>
                  j === i ? { ...z, cardDetails: e.target.value } : z,
                ),
              )
            }
            placeholder="Card number / details"
          />
        </label>
      ))}
      <label>
        Remarks
        <textarea
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
        />
      </label>
      <button className="primary-btn full" onClick={save}>
        Complete & email customer
      </button>
    </div>
  );
}
