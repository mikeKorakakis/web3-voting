import { Button } from '@/components/ui/button';
import { Card, CardHeader } from '@/components/ui/card';
import { Datalist } from '@/components/ui/datalist';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { LoadingButton } from '@/components/ui/loading-button';
import { useToast } from '@/components/ui/use-toast';
import { useVoting } from '@/lib/useVoting';
import { cn } from '@/lib/utils';
import { getContractInstance } from '@/lib/voting';
import CandidatesList from './candidates-list';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import type { Candidate } from 'types/types';
import * as z from 'zod';
import { set } from 'react-hook-form';
import { Undo2 } from 'lucide-react';

export const addCandidateSchema = z.object({
	name: z.string().min(2),
	party: z.string().min(2),
});


export type AddCandidateInput = z.z.infer<typeof addCandidateSchema>;



export default function Candidates() {
	const [refresh, setRefresh] = useState<boolean>(false);
	const [candidates, setCandidates] = useState<Candidate[]>([]);
	const { isLoading: loadingVoting, votingOpen, openVoting, closeVoting } = useVoting()
	const [selectedCandidateId, setSelectedCandidateId] = useState<number | null>(null);
	const parties = new Set<string>();
	const form = useForm<AddCandidateInput>({
		resolver: zodResolver(addCandidateSchema),
	})
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
	const { toast } = useToast();


	candidates.map(candidate => parties.add(candidate.party));

	const uniqueParties = Array.from(parties);
	const partyValues = uniqueParties.map(party => ({ value: party, label: party }));

	const getCandidate = async (id: number) => {
		const contract = await getContractInstance();
		try {
			const candidate = await contract.methods.getCandidate(id).call();
			form.reset({ name: candidate[1], party: candidate[2] });
		} catch (err: any) {
			toast({ title: "Σφάλμα", description: err.message, variant: "destructive" });
		}
	}

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
			} catch (err: any) {
				console.log(err);
				toast({ title: "Σφάλμα", description: err.message, variant: "destructive" });
			}
		};

		fetchCandidates();
	}, [refresh]);

	useEffect(() => {
		if (selectedCandidateId || selectedCandidateId === 0) {
			getCandidate(selectedCandidateId);
		}
	}, [selectedCandidateId]);






	const onSubmit = async (data: AddCandidateInput) => {
		setIsSubmitting(true);
		const contract = await getContractInstance();
		const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
		const adminAccount = accounts[0];
		const { name: candidateName, party } = data
		try {
			if (selectedCandidateId || selectedCandidateId === 0) {

				const gasEstimate = await contract.methods.updateCandidate(selectedCandidateId, candidateName, party).estimateGas({ from: adminAccount });
				await contract.methods.updateCandidate(selectedCandidateId, candidateName, party).send({ from: adminAccount, gasEstimate });
				
				toast({ title: "Επιτυχία", description: `Ο υποψήφιος "${candidateName}" προστέθηκε με επιτυχία!`, variant: "default" });
			} else {
				const gasEstimate = await contract.methods.addCandidate(candidateName, party).estimateGas({ from: adminAccount });
				await contract.methods.addCandidate(candidateName, party).send({ from: adminAccount, gasEstimate });
				toast({ title: "Επιτυχία", description: `Ο υποψήφιος "${candidateName}" ενημερώθηκε με επιτυχία!`, variant: "default" });
			}
			setRefresh(refresh => !refresh);
		} catch (err: any) {
			toast({ title: "Σφάλμα", description: err.message, variant: "destructive" });
		} finally {
			setIsSubmitting(false);
		}
	}



return (
	<div className="flex flex-col gap-6 w-full items-center">
		<Card className='p-4 h-min w-96'>
			<span className='text-lg m-auto font-semibold'>
				{votingOpen ? "H ψηφοφορία έχει ξεκιήσει και δεν μπορείτε να προσθέσετε υποψηφίους" : "Η ψηφοφορία δεν έχει ξεκινήσει. Προσθέστε πρώτα υποψηφίους και κατόπιν επιλέξτε «Έναρξη Ψηφοφορίας» για να εκκινήσετε τη διαδικασία."}
			</span>
			<LoadingButton loading={loadingVoting} onClick={votingOpen ? closeVoting : openVoting} className={cn("w-full mt-2", votingOpen && 'bg-red-500 hover:bg-red-400')}>
				{votingOpen ? "Λήξη Ψηφοφορίας" : "Έναρξη Ψηφοφορίας"}
			</LoadingButton>
		</Card>
		<Card className='p-4 h-min w-96'>
			<Form {...form} >
				<form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
					{<div className='flex'>
						<h1 className="text-2xl font-semibold">	{(selectedCandidateId || selectedCandidateId === 0) ? "Επεξεργασία" : "Προσθήκη"} Υποψηφίου</h1>
						{(selectedCandidateId || selectedCandidateId === 0)
							&& <Button className='bg-red-500 hover:bg-red-400 w-12 ml-2'
								onClick={() => {
									setSelectedCandidateId(null);
									form.reset({ name: "", party: "" });
								}}
							>
								<Undo2 className="bg-white-500"
								/>
							</Button>}
					</div>}
					<div className="grid gap-4">
						<div className="grid gap-2">
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>

										<FormLabel>Όνομα Υποψηφίου</FormLabel>
										<FormControl>
											<Input
												{...field}
												placeholder="Όνομα Υποψηφίου"
												disabled={isSubmitting}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="party"
								render={({ field }) => (
									<FormItem>

										<FormLabel>Κόμμα</FormLabel>
										<FormControl>
											<Datalist
												{...field}
												options={partyValues}
												placeholder="Κόμμα"
												onValueChange={(value) => console.log(value)}
											/>
											{/* <Input
													{...field}
													placeholder="Κόμμα"
													disabled={isSubmitting}
												/> */}
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<LoadingButton loading={isSubmitting || loadingVoting} disabled={isSubmitting || votingOpen} type="submit" className="w-full mt-2">
								{(selectedCandidateId || selectedCandidateId === 0) ? "Επεξεργασία" : "Προσθήκη"} Υποψηφίου
							</LoadingButton>
						</div>
					</div>
				</form>
			</Form>
		</Card>
		<CandidatesList
			refresh={refresh}
			setRefresh={setRefresh}
			disabled={votingOpen}
			setSelectedCandidateId={setSelectedCandidateId}
		/>
	</div >
);
}
