import React, { useEffect, useState } from "react";
import web3 from "@/lib/web3";
import { getContractInstance } from "@/lib/voting";
import { Bar, BarChart, XAxis, YAxis } from "recharts"

import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart"

import type { ChartConfig } from "@/components/ui/chart"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import type { Candidate } from "types/types";
import TotalVoters from "./total-voters";
import { useVoting } from "@/lib/useVoting";


const ResultsClosedVoting: React.FC = () => {
	const [candidates, setCandidates] = useState<Candidate[]>([]);
	const [refresh, setRefresh] = useState<boolean>(false);
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
					id: candidate[0],
					name: candidate[1],
					party: candidate[2],
					voteCount: candidate[3],
				}));

				setCandidates(parsedCandidates);

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

	const chartDataParties = Object.entries(groupedCandidates).map(([party, candidates], i) => ({
		party,
		votes: candidates.reduce((acc, candidate) => acc + Number(candidate.voteCount), 0),
		fill: `hsl(var(--chart-${i + 1}))`,
	}));


	const chartConfigParties = Object.fromEntries(
		Object.entries(groupedCandidates).map(([party, candidates], index) => [
			party,
			{
				label: party,
				color: `hsl(var(--chart-${index + 1}))`,
			},
		])
	) as ChartConfig;

	const chartDataCandidates = candidates.map((candidate, i) => ({
		candidate: candidate.name,
		party: candidate.party,
		votes: Number(candidate.voteCount),
		fill: `hsl(var(--chart-${i + 1}))`,
	}));



	return (
		<div className="container mx-auto p-4 max-w-4xl mb-8">
			<TotalVoters />
			<>
				<Card>
					<CardHeader>
						<CardTitle>Αποτελέσματα Εκλογών</CardTitle>
						<CardDescription>Αποτελέσματα Κομμάτων</CardDescription>
					</CardHeader>
					<CardContent>
						<ChartContainer config={chartConfigParties}>
							<BarChart
								accessibilityLayer
								data={chartDataParties}
								layout="vertical"
								margin={{
									left: 0,
								}}
							>
								<YAxis
									dataKey="party"
									type="category"
									tickLine={false}
									tickMargin={10}
									axisLine={false}
									width={100}

								/>
								<XAxis dataKey="votes" type="number" />
								<ChartTooltip
									cursor={false}
									content={<ChartTooltipContent hideLabel />}
								/>
								<Bar dataKey="votes" layout="vertical" radius={5} />
							</BarChart>
						</ChartContainer>
					</CardContent>
					
				</Card>
				{
					Object.keys(groupedCandidates).map((party) => (
						<Card className="mt-4">
							<CardHeader>
								<CardTitle>Αποτελέσματα Εκλογών</CardTitle>
								<CardDescription>Αποτελέσματα {party}</CardDescription>
							</CardHeader>
							<CardContent>
								<ChartContainer config={chartConfigParties}>
									<BarChart
										accessibilityLayer
										data={chartDataCandidates.filter((candidate) => candidate.party === party)}
										layout="vertical"
										margin={{
											left: 0,
										}}

									>
										<YAxis
											dataKey="candidate"
											type="category"
											tickLine={false}
											tickMargin={10}
											axisLine={false}
											width={100}

										/>
										<XAxis dataKey="votes" type="number" />
										<ChartTooltip
											cursor={false}
											content={<ChartTooltipContent hideLabel />}
										/>
										<Bar dataKey="votes" layout="vertical" radius={5} />
									</BarChart>
								</ChartContainer>
							</CardContent>
						</Card>
					))
				}
			</>
			<div className="h-10"></div>
		</div>
	);
};

export default ResultsClosedVoting;
