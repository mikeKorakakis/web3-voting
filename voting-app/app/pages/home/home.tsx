import React, { useEffect } from "react";
import { useNavigate } from "react-router";

const App: React.FC = () => {
	const navigate = useNavigate();

	useEffect(() => {
		navigate('/results')
	}, []);

	return (<></>);
};

export default App;
