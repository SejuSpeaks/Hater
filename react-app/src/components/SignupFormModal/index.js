import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { signUp } from "../../store/session";
import { TbUser } from "react-icons/tb";
import { TbMail } from "react-icons/tb";
import { TbLock } from "react-icons/tb";
import { TbLockCheck } from "react-icons/tb";
import "./SignupForm.css";

function SignupFormModal() {
	const dispatch = useDispatch();
	const [email, setEmail] = useState("");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [errors, setErrors] = useState([]);
	const { closeModal } = useModal();

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (password === confirmPassword) {
			const data = await dispatch(signUp(username, email, password));
			if (data) {
				setErrors(data);
			} else {
				closeModal();
			}
		} else {
			setErrors([
				"Confirm Password field must be the same as the Password field",
			]);
		}
	};

	return (
		<>
			<form className="signup__form" onSubmit={handleSubmit}>
				<h1 id="signup">SIGN UP</h1>
				<ul>
					{errors.map((error, idx) => (
						<li key={idx}>{error}</li>
					))}
				</ul>
				<label>
					Email
					<div className="signup__icon-input">
						<TbMail/>
						<input
							className="signup__input"
							type="text"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
							placeholder="Enter Email"
						/>
					</div>
				</label>
				<label>
					Username
					<div className="signup__icon-input">
						<TbUser/>
						<input
							className="signup__input"
							type="text"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							required
							placeholder="Enter Username"
						/>
					</div>
				</label>
				<label>
					Password
					<div className="signup__icon-input">
						<TbLock/>
						<input
							className="signup__input"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
							placeholder="Enter Password"
						/>
					</div>
				</label>
				<label>
					Confirm Password
					<div className="signup__icon-input">
						<TbLockCheck/>
						<input
							className="signup__input"
							type="password"
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							required
							placeholder="Re-enter Password"
						/>
					</div>
				</label>
				<button type="submit">Sign Up</button>
			</form>
		</>
	);
}

export default SignupFormModal;
