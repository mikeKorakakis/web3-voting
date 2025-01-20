import { Card, CardContent, CardDescription, CardHeader, CardTitle, type CardFooter } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import { toast } from '@/components/ui/use-toast';
import { getContractInstance } from '@/lib/voting';
import { TrendingUp } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { RadialBarChart, PolarRadiusAxis, Label, RadialBar } from 'recharts';
import type { Voter } from 'types/types';

const chartConfig = {
	voted: {
		label: "Ψήφισαν",
		color: "hsl(var(--chart-1))",
	},
	notVoted: {
		label: "Δεν ψήφισαν",
		color: "hsl(var(--chart-2))",
	},
} satisfies ChartConfig


export default function TotalVoters({votingOpen}: {votingOpen: boolean}) {

	const [voters, setVoters] = useState<Voter[]>([]);
	const [refresh, setRefresh] = useState<boolean>(false);
	const [voted, setVoted] = useState<number>(0);

	useEffect(() => {
		const fetchVoters = async () => {
			try {
				const contract = await getContractInstance();
				const voters = await contract.methods.getAllVoters().call();

				const parsedVoters = voters.map((voter: Voter) => ({
					fullName: voter.fullName,
					isRegistered: voter.isRegistered,
					hasVoted: voter.hasVoted,
				}));


				const voted = parsedVoters.filter((voter: Voter) => voter.hasVoted).length;
				setVoted(voted);
				setVoters(parsedVoters);
			} catch (err: any) {
				toast({ title: "Σφάλμα", description: err.message, variant: "destructive" });
			}
		};

		fetchVoters();
	}, [refresh]);

	const chartData = [{ voted: voted, notVoted: voters.length - voted }];

	return (
		<Card className="flex flex-col mb-8">
			<CardHeader className="items-center pb-0">
				<CardTitle>{votingOpen ? "H ψηφοφορία έχει ξεκινήσει": "Η ψηφοφορία δεν έχει ξεκινήσει"}</CardTitle>
				<CardTitle>Ψήφισαν: {voted || 0}</CardTitle>
				<CardDescription>Εγγεγραμμένοι ψηφοφόροι: {voters.length}</CardDescription>
			</CardHeader>
			<CardContent className="flex flex-1 items-center pb-0">
				<ChartContainer
					config={chartConfig}
					className="mx-auto aspect-square w-full max-w-[250px]"
				>
					<RadialBarChart
						data={chartData}
						endAngle={180}
						innerRadius={80}
						outerRadius={130}
					>
						<ChartTooltip
							cursor={false}
							content={<ChartTooltipContent hideLabel />}
						/>
						<PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
							<Label
								content={({ viewBox }) => {
									if (viewBox && "cx" in viewBox && "cy" in viewBox) {
										return (
											<text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
												<tspan
													x={viewBox.cx}
													y={(viewBox.cy || 0) - 16}
													className="fill-foreground text-2xl font-bold"
												>
													{voted.toLocaleString()}
												</tspan>
												<tspan
													x={viewBox.cx}
													y={(viewBox.cy || 0) + 4}
													className="fill-muted-foreground"
												>
													Ψήφισαν
												</tspan>
											</text>
										)
									}
								}}
							/>
						</PolarRadiusAxis>
						<RadialBar
							dataKey="voted"
							stackId="a"
							cornerRadius={5}
							fill="hsl(var(--chart-1))"
							className="stroke-transparent stroke-2"
						/>
						<RadialBar
							dataKey="notVoted"
							fill="hsl(var(--chart-2))"
							stackId="a"
							cornerRadius={5}
							className="stroke-transparent stroke-2"
						/>
					</RadialBarChart>
				</ChartContainer>
			</CardContent>
			{/* <CardFooter className="flex-col gap-2 text-sm">
	  <div className="flex items-center gap-2 font-medium leading-none">
		Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
	  </div>
	  <div className="leading-none text-muted-foreground">
		Showing total visitors for the last 6 months
	  </div>
	</CardFooter> */}
		</Card>
	)
}
