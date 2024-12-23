import { getContractInstance } from "@/lib/voting";
import React, { createContext, useContext, useEffect, useState } from "react";
import { set } from "react-hook-form";
import { useNavigate } from "react-router";

const ADMIN_USERNAME = import.meta.env.VITE_ADMIN_USERNAME
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD
// Define the shape of the AuthContext
interface AuthContextType {
	user: User | null;
	isAuthenticated: boolean;
	isAdmin: boolean;
	login: (username?: string, password?: string) => Promise<boolean>;
	logout: () => void;
}

// Define the User type
interface User {
	username: string;
	fullName: string;
}

// Create the AuthContext with default values
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component to wrap the app
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [user, setUser] = useState<User | null>(null);
	const navigate = useNavigate();

	const isAuthenticated = !!user;


	const [isAdmin, setIsAdmin] = useState<boolean>(false);


	useEffect(() => {

		const savedUser = localStorage.getItem("authUser");
		if (savedUser) {
			JSON.parse(savedUser) as User | null;
			setUser(JSON.parse(savedUser));
		}
		const savedIsAdmin = localStorage.getItem("isAdmin");
		if (savedIsAdmin) {
			setIsAdmin(JSON.parse(savedIsAdmin
			));
		}

	}, []);

	useEffect(() => {
		if (user) {
			localStorage.setItem("authUser", JSON.stringify(user));
			if (user.username === ADMIN_USERNAME) {
				setIsAdmin(true);
				localStorage.setItem("isAdmin", JSON.stringify(true));
			}
		} else {
			localStorage.removeItem("authUser");
			localStorage.removeItem("isAdmin");
		}
	}, [user]);

	let count = 0;
	useEffect(() => {
		if (!isAuthenticated && count === 1) {
			navigate('/signin')
			count++
		}

	}, [isAuthenticated])

	const logout = () => {
		try {

			localStorage.removeItem("authUser");
			localStorage.removeItem("isAdmin");
			// setUser(null);
			setIsAdmin(false);
			window.location.reload();
		}catch(err){
			console.error(err);
		}
	}

	const login = async (username?: string, password?: string) => {
		try{
		if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
			setUser({ username: ADMIN_USERNAME, fullName: "Admin" });
			setIsAdmin(true);
			return true;
		} else {
			const contract = await getContractInstance();
			const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
			const currentAccount = accounts[0];

			await contract.methods
				.authenticateVoter()
				.send({ from: currentAccount });

			const voter = await contract.methods.getVoter(currentAccount).call();
			setUser({ username: voter[0], fullName: voter[0] });
			setIsAdmin(false);
			return true;
			
		}}
		catch (err) {
			console.error(err);
			return false
		}



		// Simulate an API call

	};


	return (
		<AuthContext.Provider value={{ user, isAuthenticated, isAdmin, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

// Custom hook to use the AuthContext
export const useAuth = (): AuthContextType => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
