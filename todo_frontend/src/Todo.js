import { useEffect, useState } from "react";

export default function Todo() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const apiUrl = "http://localhost:8000";

  const handleSubmit = () => {
    setError("");
    if (title.trim() !== "" && description.trim() !== "") {
      fetch(`${apiUrl}/todos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description }),
      })
        .then((res) => {
          if (res.ok) {
            setTitle("");
            setDescription("");
            getItems();
            setMessage("Item added successfully");
            setTimeout(() => {
              setMessage("");
            }, 3000);
          } else {
            setError("Unable to create ToDo item");
          }
        })
        .catch(() => {
          setError("Unable to create ToDo item");
        });
    }
  };

  useEffect(() => {
    getItems();
  }, []);

  const getItems = () => {
    fetch(`${apiUrl}/todos`)
      .then((res) => res.json())
      .then((res) => {
        setTodos(res);
      });
  };

  const handleUpdate = () => {
    if (editTitle.trim() !== "" && editDescription.trim() !== "") {
      fetch(`${apiUrl}/todos/${editId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: editTitle, description: editDescription }),
      })
        .then((res) => {
          if (res.ok) {
            setEditId(null);
            setEditTitle("");
            setEditDescription("");
            getItems();
          } else {
            setError("Unable to update ToDo item");
          }
        })
        .catch(() => {
          setError("Unable to update ToDo item");
        });
    }
  };

  const handleEdit = (item) => {
    setEditId(item._id);
    setEditTitle(item.title);
    setEditDescription(item.description);
  };

  const handleEditCancel = () => {
    setEditId(null);
    setEditTitle("");
    setEditDescription("");
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      fetch(`${apiUrl}/todos/${id}`, {
        method: "DELETE",
      }).then(() => {
        getItems();
      });
    }
  };

  return (
    <div className="container py-5 ">
      <div className="card shadow">
        <div className="card-header bg-primary text-white">
          <h3 className="mb-0 text-center">ToDo Iist Project with MERN</h3>
        </div>
        <div className="card-body">
          <h5 className="card-title">Add New Task</h5>
          {message && <div className="alert alert-success">{message}</div>}
          {error && <div className="alert alert-danger">{error}</div>}
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <input
              type="text"
              className="form-control"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <button className="btn btn-success" onClick={handleSubmit}>
              Add
            </button>
          </div>
          <h5 className="card-title mt-4">Tasks</h5>
          <ul className="list-group">
            {todos.map((item) => (
              <li
                key={item._id}
                className="list-group-item d-flex justify-content-between align-items-start bg-light mb-2 rounded"
              >
                {editId === item._id ? (
                  <div className="w-100">
                    <div className="input-group mb-2">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Title"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                      />
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Description"
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                      />
                    </div>
                    <div className="d-flex justify-content-end">
                      <button className="btn btn-primary me-2" onClick={handleUpdate}>
                        Update
                      </button>
                      <button className="btn btn-secondary" onClick={handleEditCancel}>
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div>
                      <h6 className="mb-1">{item.title}</h6>
                      <p className="mb-1">{item.description}</p>
                    </div>
                    <div>
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => handleEdit(item)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(item._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
