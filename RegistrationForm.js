import React, { useState, useEffect } from 'react';
import './Registration.css';

function SignupForm() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user',
    agreeToTerms: false,
  });

  const [users, setUsers] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/users')
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(error => console.error('Error fetching users:', error));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleEdit = (user) => {
    setFormData({
      username: user.username,
      email: user.email,
      password: '', // leave password blank
      role: user.role,
      agreeToTerms: user.agree_to_terms === 1,
    });
    setEditId(user.id);
    setEditMode(true);
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:5000/api/users/${id}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (response.ok) {
          setUsers(users.filter(user => user.id !== id));
        } else {
          return response.text().then(text => { throw new Error(text); });
        }
      })
      .catch(error => console.error('Error deleting user:', error));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const method = editMode ? 'PUT' : 'POST';
    const url = editMode
      ? `http://localhost:5000/api/users/${editId}`
      : 'http://localhost:5000/api/users';

    fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        agreeToTerms: formData.agreeToTerms ? 1 : 0,
      }),
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          return response.text().then(text => { throw new Error(text); });
        }
      })
      .then(data => {
        if (editMode) {
          setUsers(users.map(user => (user.id === editId ? data : user)));
        } else {
          setUsers([...users, data]);
        }
        setFormData({
          username: '',
          email: '',
          password: '',
          role: 'user',
          agreeToTerms: false,
        });
        setEditMode(false);
      })
      .catch(error => console.error('Error:', error));
  };

  return (
    <div className="form-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <table>
          <tbody>
            <tr>
              <td><label>Username:</label></td>
              <td>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </td>
            </tr>
            <tr>
              <td><label>Email:</label></td>
              <td>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </td>
            </tr>
            <tr>
              <td><label>Password:</label></td>
              <td>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required={!editMode}
                />
              </td>
            </tr>
            <tr>
              <td><label>Role:</label></td>
              <td>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
            </tr>
            <tr>
              <td><label>Agree to Terms:</label></td>
              <td>
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                />
              </td>
            </tr>
            <tr>
              <td colSpan="2">
                <button type="submit">
                  {editMode ? 'Update' : 'Submit'}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </form>

      <div className="user-list">
        <h2>User List</h2>
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>
                  <button onClick={() => handleEdit(user)}>Edit</button>
                  <button onClick={() => handleDelete(user.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SignupForm;
