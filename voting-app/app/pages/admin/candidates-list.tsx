import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Crossbox } from '@/components/ui/crossbox';
import { toast } from '@/components/ui/use-toast';
import { getContractInstance } from '@/lib/voting';
import React, { useEffect, useState } from 'react'
import type { Candidate } from 'types/types';
import { Label } from '@/components/ui/label';
import { Trash2, Pencil } from 'lucide-react';

interface Props {
	disabled?: boolean;
	refresh: boolean;
	setRefresh: (refresh: boolean) => void;
	selectedCandidateId?: number;
	setSelectedCandidateId?: (selectedCandidates: number) => void;
}


export default function CandidatesList({ disabled, refresh, setRefresh, selectedCandidateId, setSelectedCandidateId }: Props) {
	const [candidates, setCandidates] = useState<Candidate[]>([]);
	const [candidatesMap, setCandidatesMap] = useState<Map<number, Candidate>>(new Map());
	const [groupedCandidates, setGroupedCandidates] = useState<{ [party: string]: Candidate[] }>({});

	const deleteCandidate = async (id: number) => {
		const contract = await getContractInstance();
		try {
			const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
			const account = accounts[0];
			const gasEstimate = await contract.methods.deleteCandidate(id).estimateGas({ from: account });
			await contract.methods.deleteCandidate(id).send({ from: account, gasEstimate });
			toast({ title: "Επιτυχία", description: "Ο υποψήφιος διαγράφηκε.", variant: "default" });
			setRefresh(!refresh);
		} catch (err: any) {
			toast({ title: "Σφάλμα", description: err.message, variant: "destructive" });
		}
	}


	

	const groupByParty = (candidates: Candidate[]) => {
		const grouped = candidates.reduce((acc: { [party: string]: Candidate[] }, candidate) => {
			if (!acc[candidate.party]) {
				acc[candidate.party] = [];
			}
			acc[candidate.party].push(candidate);
			return acc;
		}, {});
		setGroupedCandidates(grouped);
	};

	useEffect(() => {
		const fetchCandidates = async () => {
			try {
				const contract = await getContractInstance();
				const candidates = await contract.methods.getAllCandidates().call();

				const parsedCandidates = candidates.map((candidate: any) => ({
					id: Number(candidate.id),
					name: candidate.name,
					party: candidate.party,
				}));

				setCandidates(parsedCandidates);
				const cdMap = new Map<number, Candidate>();
				candidates.forEach((candidate: Candidate) => {
					cdMap.set(Number(candidate.id), {
						id: Number(candidate.id),
						name: candidate.name,
						party: candidate.party,
						voteCount: candidate.voteCount,
					});
				}
				);
				setCandidatesMap(cdMap);
			} catch (err: any) {
				toast({ title: "Σφάλμα", description: err.message, variant: "destructive" });
			}
		};

		fetchCandidates();
	}, [refresh]);



	useEffect(() => {
		if (candidates.length > 0) {
			groupByParty(candidates);
		}
	}, [candidates]);

	return (
		<div className='w-full flex flex-col items-center'>
			<div className='flex w-min'><h1 className="text-2xl font-semibold">Υποψήφιοι</h1><Button variant={"link"} onClick={() => setRefresh(!refresh)}>Ανανέωση</Button></div>
			<ul className='pt-4 w-full flex flex-row gap-2 justify-around flex-wrap'>
				{Object.keys(groupedCandidates).map((party) => (
					<div key={party} >
						<Card className="rounded-lg border p-6 w-96 max-w-md  min-h-56 sm:max-w-lg md:max-w-2xl">
							<h1 className="text-2xl font-bold">{party}</h1>
							<h2 className="text-sm text-muted-foreground pt-2">Επιλέξτε μέχρι 2 υποψηφίους </h2>
							<ul className='pt-2'>
								{groupedCandidates[party].map((candidate) => (
									<div className="flex items-center pt-2" key={candidate.id}>
										
										<Label htmlFor="candidate2" className="flex-1 cursor-pointer">
											<div className="flex items-center justify-between">
												<span className="font-medium text-lg">{candidate.name}</span>
												<div className="flex gap-2">
													<Button className=' w-12'
														disabled={disabled}
														onClick={() => {
															setSelectedCandidateId && setSelectedCandidateId(candidate.id);
														}}
													>
														<Pencil className="bg-white-500"
														/>
													</Button>
													<Button className='bg-red-500 hover:bg-red-400 w-12'
														disabled={disabled}
														onClick={() => {
															if (confirm("Είστε σίγουροι ότι θέλετε να διαγράώσετε τον υποψήφιο;")) {
																deleteCandidate(candidate.id);
															}
														}}
													>
														<Trash2 className="bg-white-500"
														/>
													</Button>
												</div>
											</div>
										</Label>
									</div>

								))}
							</ul>
						</Card>
					</div>
				))}
			</ul>
			<div className='h-10'></div>

		</div>
	)
}
