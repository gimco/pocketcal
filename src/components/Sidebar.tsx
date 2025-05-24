import React, { useState, useEffect } from "react";
import { useStore, EventGroup, MAX_GROUPS } from "../store";
import { format } from "date-fns";
import CalIcon from "./icons/CalIcon";
import PencilIcon from "./icons/PencilIcon";
import TrashIcon from "./icons/TrashIcon";
import XIcon from "./icons/XIcon";
import SaveIcon from "./icons/SaveIcon";
import PlusIcon from "./icons/PlusIcon";
import SettingsIcon from "./icons/SettingsIcon";

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
		if (eventGroups.length < MAX_GROUPS) {
			const newGroup = addEventGroup("New Group");
			selectEventGroup(newGroup.id);
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
		selectEventGroup(group.id);
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
			<h2 className="logo">
				Pocket<span>Cal</span>
			</h2>

			<h3>
				<CalIcon height={20} />
				Event Groups ({eventGroups.length}/{MAX_GROUPS})
			</h3>
			<div className="event-groups-list">
				{eventGroups.map((group) => (
					<div
						key={group.id}
						className={`event-group-item ${
							selectedGroupId === group.id ? "selected" : ""
						} ${editingGroup?.id === group.id ? "editing" : ""}`}
						onClick={() =>
							editingGroup?.id !== group.id && selectEventGroup(group.id)
						}
					>
						<span
							className="color-indicator"
							style={{ backgroundColor: group.color }}
						></span>
						{editingGroup?.id === group.id ? (
							<>
								<input
									type="text"
									value={newEventName}
									onChange={(e) => setNewEventName(e.target.value)}
									onClick={(e) => e.stopPropagation()}
									autoFocus
								/>
								<button
									onClick={(e) => {
										e.stopPropagation();
										handleUpdateGroup();
									}}
								>
									<SaveIcon color="#000" />
								</button>
								<button
									onClick={(e) => {
										e.stopPropagation();
										handleCancelEdit();
									}}
								>
									<XIcon color="#000" />
								</button>
							</>
						) : (
							<>
								<span className="group-name">{group.name}</span>
								<div className="group-actions">
									<button
										onClick={(e) => {
											e.stopPropagation();
											handleEditClick(group);
										}}
										disabled={!!editingGroup}
									>
										<PencilIcon color="#000" />
									</button>
									<button
										onClick={(e) => {
											e.stopPropagation();
											deleteEventGroup(group.id);
										}}
										disabled={!!editingGroup}
									>
										<TrashIcon color="#000" />
									</button>
								</div>
							</>
						)}
					</div>
				))}
			</div>

			{eventGroups.length < MAX_GROUPS && (
				<button
					className="add-group-button"
					onClick={handleAddGroup}
					disabled={!!editingGroup}
				>
					<PlusIcon height={18} /> Add new group
				</button>
			)}

			<>
				<h3>
					<SettingsIcon height={20} /> Settings
				</h3>
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
			</>
		</div>
	);
}

export default Sidebar;
