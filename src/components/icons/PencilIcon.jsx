import React from "react";

const PencilIcon = ({ width = 24, height = 24, color = "currentColor" }) => {
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
			<path d="M20.1 3.9l-.085-.082a3.085 3.085 0 00-1.093-.65A3.2 3.2 0 0017.9 3a3.1 3.1 0 00-2.2.9l-6.35 6.35L3 16.6V21h4.4l6.35-6.35L20.1 8.3a3.1 3.1 0 00.9-2.2 3.173 3.173 0 00-.245-1.224A3.075 3.075 0 0020.1 3.9z"></path>
		</svg>
	);
};

export default PencilIcon;
