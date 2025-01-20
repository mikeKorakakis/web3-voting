import { Input } from "@/components/ui/input"
import { useState } from 'react'
import { useToast } from "@/components/ui/use-toast";
import { PasswordInput } from "@/components/ui/password-input"
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { LoadingButton } from "@/components/ui/loading-button"
import { useNavigate } from "react-router";
import { useAuth } from "contexts/AuthContext";
import { getContractInstance } from "@/lib/voting";
import web3 from "@/lib/web3";




export const signupSchema = z.object({
	fullName: z.string().min(2),
});

export type SignUpInput = z.z.infer<typeof signupSchema>;



export default function SignUpForm() {

	const navigate = useNavigate()


	const form = useForm<SignUpInput>({
		resolver: zodResolver(signupSchema),
		defaultValues: {
			fullName: "",
		},
	})
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
	const { toast } = useToast();
	const { login } = useAuth();


	const onSubmit = async (values: z.infer<typeof signupSchema>) => {
		setIsSubmitting(true)

		if (!web3) {
			toast({
				title: "Σφάλμα",
				description: "Δεν υπάρχει σύνδεση με το δίκτυο",
				variant: "destructive"
			});
			return;
		}
		try {
			const { fullName } = values;
			if (!fullName) {
				toast({
					title: "Σφάλμα",
					description: "Το όνομα είναι υποχρεωτικό",
					variant: "destructive"
				});
				return;
			}
			const contract = await getContractInstance();
			const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
			const account = accounts[0];
			const voter = await contract.methods.getVoter(account).call();
			if (voter[1]) {
				toast({
					title: "Σφάλμα",
					description: "Είστε ήδη εγγεγραμμένος.",
					variant: "destructive"
				});
				return;
			}

			
			const gasEstimate = await contract.methods
				.registerVoter(fullName)
				.estimateGas({ from: account });
			const tx = await contract.methods
				.registerVoter(fullName)
				.send({ from: account, gasEstimate });

			toast
				({
					title: "Επιτυχία",
					description: `Ο ψηφοφόρος ${fullName} εγγράφηκε με επιτυχία.`,
					variant: "default"
				});
			navigate("/signin")
			console.log(`Voter registered: ${fullName} - Tx: ${tx.transactionHash}`);
		}
		catch (error) {
			console.error(error);
			toast({
				title: "Σφάλμα",
				description: "Κάτι πήγε στραβά",
				variant: "destructive"
			});
		}
		finally {
			setIsSubmitting(false)
		}
	}


	return (
		<div className={"grid gap-6"}>
			<Form {...form} >
				<form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
					<div className="grid gap-4">
						<div className="grid gap-2">
							<FormField
								control={form.control}
								name="fullName"
								render={({ field }) => (
									<FormItem>

										<FormLabel>Οναματεπώνυμο</FormLabel>
										<FormControl>
											<Input
												{...field}
												placeholder="Όνοματεπώνυμο"
												disabled={isSubmitting}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<LoadingButton loading={isSubmitting} disabled={isSubmitting} type="submit" className="w-full mt-2">
								Εγγραφή
							</LoadingButton>
						</div>
					</div>



				</form>

			</Form>


		</div >
	)
}
