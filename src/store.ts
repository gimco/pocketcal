import { create } from "zustand";
import { nanoid } from "nanoid";
import {
	addMonths,
	startOfMonth,
	isWithinInterval,
	formatISO,
	parseISO,
	eachDayOfInterval,
	isSameDay,
} from "date-fns";

export const MAX_GROUPS = 5;

export const GROUP_COLORS = [
	{ hex: "#e4002b", rgb: "rgb(228, 0, 43)" }, // red
	{ hex: "#10a2f5", rgb: "rgb(16, 162, 245)" }, // blue
	{ hex: "#24d05a", rgb: "rgb(36, 208, 90)" }, // green
	{ hex: "#e9bc3f", rgb: "rgb(233, 188, 63)" }, // yellow
	{ hex: "#eb4888", rgb: "rgb(235, 72, 136)" }, // pink
];

export interface DateRange {
	start: string; // ISO string format
	end: string; // ISO string format
}

export interface EventGroup {
	id: string;
	name: string;
	color: string;
	ranges: DateRange[];
}

interface AppState {
	startDate: Date;
	includeWeekends: boolean;
	showToday: boolean;
	eventGroups: EventGroup[];
	selectedGroupId: string | null;
	setStartDate: (date: Date) => void;
	setIncludeWeekends: (include: boolean) => void;
	setShowToday: (show: boolean) => void;
	addEventGroup: (name: string) => EventGroup;
	updateEventGroup: (id: string, name: string) => void;
	deleteEventGroup: (id: string) => void;
	selectEventGroup: (id: string | null) => void;
	addDateRange: (groupId: string, range: DateRange) => void;
	updateDateRange: (
		groupId: string,
		oldRange: DateRange,
		newRange: DateRange
	) => void;
	deleteDateRange: (groupId: string, rangeToDelete: DateRange) => void;
	getAppStateFromUrl: () => void;
	generateShareableUrl: () => string;
}

const defaultStartDate = startOfMonth(new Date()); // Start from the beginning of the current month

// Create a function to generate the default event group
const createDefaultEventGroup = (index = 0): EventGroup => ({
	id: nanoid(),
	name: "My Events",
	color: GROUP_COLORS[index].hex,
	ranges: [],
});

// Create a function to get the default state
const getDefaultState = () => {
	const defaultGroup = createDefaultEventGroup();
	return {
		startDate: defaultStartDate,
		includeWeekends: true,
		showToday: true,
		eventGroups: [defaultGroup],
		selectedGroupId: defaultGroup.id, // Select the first group by default
	};
};

export const useStore = create<AppState>((set, get) => ({
	...getDefaultState(), // Use default state for initial values

	setStartDate: (date) => set({ startDate: startOfMonth(date) }),
	setIncludeWeekends: (include) => set({ includeWeekends: include }),
	setShowToday: (show) => set({ showToday: show }),

	addEventGroup: (name) => {
		let newGroup: EventGroup | null = null;
		set((state) => {
			if (state.eventGroups.length >= MAX_GROUPS) {
				return state; // Don't add if limit reached
			}
			const newGroupIndex = state.eventGroups.length;
			newGroup = {
				id: nanoid(),
				name,
				color: GROUP_COLORS[newGroupIndex].hex,
				ranges: [],
			};
			return {
				eventGroups: [...state.eventGroups, newGroup],
			};
		});
		return (
			newGroup || {
				id: "", // Return empty group if we hit the limit
				name: "",
				color: "",
				ranges: [],
			}
		);
	},

	updateEventGroup: (id, name) =>
		set((state) => ({
			eventGroups: state.eventGroups.map((group) =>
				group.id === id ? { ...group, name } : group
			),
		})),

	deleteEventGroup: (id) =>
		set((state) => ({
			eventGroups: state.eventGroups.filter((group) => group.id !== id),
			selectedGroupId:
				state.selectedGroupId === id ? null : state.selectedGroupId,
		})),

	selectEventGroup: (id) => set({ selectedGroupId: id }),

	addDateRange: (groupId, range) =>
		set((state) => ({
			eventGroups: state.eventGroups.map((group) =>
				group.id === groupId
					? { ...group, ranges: [...group.ranges, range] }
					: group
			),
		})),

	updateDateRange: (groupId, oldRange, newRange) =>
		set((state) => ({
			eventGroups: state.eventGroups.map((group) =>
				group.id === groupId
					? {
							...group,
							ranges: group.ranges.map((r) =>
								r.start === oldRange.start && r.end === oldRange.end
									? newRange
									: r
							),
					  }
					: group
			),
		})),

	deleteDateRange: (groupId, rangeToDelete) =>
		set((state) => ({
			eventGroups: state.eventGroups.map((group) =>
				group.id === groupId
					? {
							...group,
							ranges: group.ranges.filter(
								(r) =>
									!(
										r.start === rangeToDelete.start &&
										r.end === rangeToDelete.end
									)
							),
					  }
					: group
			),
		})),

	// Function to parse state from URL hash
	getAppStateFromUrl: () => {
		try {
			const hash = window.location.hash.substring(1);
			if (hash) {
				const decodedState = JSON.parse(atob(hash));
				// Basic validation
				if (decodedState.startDate && decodedState.eventGroups) {
					const eventGroups = decodedState.eventGroups ?? [
						createDefaultEventGroup(),
					];
					set({
						startDate: startOfMonth(parseISO(decodedState.startDate)),
						includeWeekends: decodedState.includeWeekends ?? true,
						showToday: decodedState.showToday ?? true,
						eventGroups,
						selectedGroupId: eventGroups[0]?.id ?? null, // Select first group if available
					});
				}
			} else {
				// If no hash, set to default state with the default group
				set(getDefaultState());
			}
		} catch (error) {
			console.error("Failed to parse state from URL:", error);
			// Reset to default state with the default group
			set(getDefaultState());
		}
	},

	// Function to generate shareable URL
	generateShareableUrl: () => {
		const stateToShare = {
			startDate: formatISO(get().startDate, { representation: "date" }),
			includeWeekends: get().includeWeekends,
			showToday: get().showToday,
			eventGroups: get().eventGroups,
			// Exclude selectedGroupId
		};
		const encodedState = btoa(JSON.stringify(stateToShare));
		return `${window.location.origin}${window.location.pathname}#${encodedState}`;
	},
}));

// Helper function to check if a date falls within any range of a specific group
export const isDateInRange = (date: Date, group: EventGroup): boolean => {
	return group.ranges.some((range) =>
		isWithinInterval(date, {
			start: parseISO(range.start),
			end: parseISO(range.end),
		})
	);
};

// Helper function to find which range contains a specific date
export const findRangeForDate = (
	date: Date,
	group: EventGroup
): DateRange | null => {
	return (
		group.ranges.find((range) =>
			isWithinInterval(date, {
				start: parseISO(range.start),
				end: parseISO(range.end),
			})
		) || null
	);
};

// Helper function to get all dates within a 12-month period
export const getCalendarDates = (startDate: Date): Date[] => {
	const endDate = addMonths(startDate, 11);
	// Ensure we get the full end month
	const endOfMonthDate = new Date(
		endDate.getFullYear(),
		endDate.getMonth() + 1,
		0
	);
	return eachDayOfInterval({ start: startDate, end: endOfMonthDate });
};

// Helper function to format date for display (e.g., 'Apr 17')
export const formatDateDisplay = (date: Date): string => {
	return formatISO(date, { representation: "date" }); // Keep ISO for now, simplify later if needed
};

// Helper function to check if two dates are the same day
export const checkSameDay = (date1: Date, date2: Date): boolean => {
	return isSameDay(date1, date2);
};
