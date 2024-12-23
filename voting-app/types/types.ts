export interface Candidate {
	id: number;
	name: string;
	party: string;
	voteCount: number;
}

export interface Voter {
	fullName: string;
	isRegistered: boolean;
	hasVoted: boolean;
}