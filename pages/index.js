import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { ref, onValue } from "firebase/database";
import { useRouter } from "next/router";
import { auth, db } from "../lib/firebase";
import Sidebar from "../components/Sidebar";

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [dms, setDMs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for login state
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (!u) {
        router.push("/login"); // Redirect to login if not signed in
      } else {
        setUser(u);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;

    // Listen for the user's DM list
    const dmsRef = ref(db, `users/${user.uid}/dms`);
    const unsubscribeDMs = onValue(dmsRef, (snapshot) => {
      const data = snapshot.val() || {};
      const dmArray = Object.keys(data).map((uid) => ({
        id: uid,
        name: data[uid].username || uid // Optional: store username in DM node
      }));
      setDMs(dmArray);
    });

    return () => unsubscribeDMs();
  }, [user]);

  const selectDM = (dmId) => {
    router.push(`/dm/${dmId}`);
  };

  if (loading) return <p className="text-white text-center mt-20">Loading...</p>;

  return (
    <div className="flex h-screen">
      <Sidebar dms={dms} selectDM={selectDM} />
      <div className="flex-1 p-6 bg-gray-900 flex items-center justify-center">
        {dms.length > 0 ? (
          <p className="text-white">Select a DM from the sidebar to start chatting</p>
        ) : (
          <p className="text-gray-400">No DMs yet. Start chatting with users!</p>
        )}
      </div>
    </div>
  );
}
