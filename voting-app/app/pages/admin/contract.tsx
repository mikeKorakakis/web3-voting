import React, { useEffect, useState } from "react";
import VotingContract from "../../../contracts/Voting.json"; // Replace with your ABI JSON
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/components/ui/use-toast";
import { getContractInstance } from "@/lib/voting";




const Contract: React.FC = () => {
	const [contractAddress, setContractAddress] = useState<string | null>(null);
	const [contractInfo, setContractInfo] = useState<any>(null);

	const { toast } = useToast();

	useEffect(() => {
		const contractInstance = VotingContract;
		setContractInfo(contractInstance);
		const getContractAddress = async () => {
			const contract = await getContractInstance();
			const contractAddress = contract.options.address;
			setContractAddress(contractAddress);
		}
		getContractAddress();
	}, []);




	// const deployContract = async () => {
	// 	try {
	// 		// Check for MetaMask
	// 		if (!window.ethereum) {
	// 			throw new Error("MetaMask is not installed.");
	// 		}

	// 		const web3 = new Web3(window.ethereum);

	// 		// Get accounts
	// 		const accounts = await web3.eth.requestAccounts();
	// 		const account = accounts[0];

	// 		// Create contract instance
	// 		const contract = new web3.eth.Contract(VotingContract.abi);

	// 		// Deploy contract
	// 		const deployedContract = await contract
	// 			.deploy({
	// 				data: VotingContract.bytecode,
	// 			})
	// 			.send({
	// 				from: account,
	// 				gas: "3000000",
	// 			});

	// 		const deployedContractAddress = deployedContract.options.address;
	// 		deployedContractAddress && setContractAddress(deployedContractAddress);

	// 		const contractInfo = {
	// 			address: deployedContractAddress,
	// 			abi: VotingContract.abi,
	// 		};

	// 		await saveContractInfo(contractInfo);
	// 		toast({
	// 			title: "Eπιτυχία",
	// 			description: "Το contract ανέβηκε επιτυχώς",
	// 			variant: "default"
	// 		});


	// 	} catch (err: any) {
	// 		toast({
	// 			title: "Σφάλμα",
	// 			description: "Κάτι πήγε στραβά",
	// 			variant: "destructive"
	// 		});
	// 	}
	// };

	return (
		<div >
			{contractInfo && (
				<div className="prose pb-4 max-w-[800px]">
					<h2 className="font-bold text-xl pb-2 ">Πληροφορίες Contract</h2>
					<div className="grid grid-cols-2 w-fit">
						<span className="font-bold">Διεύθυνση: </span> <span className="break-all  whitespace-pre-wrap ">{contractAddress}</span>

						<span className="font-bold pt-4">ABI:</span> <Accordion type="single" collapsible >
							<AccordionItem value="item-1">
								<AccordionTrigger>Προβολή ABI</AccordionTrigger>
								<AccordionContent>
									<pre className="break-all  whitespace-pre-wrap ">
										{JSON.stringify(contractInfo.abi, null, 2)}
									</pre>
								</AccordionContent>
							</AccordionItem>

						</Accordion>

					</div>
				</div>
			)}

			{/* <Button onClick={deployContract}>Ανεβάστε {contractInfo && "ξανά"} το contract της ψηφοφορίας</Button> */}


	
			<div>
				<Accordion type="single" collapsible className=" w-[800px] mt-4">
					<AccordionItem value="item-1">
						<AccordionTrigger>Προβολή Contract</AccordionTrigger>
						<AccordionContent>
							<pre className="break-all  whitespace-pre-wrap ">
								{JSON.stringify(VotingContract, null, 2)}
							</pre>
						</AccordionContent>
					</AccordionItem>

				</Accordion>
			</div>

		</div>
	);
};

export default Contract;
