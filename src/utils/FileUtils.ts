import csvParse from 'csv-parse';
import fs from 'fs';
import path from 'path';

export async function csvHeaders(filePath: string) {
  const readCSVStream = fs.createReadStream(filePath);
  const parseStream = csvParse({
    from_line: 1,
    to_line: 1,
    ltrim: true,
    rtrim: true,
  });
  const parseCSV = readCSVStream.pipe(parseStream);

  let headers: any[] = [];

  parseCSV.on('data', line => {
    headers = line;
  });

  await new Promise(resolve => {
    parseCSV.on('end', resolve);
  });

  return headers;
}

export async function loadCSV(filePath: string) {
  const readCSVStream = fs.createReadStream(filePath);

  const parseStream = csvParse({
    from_line: 2,
    ltrim: true,
    rtrim: true,
  });

  const parseCSV = readCSVStream.pipe(parseStream);

  const lines: any[] = [];

  parseCSV.on('data', line => {
    lines.push(line);
  });

  await new Promise(resolve => {
    parseCSV.on('end', resolve);
  });

  return lines;
}

export async function csvToJson(filePath: string) {
  const headers = await csvHeaders(filePath);

  const data = await loadCSV(filePath);

  const json = data.map(d => {
    const json: any = {};
    headers.forEach((header, index) => {
      json[header] = d[index];
    });
    return json;
  });

  return json;
}
