export default function Sidebar({ dms, selectDM }) {
  return (
    <div className="w-64 bg-gray-800 h-screen p-4 space-y-2">
      <h2 className="text-xl font-bold mb-4">Flowcord</h2>
      {dms.map((dm) => (
        <button
          key={dm.id}
          onClick={() => selectDM(dm.id)}
          className="block w-full text-left p-2 hover:bg-gray-700 rounded"
        >
          {dm.name}
        </button>
      ))}
    </div>
  );
}
