import React, { useState } from "react";
import { login } from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { TbMail } from "react-icons/tb";
import { TbLock } from "react-icons/tb";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await dispatch(login(email, password));
    if (data) {
      setErrors(data);
    } else {
        closeModal()
    }
  };

  return (
    <>
      <form className="login__form" onSubmit={handleSubmit}>
        <h1 id="login">LOG IN</h1>
        <ul>
          {errors.map((error, idx) => (
            <li key={idx}>{error}</li>
          ))}
        </ul>
        <label>
          Email
          <div className="login__icon-input">
            <TbMail/>
            <input
              className="login__input"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter Email"
            />
          </div>
        </label>
        <label>
          Password
          <div className="login__icon-input">
            <TbLock/>
            <input
              className="login__input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter Password"
            />
          </div>
        </label>
        <button type="submit">Log In</button>
      </form>
    </>
  );
}

export default LoginFormModal;
