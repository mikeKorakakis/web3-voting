import { Card } from '@/components/ui/card';
import { Datalist } from '@/components/ui/datalist';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { LoadingButton } from '@/components/ui/loading-button';
import { useToast } from '@/components/ui/use-toast';
import { getContractInstance } from '@/lib/voting';
import CandidatesList from '@/routes/common/candidates-list';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import type { Candidate } from 'types/types';
import * as z from 'zod';

export const addCandidateSchema = z.object({
	name: z.string().min(2),
	party: z.string().min(2),
});

const fruits = [
	{ value: "apple", label: "Apple" },
	{ value: "banana", label: "Banana" },
	{ value: "orange", label: "Orange" },
	{ value: "pear", label: "Pear" },
	{ value: "pineapple", label: "Pineapple" },
	{ value: "strawberry", label: "Strawberry" },
]

export type AddCandidateInput = z.z.infer<typeof addCandidateSchema>;



export default function Candidates() {
	const [refresh, setRefresh] = useState<boolean>(false);
	const [candidates, setCandidates] = useState<Candidate[]>([]);
	const parties = new Set<string>();

	candidates.map(candidate => parties.add(candidate.party));

	const uniqueParties = Array.from(parties);
	const partyValues = uniqueParties.map(party => ({ value: party, label: party }));


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





	const form = useForm<AddCandidateInput>({
		resolver: zodResolver(addCandidateSchema),
	})
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
	const { toast } = useToast();

	const onSubmit = async (data: AddCandidateInput) => {
		setIsSubmitting(true);
		try {
			const contract = await getContractInstance();
			const { name: candidateName, party } = data
			const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
			const adminAccount = accounts[0];

			await contract.methods.addCandidate(candidateName, party).send({ from: adminAccount });
			
			setRefresh(refresh => !refresh);
			toast({ title: "Επιτυχία", description: `Ο υποψήφιος "${candidateName}" προστέθηκε με επιτυχία!`, variant: "default" });
		} catch (err: any) {
			toast({ title: "Σφάλμα", description: err.message, variant: "destructive" });
		} finally {
			setIsSubmitting(false);
		}

	};

	return (
		<div className="flex flex-col gap-6 w-full items-center">
			<Card className='p-4 h-min w-96'>
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

								<LoadingButton loading={isSubmitting} disabled={isSubmitting} type="submit" className="w-full mt-2">
									Προσθήκη Υποψηφίου
								</LoadingButton>
							</div>
						</div>
					</form>
				</Form>
			</Card>
			<CandidatesList refresh={refresh} setRefresh={setRefresh} disabled />
		</div >
	);
}
