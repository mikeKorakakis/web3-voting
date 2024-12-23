import { Card } from '@/components/ui/card';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { LoadingButton } from '@/components/ui/loading-button';
import { useToast } from '@/components/ui/use-toast';
import { getContractInstance } from '@/lib/voting';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import * as z from 'zod';

export const addCandidateSchema = z.object({
	name: z.string().min(2),
});

export type AddCandidateInput = z.z.infer<typeof addCandidateSchema>;

interface Candidate {
	id: number;
	name: string;
	voteCount: number;
}

export default function Candidates() {
	const [candidates, setCandidates] = useState<Candidate[]>([]);
	const [refresh, setRefresh] = useState<boolean>(false);

	useEffect(() => {
		const fetchCandidates = async () => {
			try {
				const contract = await getContractInstance();
				const candidates = await contract.methods.getAllCandidates().call();

				// Map the response to the Candidate type
				const parsedCandidates = candidates.map((candidate: any) => ({
					id: Number(candidate.id),
					name: candidate.name,
					voteCount: Number(candidate.voteCount),
				}));

				setCandidates(parsedCandidates);
			} catch (err: any) {
				toast({ title: "Σφάλμα", description: err.message, variant: "destructive" });
			}
		};

		fetchCandidates();
	}, [refresh]);


	const form = useForm<AddCandidateInput>({
		resolver: zodResolver(addCandidateSchema),
	})
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
	const { toast } = useToast();

	const onSubmit = async (data: AddCandidateInput) => {
		setIsSubmitting(true);
		try {
			const contract = await getContractInstance();
			const { name: candidateName } = data



			// Request accounts from MetaMask
			const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
			const adminAccount = accounts[0];

			const candidates = await contract.methods.getAllCandidates().call();
			setCandidates(candidates);

			// Call the `addCandidate` method
			await contract.methods.addCandidate(candidateName).send({ from: adminAccount });

			toast({ title: "Επιτυχία", description: `Ο υποψήφιος "${candidateName}" προστέθηκε με επιτυχία!`, variant: "default" });
		} catch (err: any) {
			toast({ title: "Σφάλμα", description: err.message, variant: "destructive" });
		}finally {
			setIsSubmitting(false);
		}

	};

	return (
		<div className="flex flex-col w-96">
			<Card className='p-4 h-min'>
			<Form {...form} >
				<form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
					<h1 className="text-2xl font-semibold">Προσθήκη Υποψηφίου</h1>
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

							<LoadingButton loading={isSubmitting} disabled={isSubmitting} type="submit" className="w-full mt-2">
								Προσθήκη Υποψηφίου
							</LoadingButton>
						</div>
					</div>
				</form>
			</Form>
			</Card>
			<div className=''>
				<h1 className="text-2xl font-semibold">Υποψήφιοι</h1>
				<ul className='pt-2'>
					{candidates.map((candidate,i) => (
						<li key={i} className='list-disc'>{candidate.name}</li>
					))}
				</ul>
			</div>
		</div >
	);
}
