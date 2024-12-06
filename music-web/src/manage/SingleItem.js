const SingleItem = ({record, onDelete, onEdit}) => {
  return (
    <li>
      <button
        onClick={() => onEdit(record)}
      >
        Edit
      </button>
      <span
        style={{
          flex: 1,
          display: 'flex',
          padding: '0 8px'
        }}
      >
        {record.Title} by {record.Artist} ({record.GenreName})
      </span>
      <button
        onClick={() => onDelete(record)}
      >
        Delete
      </button>
    </li>
  );
};

export default SingleItem;
