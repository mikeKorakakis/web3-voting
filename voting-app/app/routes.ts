import { type RouteConfig, index, layout, prefix, route } from "@react-router/dev/routes";

export default [
	// index("routes/home.tsx"),
	// route("signin", "routes/signin.tsx"),
	layout("routes/layout.tsx",[
		index("routes/home.tsx"),
		route("signin", "routes/common/signin.tsx"),
		route("signup", "routes/voters/signup.tsx"),
		route("results", "routes/common/results.tsx"),
		route("vote", "routes/voters/vote.tsx"),
		...prefix("admin", [
			route("contract", "routes/admin/contract.tsx"),
			route("candidates", "routes/admin/candidates.tsx"),
			route("voters", "routes/admin/voters.tsx"),
			route("import-voters", "routes/admin/import-voters.tsx"),
		]),
	]),
] satisfies RouteConfig;
