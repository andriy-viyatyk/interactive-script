import { useEffect, useState } from "react";
import styled from "@emotion/styled";

import { ProgressIcon } from "../theme/icons";

const Rotated = styled.span<{ angle: number; size?: number }>(({ angle, size }) => ({
	width: size ?? 32,
	height: size ?? 32,
	"& svg": {
		transform: `rotate(${angle}deg)`,
	},
}));

interface CircularProgressProps {
	size?: number;
    className?: string;
}

function CircularProgressComponent(props: CircularProgressProps) {
	const steps = 10;
	const stepInterval = 150;
	const [currStep, setCurrStep] = useState(0);

	useEffect(() => {
		const intervalId = setInterval(() => {
			setCurrStep(s => s + 1);
		}, stepInterval);
		return () => {
			clearInterval(intervalId);
		};
	}, []);

	const step = currStep % steps;
	const angle = (360 / steps) * step;

	return (
		<Rotated angle={angle} className={props.className} size={props.size}>
			<ProgressIcon />
		</Rotated>
	);
}

export const CircularProgress = styled(CircularProgressComponent)(({ size }) => ({
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	"& svg": {
		width: size ?? 32,
		height: size ?? 32,
	},
}));