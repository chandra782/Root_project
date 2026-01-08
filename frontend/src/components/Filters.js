const Filters = ({ setStatus, setPriority }) => {
  return (
    <div className="flex gap-4 mb-4">
      <select className="border p-2" onChange={(e) => setStatus(e.target.value)}>
        <option value="">All Status</option>
        <option value="pending">Pending</option>
        <option value="running">Running</option>
        <option value="completed">Completed</option>
      </select>

      <select className="border p-2" onChange={(e) => setPriority(e.target.value)}>
        <option value="">All Priority</option>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>
    </div>
  );
};

export default Filters;
