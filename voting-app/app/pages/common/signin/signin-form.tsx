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
import { Checkbox } from "@/components/ui/checkbox";




export const signinSchema = z.object({
	username: z.string().min(2).optional(),
	password: z.string().min(2).max(100).optional(),
});

export type SigninInput = z.z.infer<typeof signinSchema>;



export default function SignInForm() {

	const navigate = useNavigate()


	const form = useForm<SigninInput>({
		resolver: zodResolver(signinSchema),
		// defaultValues: {
		// 	email: "bob@test.com",
		// 	password: "Qwerty12#$",
		// },
	})
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
	const [isMetamask, setIsMetamask] = useState<boolean>(false)
	const { toast } = useToast();
	const { login, isAdmin } = useAuth();


	const onSubmit = async (values: z.infer<typeof signinSchema>) => {
		setIsSubmitting(true)


		try {
			const { username, password } = values;
			let res = "UNREGISTERED";
			if (username && password) {
				res = await login(username, password)
			}
			else {
				res = await login(undefined, undefined)
			}
			if (res === "ADMIN" || res === "VOTER") {
				toast
					({
						title: "Επιτυχία",
						description: `Επιτυχής Σύνδεση.`,
						variant: "default"
					});

				if (res === "ADMIN") {
					navigate("/admin/candidates")
				} else {
					navigate("/vote")
				}
			} else {
				toast({
					title: "Σφάλμα",
					description: "Λάθος στοιχεία σύνδεσης",
					variant: "destructive"
				});
			}

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
							{!isMetamask && <FormField
								control={form.control}
								name="username"
								render={({ field }) => (
									<FormItem>

										<FormLabel>Όνομα Χρήστη</FormLabel>
										<FormControl>
											<Input
												{...field}
												placeholder="Όνομα Χρήστη"
												disabled={isSubmitting}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>}
							{!isMetamask && <FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem>
										<FormLabel>{"Κωδικός Πρόσβασης"}</FormLabel>
										<FormControl>
											<PasswordInput
												{...field}
												placeholder={"Κωδικός Πρόσβασης"}
												disabled={isSubmitting}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>}
							<LoadingButton loading={isSubmitting} disabled={isSubmitting} type="submit" className="w-full mt-2">
								Σύνδεση
							</LoadingButton>

							<div className="flex items-center space-x-2">
								<Checkbox id="terms"
									checked={isMetamask}
									onClick={() => setIsMetamask(isMetamask => !isMetamask)}
								/>
								<label
									htmlFor="terms"
									className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
								>
									Σύνδεση με Metamask
								</label>
							</div>
						</div>


					</div>



				</form >

			</Form >


		</div >
	)
}
