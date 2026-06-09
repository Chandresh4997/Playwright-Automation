import fs from 'fs';
import csv from 'csv-parser';

export async function readCsv(filePath: string) {
  return new Promise<any[]>((resolve, reject) => {
    const results: any[] = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', data => results.push(data))
      .on('end', () => resolve(results))
      .on('error', reject);
  });
}