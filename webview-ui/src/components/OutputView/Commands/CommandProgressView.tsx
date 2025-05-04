import styled from "@emotion/styled";
import { ProgressCommand } from "../../../../../shared/commands/output-progress";
import { CircularProgress } from "../../../controls/CircularProgress";
import { CheckIcon } from "../../../theme/icons";
import color from "../../../theme/color";
import { UiTextView } from "../UiTextView";

const CommandProgressViewRoot = styled.div({
    display: "flex",
    alignItems: "center",
    columnGap: 4,
    "& .completed-icon": {
    },
    "& .progress-label": {},
    "& .progress-indicator": {
        width: 16,
        height: 16,
    },
});

const barWidth = 140;

const ProgressBarRoot = styled.div({
    width: barWidth,
    height: 18,
    position: "relative",
    boxSizing: "border-box",
    overflow: "hidden",
    border: `1px solid ${color.border.default}`,
    "& .inner-bar": {
        backgroundColor: color.background.light,
        height: "100%",
    },
    "& .percentage": {
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
    },
});

function ProgressBar({
    max,
    value,
}: Readonly<{ max?: number; value?: number }>) {
    if (!max) return null;

    const percentage = (((value ?? 0) / max) * 100).toFixed(0);
    const innerBarWidth = ((value ?? 0) / max) * barWidth;
    return (
        <ProgressBarRoot>
            <div className="inner-bar" style={{ width: innerBarWidth }}>
                <span className="percentage">{percentage}%</span>
            </div>
        </ProgressBarRoot>
    );
}

interface ProgressCommandViewProps {
    item: ProgressCommand;
}

export function CommandProgressView({
    item,
}: Readonly<ProgressCommandViewProps>) {
    const { data } = item;
    const completed = data?.completed || false;

    return (
        <CommandProgressViewRoot className="dialog-progress">
            {completed ? (
                <CheckIcon width={16} height={16} className="completed-icon" />
            ) : (
                <CircularProgress className="progress-indicator" />
            )}
            <ProgressBar max={data?.max} value={data?.value} />
            <div className="progress-label">
                <UiTextView uiText={data?.label} />
            </div>
        </CommandProgressViewRoot>
    );
}
