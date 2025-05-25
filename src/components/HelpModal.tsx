import React from "react";
import XIcon from "./icons/XIcon";
import { MAX_GROUPS } from "../store";
import "./HelpModal.css";

interface HelpModalProps {
	onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ onClose }) => {
	return (
		<div className="modal-overlay" onClick={onClose}>
			<div className="modal-content" onClick={(e) => e.stopPropagation()}>
				<button
					className="modal-close"
					onClick={onClose}
					aria-label="Close instructions"
				>
					<XIcon color="#000" />
				</button>
				<h2>
					Pocket<span>Cal</span> Instructions
				</h2>
				<div className="instructions-content">
					<h3>Navigation</h3>
					<ul>
						<li>
							<strong>Click</strong> on any date to add/edit events
						</li>
						<li>
							<strong>Tab</strong> to navigate between elements
						</li>
						<li>
							<strong>Arrow keys</strong> to move between dates when calendar is
							focused
						</li>
						<li>
							<strong>Enter</strong> to select/activate focused element
						</li>
						<li>
							<strong>Escape</strong> to cancel editing
						</li>
					</ul>
					<h3>Features</h3>
					<ul>
						<li>
							Create up to {MAX_GROUPS} event groups with different colors
						</li>
						<li>Click the pencil icon to edit group names</li>
						<li>Toggle weekends on/off in settings</li>
						<li>Highlight today's date with the checkbox</li>
						<li>Your data is saved locally in your browser</li>
					</ul>
				</div>
			</div>
		</div>
	);
};

export default HelpModal;
