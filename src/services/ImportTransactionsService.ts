import fs from 'fs';

import Transaction from '../models/Transaction';

import { csvToJson } from '../utils/FileUtils';
import CreateTransactionService from './CreateTransactionService';

interface Request {
  filePath: string;
}

class ImportTransactionsService {
  async execute({ filePath }: Request): Promise<Transaction[]> {
    const value = await csvToJson(filePath);

    const createTransaction = new CreateTransactionService();

    const transactionsPromise = value.map(async val =>
      createTransaction.execute(val),
    );
    const transactions = await Promise.all(transactionsPromise);

    await fs.promises.unlink(filePath);

    return transactions;
  }
}

export default ImportTransactionsService;
