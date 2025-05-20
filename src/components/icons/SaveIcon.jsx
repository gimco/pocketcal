import React from "react";

const SaveIcon = ({ width = 24, height = 24, color = "currentColor" }) => {
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
			<path d="M7.356 20.852v-7.814h9.288v7.814M7.356 3.069V8.41h8.952M15.907 3H5.079A2.086 2.086 0 003 5.079v13.842A2.086 2.086 0 005.079 21h13.842A2.086 2.086 0 0021 18.921V8.093z"></path>
		</svg>
	);
};

export default SaveIcon;
