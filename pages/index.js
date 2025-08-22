import { useState } from "react";
import Sidebar from "../components/Sidebar";
import DMList from "../components/DMList";

export default function Home() {
  const [selectedDM, setSelectedDM] = useState(null);

  return (
    <div className="flex h-screen">
      <Sidebar dms={[]} selectDM={setSelectedDM} />
      <div className="flex-1 flex flex-col">
        <h1 className="text-2xl p-4">Flowcord DMs</h1>
        <div className="flex">
          <div className="w-64 bg-gray-800 h-screen p-4">
            <DMList selectDM={setSelectedDM} />
          </div>
          <div className="flex-1 p-4">
            {selectedDM ? (
              <p>Showing chat with <b>{selectedDM}</b></p>
            ) : (
              <p>Select a DM to start chatting</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
