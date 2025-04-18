import { useEffect } from "react";
import "./App.css";
import { useStore } from "./store";
import Sidebar from "./components/Sidebar";
import Calendar from "./components/Calendar";

function App() {
	const getAppStateFromUrl = useStore((state) => state.getAppStateFromUrl);
	const generateShareableUrl = useStore((state) => state.generateShareableUrl);

	// Select individual state pieces needed for the URL
	const startDate = useStore((state) => state.startDate);
	const includeWeekends = useStore((state) => state.includeWeekends);
	const showToday = useStore((state) => state.showToday);
	const eventGroups = useStore((state) => state.eventGroups);

	// Load state from URL on initial mount
	useEffect(() => {
		getAppStateFromUrl();
	}, [getAppStateFromUrl]); // Keep this as is, getAppStateFromUrl should be stable

	// Update URL whenever relevant state pieces change
	useEffect(() => {
		const newUrl = generateShareableUrl();
		// Use replaceState to avoid polluting browser history
		window.history.replaceState(null, "", newUrl);
		// Use the individual state pieces as dependencies
	}, [
		startDate,
		includeWeekends,
		showToday,
		eventGroups,
		generateShareableUrl,
	]);

	return (
		<div className="app-container">
			<Sidebar />
			<Calendar />
		</div>
	);
}

export default App;
