import React, { useState, useEffect } from "react";
import { useStore, EventGroup, MAX_GROUPS } from "../store";
import { format } from "date-fns";
import "./Sidebar.css";

function Sidebar() {
	const {
		startDate,
		includeWeekends,
		showToday,
		eventGroups,
		selectedGroupId,
		setStartDate,
		setIncludeWeekends,
		setShowToday,
		addEventGroup,
		updateEventGroup,
		deleteEventGroup,
		selectEventGroup,
	} = useStore();

	const [newEventName, setNewEventName] = useState("");
	const [editingGroup, setEditingGroup] = useState<EventGroup | null>(null);

	// Add effect to select the first group if none is selected
	useEffect(() => {
		if (!selectedGroupId && eventGroups.length > 0) {
			selectEventGroup(eventGroups[0].id);
		}
	}, [selectedGroupId, eventGroups, selectEventGroup]);

	const handleAddGroup = () => {
		if (newEventName.trim()) {
			addEventGroup(newEventName.trim());
			setNewEventName("");
		}
	};

	const handleUpdateGroup = () => {
		if (editingGroup && newEventName.trim()) {
			updateEventGroup(editingGroup.id, newEventName.trim());
			setEditingGroup(null);
			setNewEventName("");
		}
	};

	const handleEditClick = (group: EventGroup) => {
		setEditingGroup(group);
		setNewEventName(group.name);
		selectEventGroup(group.id); // Also select it when editing
	};

	const handleCancelEdit = () => {
		setEditingGroup(null);
		setNewEventName("");
	};

	const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		try {
			const [year, month] = e.target.value.split("-").map(Number);
			if (year && month) {
				const newDate = new Date(year, month - 1, 1);
				setStartDate(newDate);
			}
		} catch (error) {
			console.error("Invalid date format", error);
		}
	};

	return (
		<div className="sidebar">
			<h2>PocketCal</h2>
			<div className="setting-item">
				<label htmlFor="start-date">Start Month:</label>
				<input
					type="month"
					id="start-date"
					value={format(startDate, "yyyy-MM")}
					onChange={handleStartDateChange}
				/>
			</div>
			<div className="setting-item">
				<label htmlFor="include-weekends">Include Weekends:</label>
				<input
					type="checkbox"
					id="include-weekends"
					checked={includeWeekends}
					onChange={(e) => setIncludeWeekends(e.target.checked)}
				/>
			</div>
			<div className="setting-item">
				<label htmlFor="show-today">Highlight Today:</label>
				<input
					type="checkbox"
					id="show-today"
					checked={showToday}
					onChange={(e) => setShowToday(e.target.checked)}
				/>
			</div>

			<h3>
				Event Groups ({eventGroups.length}/{MAX_GROUPS})
			</h3>
			<div className="event-groups-list">
				{eventGroups.map((group) => (
					<div
						key={group.id}
						className={`event-group-item ${
							selectedGroupId === group.id ? "selected" : ""
						}`}
						onClick={() => selectEventGroup(group.id)}
					>
						<span
							className="color-indicator"
							style={{ backgroundColor: group.color }}
						></span>
						{editingGroup?.id === group.id ? (
							<span>Editing...</span>
						) : (
							<span>{group.name}</span>
						)}
						<div>
							<button
								onClick={(e) => {
									e.stopPropagation();
									handleEditClick(group);
								}}
								disabled={!!editingGroup}
							>
								Edit
							</button>
							<button
								onClick={(e) => {
									e.stopPropagation();
									deleteEventGroup(group.id);
								}}
								disabled={!!editingGroup}
							>
								Delete
							</button>
						</div>
					</div>
				))}
			</div>

			{eventGroups.length < MAX_GROUPS && (
				<div className="add-event-group">
					<h3>{editingGroup ? "Edit Event Group" : "Add New Event Group"}</h3>
					<input
						type="text"
						placeholder="Group Name"
						value={newEventName}
						onChange={(e) => setNewEventName(e.target.value)}
					/>
					{editingGroup ? (
						<div>
							<button onClick={handleUpdateGroup}>Update Group</button>
							<button onClick={handleCancelEdit}>Cancel</button>
						</div>
					) : (
						<button onClick={handleAddGroup} disabled={!newEventName.trim()}>
							Add Group
						</button>
					)}
				</div>
			)}
		</div>
	);
}

export default Sidebar;
