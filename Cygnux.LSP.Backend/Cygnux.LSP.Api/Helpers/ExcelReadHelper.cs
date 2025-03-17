using ClosedXML.Excel;

namespace Cygnux.LSP.Api.Helpers;
public static class ExcelReadHelper
{
    public static List<Dictionary<string, string>> ExtractAllRows(IFormFile file)
    {
        var allRows = new List<Dictionary<string, string>>();

        using (var stream = new MemoryStream())
        {
            file.CopyTo(stream);
            using var workbook = new XLWorkbook(stream);
            var worksheet = workbook.Worksheet(1); // First sheet
            var columnHeaders = worksheet.Row(1).Cells().Select(c => c.Value.ToString()).ToList();

            // Read each row and store data in a dictionary
            foreach (var row in worksheet.RowsUsed().Skip(1)) // Skip header row
            {
                var rowData = new Dictionary<string, string>();
                for (int col = 1; col <= columnHeaders.Count; col++)
                {
                    rowData[columnHeaders[col - 1]] = row.Cell(col).Value.ToString();
                }
                allRows.Add(rowData);
            }
        }

        return allRows;
    }

}
