import { Column } from "../../controls/AVGrid/avGridTypes";
import ReactDOMServer from "react-dom/server";
import { recordsToCsv } from "./csvUtils";

const color = {
    border: "silver",
    text: "black",
    headerBackground: "lightgray",
	background: "white",
}

const styles = {
	cell: {
		border: 'none',
		borderBottom: `solid 1px ${color.border}`,
		textAlign: "left",
		padding: "2px 4px",
	} as React.CSSProperties,
	dataRow: {
		color: color.text,
	},
	headerRow: {
		backgroundColor: color.headerBackground,
		color: color.text,
	},
	table: {
		fontFamily: "Open Sans sans-serif",
		fontSize: 12,
		border: `solid 1px ${color.border}`,
		borderCollapse: "collapse",
		backgroundColor: color.background,
	} as React.CSSProperties,
};

const renderHeader = (columns: Column[]) => {
	return (
		<tr style={styles.headerRow}>
			{columns.map(c => (
				<th style={{ ...styles.cell, fontWeight: 600 }} key={c.key.toString()}>
					{c.name}
				</th>
			))}
		</tr>
	);
};

const renderRows = (rows: any[], columns: Column[]) => {
	return rows.map((row, idx) => (
		<tr style={styles.dataRow} key={idx}>
			{columns.map(c => (
				<th style={{ ...styles.cell, fontWeight: 400 }} key={c.key.toString()}>
					{row[c.key]?.toString()}
				</th>
			))}
		</tr>
	));
};

export function recordsToTableHTML(rows: any[], columns: Column[]) {
	return ReactDOMServer.renderToString(
		<table style={styles.table}>
			<thead>{renderHeader(columns)}</thead>
			<tbody>{renderRows(rows, columns)}</tbody>
		</table>,
	);
}

export async function recordsToClipboardFormatted(rows: any[], columns: Column[]) {
	const formatted = recordsToTableHTML(rows, columns);
	const text = recordsToCsv(rows, columns.map(c => c.key.toString()), { delimiter: "\t" });

	if (Object.prototype.hasOwnProperty.call(Clipboard.prototype, "write")) {
		await navigator.clipboard.write([
			new ClipboardItem({
				"text/html": new Blob([formatted], { type: "text/html" }),
				"text/plain": new Blob([text], { type: "text/plain" }),
			}),
		]);
	} else {
		await navigator.clipboard.writeText(text);
	}
}
