import React from "react";
import { IconProps } from "./SharedProps";

const CopyIcon: React.FC<IconProps> = ({
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
			<path d="M19 21H9.4a2 2 0 01-2-2V9.4a2 2 0 012-2H19a2 2 0 012 2V19a2 2 0 01-2 2zM7.3 16.6H5a2.006 2.006 0 01-2-2V5a2.008 2.008 0 012-2h9.6a2.006 2.006 0 012 2v2.3"></path>
		</svg>
	);
};

export default CopyIcon;
