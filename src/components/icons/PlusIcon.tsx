import React from "react";
import { IconProps } from "./SharedProps";

const PlusIcon: React.FC<IconProps> = ({
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
			<path d="M12 3a9 9 0 11-6.364 2.636A8.972 8.972 0 0112 3zm0 5v8m-4-4h8"></path>
		</svg>
	);
};

export default PlusIcon;
