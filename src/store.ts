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
	{ hex: "#8a35de", rgb: "rgb(138, 53, 222)" }, // purple
	{ hex: "#10a2f5", rgb: "rgb(16, 162, 245)" }, // blue
	{ hex: "#eb4888", rgb: "rgb(235, 72, 136)" }, // pink
	{ hex: "#e9bc3f", rgb: "rgb(233, 188, 63)" }, // yellow
	{ hex: "#24d05a", rgb: "rgb(36, 208, 90)" }, // green
];

export interface DateRange {
	start: string;
	end: string;
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
	showHelpModal: boolean; // Add this
	setStartDate: (date: Date) => void;
	setIncludeWeekends: (include: boolean) => void;
	setShowToday: (show: boolean) => void;
	setShowHelpModal: (show: boolean) => void; // Add this
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

const defaultStartDate = startOfMonth(new Date());

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
	...getDefaultState(),
	showHelpModal: false,

	setStartDate: (date) => set({ startDate: startOfMonth(date) }),
	setIncludeWeekends: (include) => set({ includeWeekends: include }),
	setShowToday: (show) => set({ showToday: show }),
	setShowHelpModal: (show) => set({ showHelpModal: show }),

	addEventGroup: (name) => {
		let newGroup: EventGroup | null = null;
		set((state) => {
			if (state.eventGroups.length >= MAX_GROUPS) {
				return state; // Don't add if limit reached
			}

			// Find the first unused color
			const usedColors = new Set(state.eventGroups.map((g) => g.color));
			const availableColor = GROUP_COLORS.find(
				(color) => !usedColors.has(color.hex)
			);

			if (!availableColor) {
				return state;
			}

			newGroup = {
				id: nanoid(),
				name,
				color: availableColor.hex,
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
			set(getDefaultState());
		}
	},

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

export const isDateInRange = (date: Date, group: EventGroup): boolean => {
	return group.ranges.some((range) =>
		isWithinInterval(date, {
			start: parseISO(range.start),
			end: parseISO(range.end),
		})
	);
};

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

export const formatDateDisplay = (date: Date): string => {
	return formatISO(date, { representation: "date" });
};

export const checkSameDay = (date1: Date, date2: Date): boolean => {
	return isSameDay(date1, date2);
};
