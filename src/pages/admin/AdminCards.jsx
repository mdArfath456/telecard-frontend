import React, { useEffect, useState } from "react";
import { cardApi, categoryApi } from "../../api/client";
import { money, apiError } from "../../utils/helpers";
import Icon from "../../components/Icon";
import StatusBadge from "../../components/StatusBadge";
const blank = {
  cardName: "",
  cardType: "Credit",
  cardNetwork: "VISA",
  validity: "",
  joiningFee: "",
  annualFee: "",
  interestRate: "",
  creditLimit: "",
  cashWithdrawalLimit: "",
  rewards: "",
  benefits: "",
  eligibility: "",
  description: "",
  imageUrl: "",
  stock: 0,
  categoryId: "",
};
export default function AdminCards() {
  const [cards, setCards] = useState([]),
    [cats, setCats] = useState([]),
    [edit, setEdit] = useState(null),
    [q, setQ] = useState("");
  const load = () =>
    Promise.all([cardApi.all(), categoryApi.all()]).then(([a, b]) => {
      setCards(a.data);
      setCats(b.data);
    });
  useEffect(() => {
    load();
  }, []);
  const save = async (e) => {
    e.preventDefault();
    const d = {
      ...edit,
      joiningFee: Number(edit.joiningFee),
      annualFee: edit.annualFee ? Number(edit.annualFee) : 0,
      interestRate: edit.interestRate ? Number(edit.interestRate) : 0,
      creditLimit: edit.creditLimit ? Number(edit.creditLimit) : 0,
      cashWithdrawalLimit: edit.cashWithdrawalLimit
        ? Number(edit.cashWithdrawalLimit)
        : 0,
      stock: Number(edit.stock),
      categoryId: Number(edit.categoryId),
    };
    try {
      if (edit.id) await cardApi.update(edit.id, d);
      else await cardApi.create(d);
      setEdit(null);
      load();
    } catch (e) {
      alert(apiError(e));
    }
  };
  const filtered = cards.filter((c) =>
    (c.cardName + " " + c.cardNetwork + " " + c.cardType)
      .toLowerCase()
      .includes(q.toLowerCase()),
  );
  return (
    <div>
      <div className="admin-page-head">
        <div>
          <span className="eyebrow">Catalog</span>
          <h1>Cards</h1>
          <p>Create, update and control availability.</p>
        </div>
        <button className="primary-btn" onClick={() => setEdit({ ...blank })}>
          <Icon name="plus" /> New card
        </button>
      </div>
      <div className="toolbar">
        <div className="searchbox">
          <Icon name="search" />
          <input
            placeholder="Search cards…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
      </div>
      <div className="table-panel">
        <table>
          <thead>
            <tr>
              <th>Card</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id}>
                <td>
                  <div className="table-product">
                    <img
                      src={c.imageUrl || "/placeholder-card.svg"}
                      onError={(e) =>
                        (e.currentTarget.src = "/placeholder-card.svg")
                      }
                    />
                    <div>
                      <b>{c.cardName}</b>
                      <span>
                        {c.cardNetwork} · {c.cardType}
                      </span>
                    </div>
                  </div>
                </td>
                <td>{c.categoryName}</td>
                <td>{money(c.price)}</td>
                <td>{c.stock}</td>
                <td>
                  <select
                    className="status-select"
                    value={c.status}
                    onChange={async (e) => {
                      try {
                        await cardApi.status(c.id, e.target.value);
                        load();
                      } catch (err) {
                        alert(apiError(err));
                      }
                    }}
                  >
                    <option>ACTIVE</option>
                    <option>INACTIVE</option>
                    <option>OUT_OF_STOCK</option>
                  </select>
                </td>
                <td>
                  <div className="row-actions">
                    <button
                      onClick={() => setEdit({ ...c, joiningFee: c.price })}
                    >
                      <Icon name="edit" size={16} />
                    </button>
                    <button
                      onClick={async () => {
                        if (confirm("Delete this card?")) {
                          await cardApi.remove(c.id);
                          load();
                        }
                      }}
                    >
                      <Icon name="trash" size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {edit && (
        <div className="modal-backdrop">
          <form className="modal large form" onSubmit={save}>
            <div className="modal-head">
              <div>
                <span className="eyebrow">
                  {edit.id ? "Edit card" : "New card"}
                </span>
                <h2>{edit.id ? edit.cardName : "Create card"}</h2>
              </div>
              <button type="button" onClick={() => setEdit(null)}>
                <Icon name="close" />
              </button>
            </div>
            <div className="form two">
              <label>
                Card name
                <input
                  value={edit.cardName}
                  onChange={(e) =>
                    setEdit({ ...edit, cardName: e.target.value })
                  }
                  required
                />
              </label>
              <label>
                Card type
                <input
                  value={edit.cardType}
                  onChange={(e) =>
                    setEdit({ ...edit, cardType: e.target.value })
                  }
                  required
                />
              </label>
              <label>
                Network
                <input
                  value={edit.cardNetwork}
                  onChange={(e) =>
                    setEdit({ ...edit, cardNetwork: e.target.value })
                  }
                  required
                />
              </label>
              <label>
                Validity
                <input
                  value={edit.validity || ""}
                  onChange={(e) =>
                    setEdit({ ...edit, validity: e.target.value })
                  }
                />
              </label>
              <label>
                Joining fee
                <input
                  type="number"
                  step="0.01"
                  value={edit.joiningFee}
                  onChange={(e) =>
                    setEdit({ ...edit, joiningFee: e.target.value })
                  }
                  required
                />
              </label>
              <label>
                Annual fee
                <input
                  type="number"
                  step="0.01"
                  value={edit.annualFee || ""}
                  onChange={(e) =>
                    setEdit({ ...edit, annualFee: e.target.value })
                  }
                />
              </label>
              <label>
                Interest rate
                <input
                  type="number"
                  step="0.01"
                  value={edit.interestRate || ""}
                  onChange={(e) =>
                    setEdit({ ...edit, interestRate: e.target.value })
                  }
                />
              </label>
              <label>
                Credit limit
                <input
                  type="number"
                  step="0.01"
                  value={edit.creditLimit || ""}
                  onChange={(e) =>
                    setEdit({ ...edit, creditLimit: e.target.value })
                  }
                />
              </label>
              <label>
                Cash withdrawal limit
                <input
                  type="number"
                  step="0.01"
                  value={edit.cashWithdrawalLimit || ""}
                  onChange={(e) =>
                    setEdit({ ...edit, cashWithdrawalLimit: e.target.value })
                  }
                />
              </label>
              <label>
                Stock
                <input
                  type="number"
                  min="0"
                  value={edit.stock}
                  onChange={(e) => setEdit({ ...edit, stock: e.target.value })}
                  required
                />
              </label>
              <label>
                Category
                <select
                  value={edit.categoryId}
                  onChange={(e) =>
                    setEdit({ ...edit, categoryId: e.target.value })
                  }
                  required
                >
                  <option value="">Select category</option>
                  {cats.map((c) => (
                    <option value={c.id} key={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Image URL
                <input
                  value={edit.imageUrl || ""}
                  onChange={(e) =>
                    setEdit({ ...edit, imageUrl: e.target.value })
                  }
                />
              </label>
              <label className="span-2">
                Rewards
                <textarea
                  value={edit.rewards || ""}
                  onChange={(e) =>
                    setEdit({ ...edit, rewards: e.target.value })
                  }
                />
              </label>
              <label className="span-2">
                Benefits
                <textarea
                  value={edit.benefits || ""}
                  onChange={(e) =>
                    setEdit({ ...edit, benefits: e.target.value })
                  }
                />
              </label>
              <label>
                Eligibility
                <textarea
                  value={edit.eligibility || ""}
                  onChange={(e) =>
                    setEdit({ ...edit, eligibility: e.target.value })
                  }
                />
              </label>
              <label>
                Description
                <textarea
                  value={edit.description || ""}
                  onChange={(e) =>
                    setEdit({ ...edit, description: e.target.value })
                  }
                />
              </label>
            </div>
            <div className="modal-actions">
              <button
                type="button"
                className="secondary-btn"
                onClick={() => setEdit(null)}
              >
                Cancel
              </button>
              <button className="primary-btn">Save card</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
