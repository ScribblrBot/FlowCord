import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ref, onValue, push, update, serverTimestamp } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../../lib/firebase";

export default function DMPage() {
  const router = useRouter();
  const { dmId } = router.query;
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);

  // Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (!u) router.push("/login");
      else {
        setUser(u);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Calculate deterministic DM ID
  const getDMId = () => {
    if (!user || !dmId) return null;
    return [user.uid, dmId].sort().join("_");
  };

  // Listen to messages in this DM
  useEffect(() => {
    const id = getDMId();
    if (!id) return;

    const messagesRef = ref(db, `dms/${id}`);
    const unsubscribeMessages = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val() || {};
      const msgs = Object.keys(data).map((key) => ({ id: key, ...data[key] }));
      setMessages(msgs);
    });

    return () => unsubscribeMessages();
  }, [user, dmId]);

  // Send a message
  const sendMessage = () => {
    const id = getDMId();
    if (!id || !input) return;

    // Push message
    push(ref(db, `dms/${id}`), {
      user: user.displayName || user.email,
      text: input,
      timestamp: serverTimestamp(),
    });

    // Add each user to the other's DM list
    update(ref(db, `users/${user.uid}/dms`), { [dmId]: true });
    update(ref(db, `users/${dmId}/dms`), { [user.uid]: true });

    setInput("");
  };

  if (loading) return <p className="text-white text-center mt-20">Loading...</p>;

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`p-2 rounded ${
              m.user === (user.displayName || user.email)
                ? "bg-blue-600 text-white self-end"
                : "bg-gray-800 text-white self-start"
            }`}
          >
            <b>{m.user}:</b> {m.text}
          </div>
        ))}
      </div>
      <div className="p-4 flex space-x-2 bg-gray-800">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-2 rounded bg-gray-700 text-white"
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage} className="bg-blue-600 px-4 py-2 rounded">
          Send
        </button>
      </div>
    </div>
  );
}
