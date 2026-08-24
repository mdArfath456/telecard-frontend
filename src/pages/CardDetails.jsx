import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { cardApi, cartApi } from "../api/client";
import { useAuth } from "../context/AuthContext";
import Icon from "../components/Icon";
import { money } from "../utils/helpers";
export default function CardDetails() {
  const { id } = useParams();
  const [c, setC] = useState(null);
  const [q, setQ] = useState(1);
  const [message, setMessage] = useState("");
  const { user } = useAuth();
  const nav = useNavigate();
  useEffect(() => {
    let mounted = true;
    const fetchCard = async () => {
      try {
        const r = await cardApi.get(id);
        if (mounted) setC(r.data);
      } catch (e) {
        if (mounted) setC(null);
      }
    };
    fetchCard();
    return () => {
      mounted = false;
    };
  }, [id]);
  if (!c)
    return (
      <div className="screen-loader">
        <div className="spinner" />
      </div>
    );
  const add = async () => {
    if (!user) {
      nav("/login");
      return;
    }
    try {
      await cartApi.add({ cardId: c.id, quantity: q });
      setMessage("Added to cart");
    } catch (e) {
      setMessage(e.response?.data?.message || "Could not add to cart");
    }
  };
  return (
    <div className="detail-wrap">
      <Link className="back-link" to="/cards">
        ← Back to cards
      </Link>
      <div className="detail-grid">
        <div className="detail-media">
          <img
            src={c.imageUrl || "/placeholder-card.svg"}
            onError={(e) => (e.currentTarget.src = "/placeholder-card.svg")}
          />
        </div>
        <div className="detail-copy">
          <span className="eyebrow">
            {c.categoryName} · {c.cardNetwork}
          </span>
          <h1>{c.cardName}</h1>
          <p className="detail-price">
            {money(c.price)} <small>joining fee</small>
          </p>
          <p className="lead">
            {c.description ||
              "A thoughtfully designed card with benefits built for everyday spending."}
          </p>
          <div className="spec-grid">
            <div>
              <small>Card type</small>
              <b>{c.cardType}</b>
            </div>
            <div>
              <small>Validity</small>
              <b>{c.validity || "Standard"}</b>
            </div>
            <div>
              <small>Annual fee</small>
              <b>{money(c.annualFee)}</b>
            </div>
            <div>
              <small>Interest rate</small>
              <b>{c.interestRate}%</b>
            </div>
            <div>
              <small>Credit limit</small>
              <b>{money(c.creditLimit)}</b>
            </div>
            <div>
              <small>Cash withdrawal</small>
              <b>{money(c.cashWithdrawalLimit)}</b>
            </div>
          </div>
          <div className="buy-row">
            <div className="qty">
              <button onClick={() => setQ(Math.max(1, q - 1))}>−</button>
              <b>{q}</b>
              <button onClick={() => setQ(Math.min(c.stock || 1, q + 1))}>
                +
              </button>
            </div>
            <button className="primary-btn" disabled={!c.stock} onClick={add}>
              {c.stock ? "Add to cart" : "Out of stock"}{" "}
              <Icon name="cart" size={17} />
            </button>
          </div>
          {message && <div className="inline-note">{message}</div>}
          <div className="info-panels">
            <div>
              <b>Rewards</b>
              <p>{c.rewards || "Not specified"}</p>
            </div>
            <div>
              <b>Benefits</b>
              <p>{c.benefits || "Not specified"}</p>
            </div>
            <div>
              <b>Eligibility</b>
              <p>{c.eligibility || "Not specified"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
