import React from "react";


import { useVoting } from "@/lib/useVoting";
import ResultsOpenVoting from "./results-open-voting";
import ResultsClosedVoting from "./results-closed-voting";


const Results: React.FC = () => {
	const { votingOpen } = useVoting();



	return (votingOpen ? <ResultsOpenVoting /> : <ResultsClosedVoting />
	);
};

export default Results;
