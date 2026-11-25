import { useEffect, useState } from "react";
import { Mail, MailOpen, Trash2, RefreshCw, Search, X } from "lucide-react";

const API = "http://localhost:8001/api/messages.php";

export default function MessagesManagement() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  const loadMessages = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(API, { credentials: "include" });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || "Could not load messages.");
      setMessages(Array.isArray(result.data) ? result.data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadMessages(); }, []);

  const updateStatus = async (item) => {
    try {
      const response = await fetch(API, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: Number(item.id), is_read: Number(item.is_read) ? 0 : 1 })
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message);
      if (selected?.id === item.id) setSelected({ ...selected, is_read: Number(item.is_read) ? 0 : 1 });
      await loadMessages();
    } catch (err) { setError(err.message || "Could not update message."); }
  };

  const deleteMessage = async (item) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;
    try {
      const response = await fetch(API, {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: Number(item.id) })
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message);
      setSelected(null);
      await loadMessages();
    } catch (err) { setError(err.message || "Could not delete message."); }
  };

  const filtered = messages.filter((item) =>
    [item.name, item.email, item.subject, item.message]
      .some((value) => String(value || "").toLowerCase().includes(search.toLowerCase()))
  );
  const unread = messages.filter((item) => Number(item.is_read) === 0).length;

  return (
    <div className="sh-content">
      <div className="sh-messages-head">
        <div>
          <h2>Messages</h2>
          <p>Messages received from your website contact form.</p>
        </div>
        <button type="button" onClick={loadMessages} className="sh-messages-refresh">
          <RefreshCw size={17} /> Refresh
        </button>
      </div>

      <div className="sh-messages-stats">
        <div><strong>{messages.length}</strong><span>Total Messages</span></div>
        <div><strong>{unread}</strong><span>Unread Messages</span></div>
        <div><strong>{messages.length - unread}</strong><span>Read Messages</span></div>
      </div>

      <div className="sh-messages-search">
        <Search size={18} />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, email or message..." />
      </div>

      {error && <div className="sh-messages-error">{error}</div>}
      {loading ? <p className="sh-messages-empty">Loading messages...</p> :
        filtered.length === 0 ? <p className="sh-messages-empty">No messages found.</p> : (
          <div className="sh-messages-list">
            {filtered.map((item) => (
              <article className={`sh-message-card ${Number(item.is_read) === 0 ? "unread" : ""}`} key={item.id}>
                <div className="sh-message-main" onClick={() => setSelected(item)}>
                  <div className="sh-message-icon">{Number(item.is_read) === 0 ? <Mail size={20} /> : <MailOpen size={20} />}</div>
                  <div className="sh-message-info">
                    <div className="sh-message-title">
                      <strong>{item.name}</strong>
                      {Number(item.is_read) === 0 && <span>NEW</span>}
                    </div>
                    <small>{item.email} · {item.subject || "No subject"}</small>
                    <p>{item.message}</p>
                    <time>{item.created_at}</time>
                  </div>
                </div>
                <div className="sh-message-actions">
                  <button type="button" title="Read / Unread" onClick={() => updateStatus(item)}>
                    {Number(item.is_read) === 0 ? <MailOpen size={17} /> : <Mail size={17} />}
                  </button>
                  <button type="button" title="Delete" onClick={() => deleteMessage(item)}><Trash2 size={17} /></button>
                </div>
              </article>
            ))}
          </div>
        )
      }

      {selected && (
        <div className="sh-message-overlay" onClick={() => setSelected(null)}>
          <div className="sh-message-modal" onClick={(e) => e.stopPropagation()}>
            <button className="sh-message-close" onClick={() => setSelected(null)} type="button"><X size={20} /></button>
            <h2>{selected.subject || "Message from visitor"}</h2>
            <p><strong>From:</strong> {selected.name}</p>
            <p><strong>Email:</strong> {selected.email}</p>
            <p><strong>Date:</strong> {selected.created_at}</p>
            <div className="sh-message-body">{selected.message}</div>
            <div className="sh-message-modal-actions">
              <button type="button" onClick={() => updateStatus(selected)}>
                {Number(selected.is_read) === 0 ? "Mark as Read" : "Mark as Unread"}
              </button>
              <a href={`mailto:${encodeURIComponent(selected.email)}?subject=${encodeURIComponent("Re: " + (selected.subject || "Your message"))}`}>Reply by Email</a>
              <button type="button" onClick={() => deleteMessage(selected)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
