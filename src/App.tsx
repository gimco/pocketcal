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
		const sidebar = document.querySelector(".sidebar");

		if (!isSidebarHidden && sidebar) {
			sidebar.scrollTo({ top: 0, behavior: "smooth" });

			setTimeout(() => {
				setIsSidebarHidden(true);
			}, 100);
		} else {
			setIsSidebarHidden(false);
		}
	};

	return (
		<div className={`app-container ${isSidebarHidden ? "sidebar-hidden" : ""}`}>
			<button
				className="sidebar-toggle"
				onClick={toggleSidebar}
				aria-label={isSidebarHidden ? "Show sidebar" : "Hide sidebar"}
				aria-expanded={!isSidebarHidden}
			>
				<ChevronIcon color="black" />
			</button>
			<Sidebar />
			<Calendar />
		</div>
	);
}

export default App;
