import React, { useEffect, useState } from "react";
import web3 from "@/lib/web3";
import { getContractInstance } from "@/lib/voting";
import { Button } from "@/components/ui/button";
import { useAuth } from "contexts/AuthContext";
import CandidatesList from "@/routes/common/candidates-list";
import { toast } from "@/components/ui/use-toast";

type Candidate = {
	id: string;
	name: string;
	voteCount: string;
};

const App: React.FC = () => {
	const [selectedCandidates, setSelectedCandidates] = useState<number[]>([]);
	const [message, setMessage] = useState<string>("");
	// const [contract, setContract] = useState<any>(null);
	const [refresh, setRefresh] = useState<boolean>(false);

	useEffect(() => {
		const fetchCandidates = async () => {
			const contract = await getContractInstance();
			// setContract(contract);
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

		const voter = await contract.methods.getVoter(account).call();
		if (voter[2]) {
			setMessage("Έχετε ψηφίσει ήδη.");
			toast({ title: "Σφάλμα", description: "Έχετε ψηφίσει ήδη.", variant: "destructive" });
			return;
		}

		setMessage("Καταχωρούμε την ψήφο σας...");

		try {
			const tx = await contract.methods.vote(selectedCandidates).send({ from: account });

			toast({ title: "Επιτυχία", description: "Η ψήφος σας καταχωρήθηκε.", variant: "default" });
			setMessage("Η ψήφος σας καταχωρήθηκε.");
		}
		catch (error) {
			if (error instanceof Error)
				setMessage(error.message);
		}


	};

	return (
		<div className="container mx-auto p-4">
			<div className="w-full flex  flex-col items-center pb-4">
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

				<Button className="mt-4" onClick={handleVote}>
					Καταχωρίστε την ψήφο σας
				</Button>
				{message && <p className="mt-4 text-red-500">{message}</p>}
			</div>

			<CandidatesList refresh={refresh} setRefresh={setRefresh} selectedCandidates={selectedCandidates} setSelectedCandidates={setSelectedCandidates} />
		</div>
	);
};

export default App;
