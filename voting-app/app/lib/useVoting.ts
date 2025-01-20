import { toast } from "@/components/ui/use-toast";
import { useAuth } from "contexts/AuthContext";
import { useState, useEffect } from "react";
import { getContractInstance } from "./voting";
import { set } from "zod";

interface UseVotingProps {
	contract: any;
	account: string;
}

export function useVoting() {
	const [votingOpen, setVotingOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const { isAdmin } = useAuth();

	useEffect(() => {
		fetchVotingState();
	}, []);

	const fetchVotingState = async () => {
		try {
			const contract = await getContractInstance();

			const open = await contract.methods.votingOpen().call();
			setVotingOpen(open);
		} catch (error) {
			toast({
				title: "Σφάλμα",
				description:
					"Σφάλμα κατά την ανάκτηση της κατάστασης ψηφοφορίας",
				variant: "destructive",
			});
		}
	};

	const openVoting = async () => {
		if (!isAdmin) return;
		setIsLoading(true);
		try {
			const contract = await getContractInstance();
			const accounts = await window.ethereum.request({
				method: "eth_requestAccounts",
			});
			const account = accounts[0];
			const gasEstimate = await contract.methods
				.openVoting()
				.estimateGas({ from: account });
			const tx = await contract.methods
				.openVoting()
				.send({ from: account, gasEstimate });
			console.log("Voting opened:", tx);
			await fetchVotingState();
		} catch (error) {
			toast({
				title: "Σφάλμα",
				description: "Σφάλμα κατά το άνοιγμα της ψηφοφορίας",
				variant: "destructive",
			});
		}finally {
			setIsLoading(false);
		}
	};

	const closeVoting = async () => {
		setIsLoading(true);
		if (!isAdmin) return;
		try {
			const contract = await getContractInstance();
			const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
			const account = accounts[0];
			const gasEstimate = await contract.methods
				.closeVoting()
				.estimateGas({ from: account });
			const tx = await contract.methods
				.closeVoting()
				.send({ from: account, gasEstimate });
			console.log("Voting closed:", tx);
			await fetchVotingState();
		} catch (error) {
			toast({
				title: "Σφάλμα",
				description: "Σφάλμα κατά το κλείσιμο της ψηφοφορίας",
				variant: "destructive",
			});
		}finally {
			setIsLoading(false);
		}
	};

	return {
		isLoading,
		votingOpen,
		openVoting,
		closeVoting,
	};
}
