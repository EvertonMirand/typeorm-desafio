import fs from 'fs';

import { getCustomRepository } from 'typeorm';
import Transaction from '../models/Transaction';

import { csvToJson } from '../utils/FileUtils';
import CreateTransactionService from './CreateTransactionService';
import TransactionsRepository from '../repositories/TransactionsRepository';
import CategoryRepository from '../repositories/CategoryRepository';

interface Request {
  filePath: string;
}

class ImportTransactionsService {
  async execute({ filePath }: Request): Promise<Transaction[]> {
    const values = await csvToJson(filePath);

    const transactionRepository = getCustomRepository(TransactionsRepository);
    const categoryRepository = getCustomRepository(CategoryRepository);

    const transactions = await Promise.all(
      values.map(async ({ title, type, category: categoryTitle, value }) => {
        const category = await categoryRepository.getCategory(categoryTitle);
        const transaction = transactionRepository.create({
          category,
          title,
          value: Number(value),
          type,
        });
        return transaction;
      }),
    );

    await transactionRepository.save(transactions);

    await fs.promises.unlink(filePath);

    return transactions;
  }
}

export default ImportTransactionsService;
