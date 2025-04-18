import React, { useState, useRef, useEffect, useCallback } from "react";
import {
	useStore,
	getCalendarDates,
	isDateInRange,
	checkSameDay,
	DateRange,
} from "../store";
import {
	format,
	getMonth,
	getYear,
	getDate,
	getDay,
	isWeekend,
	formatISO,
	isBefore,
	isAfter,
	startOfDay,
} from "date-fns";
import "./Calendar.css";

const Calendar: React.FC = () => {
	const {
		startDate,
		includeWeekends,
		showToday,
		eventGroups,
		selectedGroupId,
		addDateRange,
	} = useStore();

	const calendarDates = getCalendarDates(startDate);
	const today = startOfDay(new Date());

	const [isDragging, setIsDragging] = useState(false);
	const [dragStartDate, setDragStartDate] = useState<Date | null>(null);
	const [dragEndDate, setDragEndDate] = useState<Date | null>(null);
	const calendarGridRef = useRef<HTMLDivElement>(null);

	const handleMouseDown = (date: Date) => {
		if (!selectedGroupId) return;
		setIsDragging(true);
		setDragStartDate(date);
		setDragEndDate(date);
	};

	const handleMouseMove = (date: Date) => {
		if (!isDragging || !dragStartDate) return;
		setDragEndDate(date);
	};

	const handleMouseUp = useCallback(() => {
		if (!isDragging || !dragStartDate || !dragEndDate || !selectedGroupId)
			return;

		setIsDragging(false);

		// Ensure start is before end
		const finalStartDate = isBefore(dragStartDate, dragEndDate)
			? dragStartDate
			: dragEndDate;
		const finalEndDate = isAfter(dragEndDate, dragStartDate)
			? dragEndDate
			: dragStartDate;

		const newRange: DateRange = {
			start: formatISO(finalStartDate, { representation: "date" }),
			end: formatISO(finalEndDate, { representation: "date" }),
		};

		addDateRange(selectedGroupId, newRange);

		setDragStartDate(null);
		setDragEndDate(null);
	}, [isDragging, dragStartDate, dragEndDate, selectedGroupId, addDateRange]);

	useEffect(() => {
		const handleGlobalMouseUp = () => {
			if (isDragging) {
				handleMouseUp();
			}
		};

		window.addEventListener("mouseup", handleGlobalMouseUp);
		return () => window.removeEventListener("mouseup", handleGlobalMouseUp);
	}, [isDragging, handleMouseUp]);

	const getMonthYearKey = (date: Date) => `${getYear(date)}-${getMonth(date)}`;

	const groupedDates = calendarDates.reduce((acc, date) => {
		if (!includeWeekends && isWeekend(date)) {
			return acc;
		}
		const key = getMonthYearKey(date);
		if (!acc[key]) {
			acc[key] = [];
		}
		acc[key].push(date);
		return acc;
	}, {} as { [key: string]: Date[] });

	const getDayClassName = (date: Date): string => {
		let className = "calendar-day";

		if (showToday && checkSameDay(date, today)) {
			className += " today";
		}

		if (!includeWeekends && isWeekend(date)) {
			className += " weekend-hidden";
		}

		if (isDragging && dragStartDate && dragEndDate) {
			const currentDragStart = isBefore(dragStartDate, dragEndDate)
				? dragStartDate
				: dragEndDate;
			const currentDragEnd = isAfter(dragEndDate, dragStartDate)
				? dragEndDate
				: dragStartDate;

			if (date >= currentDragStart && date <= currentDragEnd) {
				className += " dragging";
			}
		}

		return className;
	};

	const getRangeStyles = (date: Date): React.CSSProperties[] => {
		const styles: React.CSSProperties[] = [];

		eventGroups.forEach((group) => {
			if (isDateInRange(date, group)) {
				styles.push({
					backgroundColor: group.color + "80",
					position: "absolute",
					left: 0,
					right: 0,
					opacity: 0.7,
				});
			}
		});

		return styles;
	};

	return (
		<div className="calendar-container" ref={calendarGridRef}>
			{Object.entries(groupedDates).map(([monthYearKey, datesInMonth]) => {
				const [year, monthIndex] = monthYearKey.split("-").map(Number);
				const monthDate = new Date(year, monthIndex);
				const firstDayOfMonth = datesInMonth[0];
				const dayOfWeek = (getDay(firstDayOfMonth) + 6) % 7;
				const paddingDays = Array.from({ length: dayOfWeek });

				return (
					<div key={monthYearKey} className="calendar-month">
						<h3>{format(monthDate, "MMMM yyyy")}</h3>
						<div
							className={`calendar-grid ${
								!includeWeekends ? "weekends-hidden" : ""
							}`}
						>
							{["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
								.filter((_, index) => includeWeekends || index < 5)
								.map((day) => (
									<div key={day} className="weekday-header">
										{day}
									</div>
								))}

							{paddingDays.map((_, index) => (
								<div key={`padding-${index}`} className="calendar-day empty" />
							))}

							{datesInMonth.map((date) => (
								<div
									key={formatISO(date)}
									className={getDayClassName(date)}
									onMouseDown={() => handleMouseDown(date)}
									onMouseEnter={() => handleMouseMove(date)}
								>
									<span className="day-number">{getDate(date)}</span>
									<div className="range-indicators">
										{getRangeStyles(date).map((style, index) => (
											<div
												key={`range-${index}`}
												className="range-indicator"
												style={style}
											/>
										))}
									</div>
								</div>
							))}
						</div>
					</div>
				);
			})}
		</div>
	);
};

export default Calendar;
