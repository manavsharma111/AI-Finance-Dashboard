import * as XLSX from "xlsx"

export const exportToExcel = (data, filename="transactions") => {
    if(!data || data.length === 0){
        alert("No data found!!!")
        return;
    }
    try{
        const worksheet = XLSX.utils.json_to_sheet(data)
        const workbook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions")
        XLSX.writeFile(workbook, `${filename}.xlsx`, {
            bookType: 'xlsx',
            type: 'buffer'
        })
    }catch(error){
        console.error("Error exporting to Excel:", error)
        alert("Error exporting data")   
    }
}
