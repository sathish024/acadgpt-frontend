import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const handleDemoAccess = () => {
  navigate("/AcadifyInterface"); // or your dashboard route
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem(
          "token",
          data.token
        );

        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );

        navigate("/AcadifyInterface");
      } else {
        setError(
          data.message ||
            "Invalid Email or Password"
        );
      }
    } catch (err) {
      setError(
        "Unable to connect to server"
      );
    }

    setLoading(false);
  };

  return (
    <div className="login-container">
      {/* LEFT SECTION */}

      <div className="left-panel">

        <div className="logo-badge">
          🎓 Academic Intelligence Platform
        </div>

        <h1>
          AcadGPT
        </h1>

        <h3>
          Controlled Academic Knowledge
          Retrieval System
        </h3>

        <p>
          A centralized academic portal
          where colleges securely upload
          books, notes, attendance,
          semester marks, question papers,
          unit materials and official
          documents.
        </p>

        <div className="feature-grid">

          <div className="feature-box">
            <span>📚</span>
            <div>
              <h4>Academic Library</h4>
              <p>
                Books, PDFs, Notes &
                Learning Resources
              </p>
            </div>
          </div>

          <div className="feature-box">
            <span>🤖</span>
            <div>
              <h4>AcadGPT Assistant</h4>
              <p>
                AI responses based on
                college uploaded content
              </p>
            </div>
          </div>

          <div className="feature-box">
            <span>📄</span>
            <div>
              <h4>Previous Papers</h4>
              <p>
                Access semester &
                university question papers
              </p>
            </div>
          </div>

          <div className="feature-box">
            <span>🎓</span>
            <div>
              <h4>Student Analytics</h4>
              <p>
                Attendance, Marks &
                Academic Performance
              </p>
            </div>
          </div>

        </div>

        <div className="bottom-note">
          Trusted academic data. Secure
          access. AI-powered learning.
        </div>
      </div>

      {/* LOGIN CARD */}

      <div className="login-card">

        <div className="card-top">
          <div className="login-icon">
            🎓
          </div>

          <h2>Welcome Back</h2>

          <p className="subtitle">
            Sign in using your college
            credentials
          </p>
        </div>

        <form onSubmit={handleLogin}>

          <label>
            College Email Address
          </label>

          <input
            type="email"
            placeholder="student@college.edu"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            required
          />

          <label>
            Password
          </label>

          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            required
          />

          {error && (
            <div className="error">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Authenticating..."
              : "Access AcadGPT"}
          </button>
          <div className="auth-divider">
  <span>OR</span>
</div>

          <button
className="demo-access-btn"
onClick={handleDemoAccess}>

<span className="demo-icon">✨</span>
Explore Demo
</button>

<p className="demo-note">
  No login required • Portfolio demonstration
</p>
        </form>

        <div className="security-note">
          🔒 Access restricted to
          authorized students, faculty
          and administrators.
        </div>

      </div>
    </div>
  );
}