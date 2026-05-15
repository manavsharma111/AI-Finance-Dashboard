import { stringify } from "csv-stringify/browser/esm/sync";

export const exportToCsv = (data, filename="transactions") => {
    try {
        const csvString = stringify(data, {
            header: true,
            columns: ["id", "date", "description", "amount", "type", "category"]
        })
        const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${filename}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error("Error exporting to CSV:", error);
        alert("Error exporting data")
    }
}
