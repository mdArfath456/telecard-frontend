import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { cardApi, categoryApi } from "../api/client";
import Icon from "../components/Icon";
import { money } from "../utils/helpers";
export default function Cards() {
  const [sp, setSp] = useSearchParams();
  const [cards, setCards] = useState([]),
    [cats, setCats] = useState([]),
    [search, setSearch] = useState(sp.get("search") || ""),
    [loading, setLoading] = useState(true);
  const cat = sp.get("category") || "";
  useEffect(() => {
    categoryApi.list().then((r) => setCats(r.data));
  }, []);
  useEffect(() => {
    setLoading(true);
    cardApi
      .list(cat ? { categoryId: cat } : search ? { search } : {})
      .then((r) => setCards(r.data))
      .finally(() => setLoading(false));
  }, [cat, search]);
  const submit = (e) => {
    e.preventDefault();
    setSp(search ? { search } : {});
  };
  return (
    <div className="page-wrap">
      <div className="page-hero">
        <span className="eyebrow">The collection</span>
        <h1>Find your next card.</h1>
        <p>Compare fees, limits, rewards and benefits before you buy.</p>
      </div>
      <div className="filterbar">
        <form className="searchbox" onSubmit={submit}>
          <Icon name="search" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search cards by name…"
          />
          <button>Search</button>
        </form>
        <div className="filter-chips">
          <button
            className={!cat ? "chip active" : "chip"}
            onClick={() => setSp({})}
          >
            All
          </button>
          {cats.map((c) => (
            <button
              key={c.id}
              className={String(c.id) === String(cat) ? "chip active" : "chip"}
              onClick={() => setSp({ category: c.id })}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>
      {loading ? (
        <div className="card-grid">
          {[1, 2, 3, 4].map((x) => (
            <div className="skeleton-card" key={x} />
          ))}
        </div>
      ) : (
        <div className="card-grid">
          {cards.map((c) => (
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
                <span>
                  {c.stock > 0 ? `${c.stock} in stock` : "Out of stock"}
                </span>
              </div>
            </Link>
          ))}
          {!cards.length && (
            <div className="empty">
              <Icon name="search" size={28} />
              <h3>No cards found</h3>
              <p>Try another search or category.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
