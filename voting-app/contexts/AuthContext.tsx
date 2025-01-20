import { getContractInstance } from "@/lib/voting";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";

const ADMIN_USERNAME = import.meta.env.VITE_ADMIN_USERNAME
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD
// Define the shape of the AuthContext
interface AuthContextType {
	user: User | null;
	isLoading: boolean;
	isAuthenticated: boolean;
	isAdmin: boolean;
	login: (username?: string, password?: string) => Promise<string>;
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
	const [isLoading, setIsLoading] = useState(true)

	const isAuthenticated = !!user;


	const [isAdmin, setIsAdmin] = useState<boolean>(false);


	useEffect(() => {
		setIsLoading(true);
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
		setIsLoading(false);

	}, []);

	useEffect(() => {
		setIsLoading(true);
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
		setIsLoading(false);
	}, [user]);



	const logout = () => {
		try {

			localStorage.removeItem("authUser");
			localStorage.removeItem("isAdmin");
			setUser(null);
			setIsAdmin(false);
		} catch (err) {
			console.error(err);
		}
	}

	const login = async (username?: string, password?: string) => {
		try {
			const contract = await getContractInstance();
			const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
			const currentAccount = accounts[0];
			
			const userType = await contract.methods
				.authenticate()
				.call({ from: currentAccount});
			console.log(userType)
			if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {

				if (userType === "UNREGISTERED") {
					const gasEstimate = await contract.methods
						.registerAdmin()
						.estimateGas({ from: currentAccount });
					await contract.methods
						.registerAdmin()
						.send({ from: currentAccount, gasEstimate });
				}
				setUser({ username: ADMIN_USERNAME, fullName: "Admin" });
				setIsAdmin(true);
				return "ADMIN";
			} else {

				if (userType === "ADMIN") {
					setUser({ username: ADMIN_USERNAME, fullName: "Admin" });
					setIsAdmin(true);
					return "ADMIN";
				} else if (userType === "VOTER") {
					const voter = await contract.methods.getVoter().call({ from: currentAccount });
					console.log(voter)
					if (voter[1] === false) {
						return "UNREGISTERED";
					}
					console.log(voter)
					setUser({ username: voter[0], fullName: voter[0] });
					setIsAdmin(false);
					return "VOTER";
				}else {
					return "UNREGISTERED";
				}

			}
		}
		catch (err) {
			console.error(err);
			return "UNREGISTERED";
		}



		// Simulate an API call

	};


	return (
		<AuthContext.Provider value={{ user, isAuthenticated, isAdmin, login, logout, isLoading }}>
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
