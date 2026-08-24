import React, { useEffect, useState } from "react";
import { categoryApi } from "../../api/client";
import Icon from "../../components/Icon";
import StatusBadge from "../../components/StatusBadge";
export default function AdminCategories() {
  const [cats, setCats] = useState([]),
    [edit, setEdit] = useState(null);
  const load = () => categoryApi.all().then((r) => setCats(r.data));
  useEffect(() => {
    load();
  }, []);
  const save = async (e) => {
    e.preventDefault();
    if (edit.id) await categoryApi.update(edit.id, edit);
    else await categoryApi.create(edit);
    setEdit(null);
    load();
  };
  return (
    <div>
      <div className="admin-page-head">
        <div>
          <span className="eyebrow">Catalog structure</span>
          <h1>Categories</h1>
          <p>Organize cards for the storefront.</p>
        </div>
        <button
          className="primary-btn"
          onClick={() => setEdit({ name: "", description: "" })}
        >
          <Icon name="plus" /> New category
        </button>
      </div>
      <div className="category-admin-grid">
        {cats.map((c) => (
          <div className="category-admin" key={c.id}>
            <div className="category-icon">
              <Icon name="credit" />
            </div>
            <div className="category-admin-copy">
              <h3>{c.name}</h3>
              <p>{c.description || "No description"}</p>
              <StatusBadge value={c.active ? "ACTIVE" : "INACTIVE"} />
            </div>
            <div className="row-actions">
              <button
                title={c.active ? "Deactivate" : "Activate"}
                onClick={async () => {
                  if (c.active) await categoryApi.deactivate(c.id);
                  else await categoryApi.activate(c.id);
                  load();
                }}
              >
                <Icon name={c.active ? "lock" : "check"} size={16} />
              </button>
              <button onClick={() => setEdit(c)}>
                <Icon name="edit" size={16} />
              </button>
              <button
                onClick={async () => {
                  if (confirm("Delete this category?")) {
                    await categoryApi.remove(c.id);
                    load();
                  }
                }}
              >
                <Icon name="trash" size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
      {edit && (
        <div className="modal-backdrop">
          <form className="modal form" onSubmit={save}>
            <div className="modal-head">
              <div>
                <span className="eyebrow">Category</span>
                <h2>{edit.id ? "Edit category" : "New category"}</h2>
              </div>
              <button type="button" onClick={() => setEdit(null)}>
                <Icon name="close" />
              </button>
            </div>
            <label>
              Name
              <input
                value={edit.name}
                onChange={(e) => setEdit({ ...edit, name: e.target.value })}
                required
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
            <div className="modal-actions">
              <button
                type="button"
                className="secondary-btn"
                onClick={() => setEdit(null)}
              >
                Cancel
              </button>
              <button className="primary-btn">Save category</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
