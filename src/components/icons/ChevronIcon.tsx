import React from "react";
import { IconProps } from "./SharedProps";

const ChevronIcon: React.FC<IconProps> = ({
	width = 24,
	height = 24,
	color = "currentColor",
}) => {
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
			<path d="M6 9.1L9 12l3 2.9 3-2.9 3-2.9"></path>
		</svg>
	);
};

export default ChevronIcon;
