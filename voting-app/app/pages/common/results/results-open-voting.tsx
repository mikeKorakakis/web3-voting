import React, {  } from "react";


import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";


const ResultsOpenVoting: React.FC = () => {


	return (
		<div className="container mx-auto p-4 max-w-4xl mb-8">
			<Card className="flex flex-col mb-8">
						<CardHeader className="items-center pb-0">
							<CardTitle>H ψηφοφορία έχει ξεκινήσει</CardTitle>
							<CardDescription>Τα αποτελέσματα θα είναι διαθέσιμα όταν ολοκληρωθεί η ψηφοφορία</CardDescription>
						</CardHeader>
			</Card>
			<div className="h-10"></div>
		</div>
	);
};

export default ResultsOpenVoting;
