import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { cardApi, categoryApi } from "../api/client";
import Icon from "../components/Icon";
import { money } from "../utils/helpers";
export default function Home() {
  const [cards, setCards] = useState([]);
  const [cats, setCats] = useState([]);
  useEffect(() => {
    let mounted = true;
    const loadHome = async () => {
      try {
        const [a, b] = await Promise.all([cardApi.list(), categoryApi.list()]);
        if (mounted) {
          setCards(a.data);
          setCats(b.data);
        }
      } catch (e) {
        if (mounted) {
          setCards([]);
          setCats([]);
        }
      }
    };
    loadHome();
    return () => {
      mounted = false;
    };
  }, []);
  return (
    <div>
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">
            <Icon name="shield" size={15} /> Smart card marketplace
          </span>
          <h1>
            Choose a card that fits <em>your life.</em>
          </h1>
          <p>
            Explore premium credit and debit cards, compare benefits, and order
            securely from one polished experience.
          </p>
          <div className="hero-actions">
            <Link className="primary-btn" to="/cards">
              Explore cards <Icon name="arrow" size={17} />
            </Link>
            <Link className="secondary-btn" to="/register">
              Create account
            </Link>
          </div>
          <div className="hero-proof">
            <span>
              <b>Secure</b> checkout
            </span>
            <span>
              <b>Manual</b> payment review
            </span>
            <span>
              <b>Fast</b> fulfillment
            </span>
          </div>
        </div>
        <div className="hero-visual">
          <div className="orb orb-a" />
          <div className="orb orb-b" />
          <div className="showcase-card">
            <div className="chip" />
            <div className="card-brand">TELECARD</div>
            <div className="card-number">
              •••• &nbsp;•••• &nbsp;•••• &nbsp; 4829
            </div>
            <div className="card-meta">
              <span>PREMIUM MEMBER</span>
              <strong>VISA</strong>
            </div>
          </div>
          <div className="float-card">
            <span className="float-icon">
              <Icon name="check" size={16} />
            </span>
            <div>
              <b>Verified checkout</b>
              <small>Protected by secure authentication</small>
            </div>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="section-head">
          <div>
            <span className="eyebrow">Curated collection</span>
            <h2>Popular cards</h2>
          </div>
          <Link className="text-link" to="/cards">
            View all <Icon name="arrow" size={15} />
          </Link>
        </div>
        <div className="card-grid">
          {cards.slice(0, 4).map((c) => (
            <Link to={`/cards/${c.id}`} className="product-card" key={c.id}>
              <div className="product-image">
                <img
                  src={c.imageUrl || "/placeholder-card.svg"}
                  onError={(e) =>
                    (e.currentTarget.src = "/placeholder-card.svg")
                  }
                />
                <span>{c.cardNetwork}</span>
              </div>
              <div className="product-info">
                <div>
                  <span className="muted">{c.categoryName}</span>
                  <h3>{c.cardName}</h3>
                </div>
                <strong>{money(c.price)}</strong>
              </div>
              <div className="product-foot">
                <span>{c.cardType}</span>
                <span>From {c.validity || "standard"}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <section className="section soft">
        <div className="section-head">
          <div>
            <span className="eyebrow">Browse by need</span>
            <h2>Card categories</h2>
          </div>
        </div>
        <div className="category-grid">
          {cats.map((c) => (
            <Link
              className="category-card"
              to={`/cards?category=${c.id}`}
              key={c.id}
            >
              <span className="category-icon">
                <Icon name="credit" />
              </span>
              <div>
                <h3>{c.name}</h3>
                <p>{c.description || "Explore cards in this category."}</p>
              </div>
              <Icon name="arrow" />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
