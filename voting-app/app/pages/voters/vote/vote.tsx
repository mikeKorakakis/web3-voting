import React, { use, useEffect, useState } from "react";
import web3 from "@/lib/web3";
import { getContractInstance } from "@/lib/voting";
import { Button } from "@/components/ui/button";
import { useAuth } from "contexts/AuthContext";
import CandidatesList from "./candidates-list";
import { toast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { useVoting } from "@/lib/useVoting";

type Candidate = {
	id: string;
	name: string;
	voteCount: string;
};

const App: React.FC = () => {
	const [selectedCandidates, setSelectedCandidates] = useState<number[]>([]);
	const [message, setMessage] = useState<string>("");
	const { votingOpen } = useVoting();
	const [refresh, setRefresh] = useState<boolean>(false);
	const [voter, setVoter] = useState<any>();

	useEffect(() => {
		const fetchVoter = async () => {
			const contract = await getContractInstance();
			const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
			const account = accounts[0];
			const voter = await contract.methods.getVoter().call({ from: account });
			setVoter(voter);
			
		};

		fetchVoter();
	}, []);

	

	

	useEffect(() => {
		const fetchCandidates = async () => {
			const contract = await getContractInstance();
			const candidatesCount = await contract.methods.candidatesCount().call();
			const candidatesList: Candidate[] = [];

			for (let i = 1; i <= candidatesCount; i++) {
				const candidate = await contract.methods.getCandidate(i).call();
				candidatesList.push({
					id: candidate[0],
					name: candidate[1],
					voteCount: candidate[2],
				});
			}
		};

		fetchCandidates();
	}, []);

	const handleVote = async () => {
		const contract = await getContractInstance();
		const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
		const account = accounts[0];

		// const voter = await contract.methods.getVoter(account).call();
		// if (voter[2]) {
		// 	
		// 	toast({ title: "Σφάλμα", description: "Έχετε ψηφίσει ήδη.", variant: "destructive" });
		// 	return;
		// }

		setMessage("Καταχωρούμε την ψήφο σας...");

		try {
			const gasEstimate = await contract.methods.vote(selectedCandidates).estimateGas({ from: account });
			const tx = await contract.methods.vote(selectedCandidates).send({ from: account, gasEstimate });

			toast({ title: "Επιτυχία", description: "Η ψήφος σας καταχωρήθηκε.", variant: "default" });
			setMessage("Η ψήφος σας καταχωρήθηκε.");
		}
		catch (error) {
			if (error instanceof Error)
				setMessage(error.message);
		}


	};
	const hasVoted = voter && voter[2];
	const votedIds = voter && voter[3] ? voter[3].map((id: string) => parseInt(id)) : [];

	return (
		<div className="container mx-auto p-4">
			<div className="w-full flex  flex-col items-center pb-4">
				<Card className='p-4 h-min w-96 text-center'>
					<span className='text-lg w-full text-center font-semibold'>
						{votingOpen ? "H ψηφοφορία έχει αρχίσει" : "Η ψηφοφορία δεν έχει αρχίσει"}
					</span>
				</Card>
				<h1 className="text-2xl font-bold">Ψηφίστε</h1>



				{/* <h2 className="mt-6 text-xl font-semibold">Επιλέξτε έναν υποψήφιο</h2>
			<div className="mt-2">
				<select
					className="border rounded-md p-2 w-full"
					onChange={(e) => setSelectedCandidate(e.target.value)}
				>
					<option value="">Επιλέξτε έναν υποψήφιο</option>
					{candidates.map((candidate) => (
						<option key={candidate.id} value={candidate.id}>
							{candidate.name}
						</option>
					))}
				</select>
			</div> */}
				{!hasVoted ? <Button className="mt-4" onClick={handleVote} disabled={!votingOpen || hasVoted}>
					Καταχωρίστε την ψήφο σας
				</Button> : <p className="mt-4 text-red-500">Έχετε ψηφίσει ήδη</p>}
				{message && <p className="mt-4 text-red-500">{message}</p>}
			</div>

			<CandidatesList refresh={refresh} setRefresh={setRefresh} selectedCandidates={hasVoted ? votedIds : selectedCandidates} setSelectedCandidates={setSelectedCandidates} disabled={!votingOpen || hasVoted}/>
		</div>
	);
};

export default App;
