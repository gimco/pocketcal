import React from "react";

const PlusIcon = ({ width = 24, height = 24, color = "currentColor" }) => {
	return (
		<svg
			width={width}
			height={height}
			viewBox="0 0 24 24"
			fill="none"
			stroke={color}
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path d="M12 4v16m8-8H4"></path>
		</svg>
	);
};

export default PlusIcon;
