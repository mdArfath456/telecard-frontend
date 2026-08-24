import React, { useEffect, useState } from "react";
import { adminApi } from "../../api/client";
import { datetime, apiError } from "../../utils/helpers";
import StatusBadge from "../../components/StatusBadge";
import Icon from "../../components/Icon";
export default function AdminUsers() {
  const [u, setU] = useState([]);
  const load = () => adminApi.users().then((r) => setU(r.data));
  useEffect(() => {
    load();
  }, []);
  const act = async (fn) => {
    try {
      await fn();
      load();
    } catch (e) {
      alert(apiError(e));
    }
  };
  return (
    <div>
      <div className="admin-page-head">
        <div>
          <span className="eyebrow">People</span>
          <h1>Users</h1>
          <p>Control customer access and roles.</p>
        </div>
      </div>
      <div className="table-panel">
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Status</th>
              <th>Joined</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {u.map((x) => (
              <tr key={x.id}>
                <td>
                  <div className="table-user">
                    <div className="avatar">
                      {(x.name || "U").slice(0, 1).toUpperCase()}
                    </div>
                    <div>
                      <b>{x.name}</b>
                      <span>{x.email}</span>
                    </div>
                  </div>
                </td>
                <td>{x.phone}</td>
                <td>
                  <select
                    className="status-select"
                    value={x.role}
                    onChange={(e) =>
                      act(() => adminApi.role(x.id, e.target.value))
                    }
                  >
                    <option value="USER">USER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </td>
                <td>
                  <StatusBadge value={x.status} />
                </td>
                <td>{datetime(x.createdAt)}</td>
                <td>
                  <div className="row-actions">
                    {x.role !== "ADMIN" && (
                      <>
                        {x.enabled ? (
                          <button
                            title="Block"
                            onClick={() => act(() => adminApi.block(x.id))}
                          >
                            <Icon name="lock" size={15} />
                          </button>
                        ) : (
                          <button
                            title="Activate"
                            onClick={() => act(() => adminApi.activate(x.id))}
                          >
                            <Icon name="check" size={15} />
                          </button>
                        )}
                        <button
                          title="Promote"
                          onClick={() =>
                            act(() => adminApi.role(x.id, "ADMIN"))
                          }
                        >
                          <Icon name="shield" size={15} />
                        </button>
                        <button
                          title="Delete"
                          onClick={() => {
                            if (confirm("Delete user?"))
                              act(() => adminApi.remove(x.id));
                          }}
                        >
                          <Icon name="trash" size={15} />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
