import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { getContractInstance } from "@/lib/voting"; // Ensure web3 is initialized
import { Label } from "@radix-ui/react-label";
import { useEffect, useState } from "react";
import Papa from "papaparse";
import type { Voter } from "types/types";
import web3 from "@/lib/web3";

const ImportVoters: React.FC = () => {
	const [file, setFile] = useState<File | null>(null);
	const [voters, setVoters] = useState<Voter[]>([]);
	const [refresh, setRefresh] = useState<boolean>(false);

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files) {
			setFile(event.target.files[0]);
		}
	};

	useEffect(() => {
			const fetchVoters = async () => {
				try {
					const contract = await getContractInstance();
					const voters = await contract.methods.getAllVoters().call();
	
					const parsedVoters = voters.map((voter: any) => ({
						fullName: voter.fullName,
						isRegistered: voter.isRegistered,
						hasVoted: voter.hasVoted,
					}));
	
					setVoters(parsedVoters);
				} catch (err: any) {
					toast({ title: "Σφάλμα", description: err.message, variant: "destructive" });
				}
			};
	
			fetchVoters();
		}, [refresh]);

	const handleFileUpload = async () => {
		if (!file) {
			toast({
				title: "Σφάλμα",
				description: "Παρακαλώ επιλέξτε ένα αρχείο CSV.",
				variant: "destructive",
			});
			return;
		}

		// Parse CSV File
		Papa.parse(file, {
			header: true,
			skipEmptyLines: true,
			complete: async (results) => {
				const csvData = results.data as Array<{ username: string; fullName: string }>;

				const contract = await getContractInstance();
				const registeredVoters: Voter[] = [];
				for (const row of csvData) {
					const { fullName } = row;

					if (!fullName) {
						console.error("Invalid row in CSV:", row);
						continue;
					}

					if(!web3){
						console.error("Web3 not initialized");
						return;
					}

					try {
						// Create new Ethereum address for the voter
						const newAccount =  web3.eth.accounts.create();

						// Register voter on the blockchain
						if (newAccount) {
							const tx = await contract.methods
								.registerVoter(newAccount.address, fullName) // Password hash is the username in this case
								.send({ from: (await web3.eth.getAccounts())[0] }); // Replace with admin address if needed

							registeredVoters.push({
								
								fullName,
								isRegistered: true,
								hasVoted: false,
							});

							console.log(`Voter registered: ${fullName} - Tx: ${tx.transactionHash}`);
						}
					} catch (error: any) {
						console.error(`Failed to register voter ${fullName}:`, error.message);
					}
				}

				setVoters(registeredVoters);
				toast({
					title: "Επιτυχία",
					description: "Οι ψηφοφόροι εγγράφηκαν με επιτυχία.",
					variant: "default",
				});
				setFile(null);
			},
			error: (err) => {
				console.error("CSV Parsing Error:", err.message);
				toast({
					title: "Σφάλμα",
					description: "Αποτυχία ανάγνωσης του αρχείου CSV.",
					variant: "destructive",
				});
			},
		});
	};

	return (
		<div className="flex flex-col gap-6 w-96">
			<Card className="p-4 h-min">
				<div className="space-y-4">
					<h1 className="text-2xl font-semibold">Εισαγωγή Ψηφοφόρων</h1>
					<div className="space-y-2 text-sm">
						<Label htmlFor="file" className="text-sm font-medium">
							Αρχείο
						</Label>
						<Input id="file" type="file" placeholder="Αρχείο" accept=".csv" onChange={handleFileChange} />
					</div>
					<div>
						<Button size="lg" onClick={handleFileUpload}>
							Ανέβασμα
						</Button>
					</div>
				</div>
			</Card>
			<div className="">
				<div className="flex">
					<h1 className="text-2xl font-semibold">Ψηφοφόροι</h1>
					<Button variant={"link"} onClick={() => setRefresh(!refresh)}>
						Ανανέωση
					</Button>
				</div>
				<ul className="pt-2">
					{voters.map((voter, i) => (
						<li key={i} className="list-disc">
							{voter.fullName} - {voter.isRegistered ? "Εγγεγραμμένος" : "Μη Εγγεγραμμένος"}
						</li>
					))}
				</ul>
			</div>
		</div>
	);
};

export default ImportVoters;
