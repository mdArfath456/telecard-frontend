import React, { useEffect, useState } from "react";
import { paymentApi } from "../../api/client";
import { money, datetime, apiError } from "../../utils/helpers";
import StatusBadge from "../../components/StatusBadge";
import Icon from "../../components/Icon";
export default function AdminPayments() {
  const [p, setP] = useState([]),
    [filter, setFilter] = useState("SUBMITTED"),
    [open, setOpen] = useState(null),
    [remarks, setRemarks] = useState("");
  const load = async () => {
    const r = await paymentApi.all();
    setP(r.data);
  };
  useEffect(() => {
    let mounted = true;
    const fetchPayments = async () => {
      try {
        const r = await paymentApi.all();
        if (mounted) setP(r.data);
      } catch (e) {
        if (mounted) setP([]);
      }
    };
    fetchPayments();
    return () => {
      mounted = false;
    };
  }, []);
  const verify = async (verified) => {
    try {
      await paymentApi.verify(open.id, { verified, remarks });
      setOpen(null);
      setRemarks("");
      load();
    } catch (e) {
      alert(apiError(e));
    }
  };
  const list = p.filter((x) => filter === "ALL" || x.status === filter);
  return (
    <div>
      <div className="admin-page-head">
        <div>
          <span className="eyebrow">Manual verification</span>
          <h1>Payments</h1>
          <p>Review submitted UTRs and payment screenshots.</p>
        </div>
      </div>
      <div className="filter-chips admin-chips">
        <button
          className={filter === "SUBMITTED" ? "chip active" : "chip"}
          onClick={() => setFilter("SUBMITTED")}
        >
          Needs review
        </button>
        <button
          className={filter === "ALL" ? "chip active" : "chip"}
          onClick={() => setFilter("ALL")}
        >
          All payments
        </button>
        <button
          className={filter === "VERIFIED" ? "chip active" : "chip"}
          onClick={() => setFilter("VERIFIED")}
        >
          Verified
        </button>
        <button
          className={filter === "REJECTED" ? "chip active" : "chip"}
          onClick={() => setFilter("REJECTED")}
        >
          Rejected
        </button>
      </div>
      <div className="table-panel">
        <table>
          <thead>
            <tr>
              <th>Payment</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>UTR</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {list.map((x) => (
              <tr key={x.id}>
                <td>
                  <b>#{x.orderNumber}</b>
                  <span className="table-sub">{datetime(x.createdAt)}</span>
                </td>
                <td>
                  <b>{x.userName}</b>
                  <span className="table-sub">{x.userEmail}</span>
                </td>
                <td>{money(x.amount)}</td>
                <td>{x.utrNumber || "—"}</td>
                <td>
                  <StatusBadge value={x.status} />
                </td>
                <td>
                  <button
                    className="table-link"
                    onClick={() => {
                      setOpen(x);
                      setRemarks(x.adminRemarks || "");
                    }}
                  >
                    Review
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
                <span className="eyebrow">Payment review</span>
                <h2>#{open.orderNumber}</h2>
                <StatusBadge value={open.status} />
              </div>
              <button onClick={() => setOpen(null)}>
                <Icon name="close" />
              </button>
            </div>
            <div className="payment-review">
              <div className="payment-data">
                <div>
                  <span>Customer</span>
                  <b>{open.userName}</b>
                  <small>{open.userEmail}</small>
                </div>
                <div>
                  <span>Amount</span>
                  <b>{money(open.amount)}</b>
                </div>
                <div>
                  <span>Method</span>
                  <b>{open.paymentMethod}</b>
                </div>
                <div>
                  <span>UTR</span>
                  <b>{open.utrNumber || "—"}</b>
                </div>
              </div>
              {open.screenshotViewUrl ? (
                <img
                  className="payment-shot"
                  src={open.screenshotViewUrl}
                  alt="Payment screenshot"
                />
              ) : (
                <div className="empty small">
                  <Icon name="box" />
                  <p>No screenshot URL available.</p>
                </div>
              )}
              <label className="form">
                <span>Admin remarks</span>
                <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Optional reason or verification note"
                />
              </label>
              <div className="modal-actions">
                <button
                  className="secondary-btn danger"
                  onClick={() => verify(false)}
                >
                  Reject payment
                </button>
                <button className="primary-btn" onClick={() => verify(true)}>
                  Verify payment <Icon name="check" size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
