import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Crossbox } from '@/components/ui/crossbox';
import { toast } from '@/components/ui/use-toast';
import { getContractInstance } from '@/lib/voting';
import React, { useEffect, useState } from 'react'
import type { Candidate } from 'types/types';
import { Label } from '@/components/ui/label';

interface Props {
	disabled?: boolean;
	refresh: boolean;
	setRefresh: (refresh: boolean) => void;
	selectedCandidates?: number[];
	setSelectedCandidates?: (selectedCandidates: number[]) => void;
}


export default function CandidatesList({ disabled, refresh, setRefresh, selectedCandidates, setSelectedCandidates }: Props) {
	const [candidates, setCandidates] = useState<Candidate[]>([]);
	const [candidatesMap, setCandidatesMap] = useState<Map<number, Candidate>>(new Map());	
	const [groupedCandidates, setGroupedCandidates] = useState<{ [party: string]: Candidate[] }>({});


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
												<Crossbox className="text-muted-foreground"
													disabled={disabled}
													checked={disabled || selectedCandidates?.includes(candidate.id)}
													onClick={() => {
														if (selectedCandidates && selectedCandidates?.some(candidateId => candidatesMap.get(candidateId)?.party !== party)) {
															toast({ title: "Σφάλμα", description: "Δεν μπορείτε να ψηφίσετε υποψηφίους από διαφορετικά κόμματα", variant: "destructive" });
															return;
														}
														if (selectedCandidates?.includes(candidate.id)) {
															setSelectedCandidates && setSelectedCandidates(selectedCandidates.filter((id) => id !== candidate.id))
														} else {
															if (selectedCandidates?.length === 2) {
																toast({ title: "Σφάλμα", description: "Μπορείτε να επιλέξετε μόνο 2 υποψηφίους", variant: "destructive" });
															} else {
																setSelectedCandidates && setSelectedCandidates([...selectedCandidates!, candidate.id])
															}
														}
													}}
												/>
											</div>
										</Label>
									</div>

								))}
							</ul>
						</Card>
					</div>
				))}
			</ul>
		</div>
	)
}
