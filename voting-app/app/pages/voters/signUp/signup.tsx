// src/app/[lng]/auth/signin/page.tsx
'use client'
import SignUpForm from './signup-form'
import { Card } from '@/components/ui/card'
import { Suspense } from 'react'


export default function Signup() {

	return (
		<div className="flex justify-center items-center">
			<Card className="p-8">
				<div className="mx-auto flex  flex-col justify-center space-y-6 w-[350px] ">
					<div className="flex flex-col space-y-2 text-center">
						<h1 className="text-2xl font-semibold tracking-tight">
							Eγγραφή
						</h1>
						<p className="text-sm text-muted-foreground">
							Εισάγετε το οναματεπώνυμο σας
						</p>
					</div>
					<Suspense fallback={<div>Loading...</div>}>
						<SignUpForm />
					</Suspense>

				</div>
			</Card>
		</div>
	)
}