import React from "react";
import { IconProps } from "./SharedProps";

const HelpIcon: React.FC<IconProps> = ({
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
			<path d="M12 3a9 9 0 11-6.364 2.636A8.972 8.972 0 0112 3zm0 13.7v-.1h0m-2.8-6.4a2.8 2.8 0 015.6 0 2.45 2.45 0 01-.95 1.813C13.3 12.525 12.6 13 12 13.6"></path>
		</svg>
	);
};

export default HelpIcon;
