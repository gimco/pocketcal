import React, { useState, useEffect } from "react";
import { useStore, EventGroup, getMaxGroups } from "../store";
import { format } from "date-fns";
import { t } from "../utils/i18n";
import CalIcon from "./icons/CalIcon";
import PencilIcon from "./icons/PencilIcon";
import TrashIcon from "./icons/TrashIcon";
import XIcon from "./icons/XIcon";
import SaveIcon from "./icons/SaveIcon";
import PlusIcon from "./icons/PlusIcon";
import SettingsIcon from "./icons/SettingsIcon";
import HelpIcon from "./icons/HelpIcon";
import CopyIcon from "./icons/CopyIcon";
import EditIcon from "./icons/EditIcon";

import "./Sidebar.css";

function Sidebar({
	setShowLicenseModal,
}: {
	setShowLicenseModal: (show: boolean) => void;
}) {
	const {
		startDate,
		includeWeekends,
		showToday,
		eventGroups,
		selectedGroupId,
		setStartDate,
		setIncludeWeekends,
		setShowToday,
		setShowHelpModal,
		addEventGroup,
		updateEventGroup,
		deleteEventGroup,
		selectEventGroup,
		isProUser,
	} = useStore();
	const maxGroups = getMaxGroups(isProUser);
	const [newEventName, setNewEventName] = useState("");
	const [editingGroup, setEditingGroup] = useState<EventGroup | null>(null);
	const [isEditMode, setIsEditMode] = useState(false);

	// Add effect to select the first group if none is selected
	useEffect(() => {
		if (!selectedGroupId && eventGroups.length > 0) {
			selectEventGroup(eventGroups[0].id);
		}
	}, [selectedGroupId, eventGroups, selectEventGroup]);

	const handleAddGroup = () => {
		if (eventGroups.length < maxGroups) {
			const newGroup = addEventGroup(t("addNewGroup"));
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

	const handleKeyDown = (e: React.KeyboardEvent, group: EventGroup) => {
		if (e.key === "Enter") {
			e.preventDefault();
			if (editingGroup?.id !== group.id) {
				selectEventGroup(group.id);
			}
		}
	};

	const handleCopyUrl = () => {
		navigator.clipboard.writeText(window.location.href);
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

	const footerGroups = () => {
		let editModeButton = (
			<div className="sidebar-footer-buttons">
				<button
					className="footer-button"
					onClick={() => setIsEditMode(!isEditMode)}
					aria-label={isEditMode ? t("exitEditMode") : t("editMode")}
				>
					<EditIcon color="#000" /> {isEditMode ? t("exitEditMode") : t("editMode")}
				</button>
			</div>
		);

		// Solo mostrar otros botones en modo de edición
		if (!isEditMode) {
			return [editModeButton];
		}

		let proButton = (
			<div className="sidebar-footer-buttons">
				<button
					className="footer-button"
					onClick={() => setShowLicenseModal(true)}
					aria-label={t("showLicenseModal")}
				>
					{isProUser ? t("thanksForPro") : t("goPro")}
				</button>
			</div>
		);
		let helpAndCopyButtons = (
			<div className="sidebar-footer-buttons">
				<button
					className="footer-button"
					onClick={() => setShowHelpModal(true)}
					aria-label={t("showInstructions")}
				>
					<HelpIcon color="#000" /> {t("help")}
				</button>
				<button
					className="footer-button"
					onClick={handleCopyUrl}
					aria-label={t("copyUrlToClipboard")}
				>
					<CopyIcon color="#000" /> {t("copyUrl")}
				</button>
			</div>
		);

		return isProUser
			? [editModeButton, helpAndCopyButtons, proButton]
			: [editModeButton, proButton, helpAndCopyButtons];
	};

	return (
		<div className="sidebar">
			<h1 className="logo">
				Pocket<span className="logo-cal">Cal</span>{" "}
				{isProUser && <span className="pro-badge">Pro</span>}
			</h1>

			<h3>
				<CalIcon height={20} />
				{t("eventGroups")} ({eventGroups.length}/{maxGroups})
			</h3>
			<div className="event-groups-list" role="list">
				{eventGroups.map((group) => (
					<div
						key={group.id}
						className={`event-group-item ${
							selectedGroupId === group.id ? "selected" : ""
						} ${editingGroup?.id === group.id ? "editing" : ""}`}
						onClick={() =>
							editingGroup?.id !== group.id && selectEventGroup(group.id)
						}
						onKeyDown={(e) => handleKeyDown(e, group)}
						tabIndex={editingGroup?.id !== group.id ? 0 : -1}
						role="listitem"
						aria-selected={selectedGroupId === group.id}
						aria-label={`${t("eventGroup")} ${group.name}`}
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
									onKeyDown={(e) => {
										if (e.key === "Enter") {
											handleUpdateGroup();
										} else if (e.key === "Escape") {
											handleCancelEdit();
										}
									}}
									autoFocus
									className="group-name-input"
									aria-label={t("editGroupName")}
								/>
								<div className="group-actions">
									<button
										onClick={(e) => {
											e.stopPropagation();
											handleUpdateGroup();
										}}
										className="save-button"
										aria-label={t("saveGroupName")}
									>
										<SaveIcon color="#000" />
									</button>
									<button
										onClick={(e) => {
											e.stopPropagation();
											handleCancelEdit();
										}}
										className="cancel-button"
										aria-label={t("cancelEditing")}
									>
										<XIcon color="#000" />
									</button>
								</div>
							</>
						) : (
							<>
								<span className="group-name">{group.name}</span>
								{isEditMode && (
									<div className="group-actions">
										<button
											onClick={(e) => {
												e.stopPropagation();
												handleEditClick(group);
											}}
											disabled={!!editingGroup}
											className="edit-button"
											aria-label={`${t("edit")} ${group.name}`}
										>
											<PencilIcon color="#000" />
										</button>
										<button
											onClick={(e) => {
												e.stopPropagation();
												deleteEventGroup(group.id);
											}}
											disabled={!!editingGroup}
											className="delete-button"
											aria-label={`${t("delete")} ${group.name}`}
										>
											<TrashIcon color="#000" />
										</button>
									</div>
								)}
							</>
						)}
					</div>
				))}
			</div>

			{isEditMode && eventGroups.length < maxGroups && (
				<button
					className="add-group-button"
					onClick={handleAddGroup}
					disabled={!!editingGroup}
				>
					<PlusIcon height={18} /> {t("addNewGroup")}
				</button>
			)}

			{isEditMode && (
				<>
					<h3>
						<SettingsIcon height={20} /> {t("settings")}
					</h3>
					<div className="setting-item">
						<label htmlFor="start-date">{t("startMonth")}</label>
						<input
							type="month"
							id="start-date"
							value={format(startDate, "yyyy-MM")}
							onChange={handleStartDateChange}
						/>
					</div>
					<div className="setting-item">
						<label htmlFor="include-weekends">{t("includeWeekends")}</label>
						<input
							type="checkbox"
							id="include-weekends"
							checked={includeWeekends}
							onChange={(e) => setIncludeWeekends(e.target.checked)}
						/>
					</div>
					<div className="setting-item">
						<label htmlFor="show-today">{t("highlightToday")}</label>
						<input
							type="checkbox"
							id="show-today"
							checked={showToday}
							onChange={(e) => setShowToday(e.target.checked)}
						/>
					</div>
				</>
			)}

			<div className="sidebar-footer">{footerGroups()}</div>
		</div>
	);
}

export default Sidebar;
