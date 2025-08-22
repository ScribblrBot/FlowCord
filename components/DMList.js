import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "../lib/firebase";

export default function DMList({ selectDM }) {
  const [dms, setDMs] = useState([]);

  useEffect(() => {
    const dmsRef = ref(db, "users"); // each user has DMs stored here
    onValue(dmsRef, (snapshot) => {
      const data = snapshot.val() || {};
      const dmArray = Object.keys(data).map((key) => ({ id: key, name: data[key].username }));
      setDMs(dmArray);
    });
  }, []);

  return (
    <div>
      {dms.map((dm) => (
        <button key={dm.id} onClick={() => selectDM(dm.id)} className="block p-2 hover:bg-gray-700 rounded">
          {dm.name}
        </button>
      ))}
    </div>
  );
}
