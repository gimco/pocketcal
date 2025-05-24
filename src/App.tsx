import { useEffect, useState } from "react";
import "./App.css";
import { useStore } from "./store";
import Sidebar from "./components/Sidebar";
import Calendar from "./components/Calendar";
import ChevronIcon from "./components/icons/ChevronIcon";

function App() {
	const [isSidebarHidden, setIsSidebarHidden] = useState(false);
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
	}, [getAppStateFromUrl]);

	// Update URL whenever relevant state pieces change
	useEffect(() => {
		const newUrl = generateShareableUrl();
		window.history.replaceState(null, "", newUrl);
	}, [
		startDate,
		includeWeekends,
		showToday,
		eventGroups,
		generateShareableUrl,
	]);

	const toggleSidebar = () => {
		setIsSidebarHidden(!isSidebarHidden);
	};

	return (
		<div className={`app-container ${isSidebarHidden ? "sidebar-hidden" : ""}`}>
			<button className="sidebar-toggle" onClick={toggleSidebar}>
				<ChevronIcon />
			</button>
			<Sidebar />
			<Calendar />
		</div>
	);
}

export default App;
