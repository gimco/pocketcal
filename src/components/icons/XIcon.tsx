import React from "react";
import { IconProps } from "./SharedProps";

const XIcon: React.FC<IconProps> = ({
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
			<path d="M5.636 5.636l12.728 12.728m-12.728 0L18.364 5.636m0 0"></path>
		</svg>
	);
};

export default XIcon;
