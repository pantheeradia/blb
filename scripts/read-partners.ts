import * as XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';

const excelPath = path.resolve('C:/Users/HP/Downloads/B2B CUSTOMER DATABASE (1).xlsx');

try {
  const workbook = XLSX.readFile(excelPath);
  console.log('Sheet names:', workbook.SheetNames);

  // Read the first sheet
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

  console.log('\nFirst sheet:', firstSheetName);
  console.log('All rows preview:');
  console.log(data.slice(0, 10));

  // Headers are in row 2 (index 1)
  const headers = data[1] as string[];
  console.log('\nActual headers:', headers);

  // Extract partner names from column 2 (index 1)
  const partners: Array<{ name: string; address: string; contact: string; owner: string; website?: string }> = [];
  for (let i = 2; i < data.length; i++) {
    const row = data[i] as any[];
    if (row && row[1]) {
      partners.push({
        name: row[1],
        address: row[2] || '',
        contact: row[3] || '',
        owner: row[4] || '',
        website: row[5] || undefined // Check if there's a website column
      });
    }
  }

  console.log('\nTotal partners found:', partners.length);
  console.log('\nFirst 10 partners:');
  console.log(partners.slice(0, 10));

  // Check for any additional columns that might contain URLs
  if (data.length > 2) {
    const rowLength = (data[2] as any[]).length;
    console.log('\nNumber of columns in data rows:', rowLength);
    console.log('\nSample full row (row 3):');
    console.log(data[2]);
  }

  // Save partners data
  fs.writeFileSync(
    path.join(__dirname, '../partners-data.json'),
    JSON.stringify(partners, null, 2)
  );
  console.log('\nPartners data saved to partners-data.json');

} catch (error) {
  console.error('Error reading Excel file:', error);
}
