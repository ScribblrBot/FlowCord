import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ref, onValue, push, serverTimestamp } from "firebase/database";
import { db } from "../../lib/firebase";

export default function DMPage() {
  const router = useRouter();
  const { dmId } = router.query;

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const username = "User"; // Replace with actual user after login

  useEffect(() => {
    if (!dmId) return;
    const messagesRef = ref(db, `dms/${dmId}`);
    onValue(messagesRef, (snapshot) => {
      const data = snapshot.val() || {};
      const msgs = Object.keys(data).map((key) => ({ id: key, ...data[key] }));
      setMessages(msgs);
    });
  }, [dmId]);

  const sendMessage = () => {
    if (!input) return;
    push(ref(db, `dms/${dmId}`), {
      user: username,
      text: input,
      timestamp: serverTimestamp()
    });
    setInput("");
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((m) => (
          <div key={m.id} className="p-2 bg-gray-800 rounded">
            <b>{m.user}:</b> {m.text}
          </div>
        ))}
      </div>
      <div className="p-4 flex space-x-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-2 rounded bg-gray-700 text-white"
        />
        <button onClick={sendMessage} className="bg-blue-600 px-4 rounded">Send</button>
      </div>
    </div>
  );
}
