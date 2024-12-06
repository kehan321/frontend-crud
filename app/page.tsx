"use client";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Home() {
  interface User {
    _id: string;
    name: string;
    age: number;
    email: string;
    phone: string;
    image: string;
  }

  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState("");
  const [age, setAge] = useState<number | "">("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [image, setImage] = useState<File | null>(null); // Store image file
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editAge, setEditAge] = useState<number | "">("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Function to handle the form submission
  const addUser = async () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("age", String(age));
    formData.append("email", email);
    formData.append("phone", phone);
    if (image) {
      formData.append("image", image); // Append the image file to FormData
    }

    try {
      await axios.post("http://localhost:5000/users", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Important for file uploads
        },
      });

      // Reset form
      setName("");
      setAge("");
      setEmail("");
      setPhone("");
      setImage(null); // Reset image state
      fetchUsers(); // Fetch updated list
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  const deleteUser = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5000/users/${id}`);
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const updateUser = async () => {
    try {
      await axios.put(`http://localhost:5000/users/${editId}`, {
        name: editName,
        age: editAge,
        email: editEmail,
        phone: editPhone,
      });
      setEditId(null);
      setEditName("");
      setEditAge("");
      setEditEmail("");
      setEditPhone("");
      fetchUsers();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center", color: "#333" }}>User Manager</h1>
      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          justifyContent: "center",
          gap: "10px",
        }}
      >
        <input
          type="text"
          placeholder="Enter user name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            width: "200px",
          }}
        />
        <input
          type="number"
          placeholder="Enter user age"
          value={age}
          onChange={(e) => setAge(Number(e.target.value))}
          style={{
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            width: "100px",
          }}
        />
        <input
          type="email"
          placeholder="Enter user email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            width: "250px",
          }}
        />
        <input
          type="text"
          placeholder="Enter user phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            width: "150px",
          }}
        />
        <input
          type="file"
          onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
          style={{
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            width: "250px",
          }}
        />
        <button
          onClick={addUser}
          style={{
            padding: "10px 20px",
            borderRadius: "5px",
            backgroundColor: "#28a745",
            color: "#fff",
            border: "none",
          }}
        >
          Add User
        </button>
      </div>

      <ul style={{ listStyleType: "none", padding: 0 }}>
        {users.map((user) => (
          <li
            key={user._id}
            style={{
              marginBottom: "10px",
              border: "1px solid #ccc",
              padding: "10px",
              borderRadius: "5px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <strong>{user.name}</strong> ({user.age} years old, {user.email}, {user.phone})
            </div>
            <div>
              <img
                src={`http://localhost:5000/${user.image}`}
                alt="user"
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                }}
              />

              <button
                onClick={() => deleteUser(user._id)}
                style={{
                  marginLeft: "10px",
                  padding: "5px 10px",
                  borderRadius: "5px",
                  backgroundColor: "#dc3545",
                  color: "#fff",
                  border: "none",
                }}
              >
                Delete
              </button>
              <button
                onClick={() => {
                  setEditId(user._id);
                  setEditName(user.name);
                  setEditAge(user.age);
                  setEditEmail(user.email);
                  setEditPhone(user.phone);
                }}
                style={{
                  marginLeft: "10px",
                  padding: "5px 10px",
                  borderRadius: "5px",
                  backgroundColor: "#007bff",
                  color: "#fff",
                  border: "none",
                }}
              >
                Edit
              </button>
            </div>
          </li>
        ))}
      </ul>

      {editId && (
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <h2>Edit User</h2>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "10px",
            }}
          >
            <input
              type="text"
              placeholder="Edit user name"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              style={{
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                width: "200px",
              }}
            />
            <input
              type="number"
              placeholder="Edit user age"
              value={editAge}
              onChange={(e) => setEditAge(Number(e.target.value))}
              style={{
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                width: "100px",
              }}
            />
            <input
              type="email"
              placeholder="Edit user email"
              value={editEmail}
              onChange={(e) => setEditEmail(e.target.value)}
              style={{
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                width: "250px",
              }}
            />
            <input
              type="text"
              placeholder="Edit user phone"
              value={editPhone}
              onChange={(e) => setEditPhone(e.target.value)}
              style={{
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                width: "150px",
              }}
            />
            <button
              onClick={updateUser}
              style={{
                padding: "10px 20px",
                borderRadius: "5px",
                backgroundColor: "#ffc107",
                color: "#fff",
                border: "none",
              }}
            >
              Update User
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
