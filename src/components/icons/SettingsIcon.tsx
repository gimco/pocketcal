import React from "react";
import { IconProps } from "./SharedProps";

const SettingsIcon: React.FC<IconProps> = ({
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
			<path d="M15.492 15.842H21m-2.754 0V21m0-18v9.16M3 13.871h5.508m-2.754 0V21m0-18v7.189m9-2.031H9.246m2.754 0V3m0 18v-9.16"></path>
		</svg>
	);
};

export default SettingsIcon;
