import { getCustomRepository } from 'typeorm';
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';
import CategoryRepository from '../repositories/CategoryRepository';
import AppError from '../errors/AppError';

interface CategoryRequest {
  title: string;
}

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: CategoryRequest;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category: { title: categoryTitle },
  }: Request): Promise<Transaction> {
    const transactionRepository = getCustomRepository(TransactionsRepository);
    const categoryRepository = getCustomRepository(CategoryRepository);

    const category = await categoryRepository.getCategory({
      title: categoryTitle,
    });

    if (type === 'outcome') {
      const { total } = await transactionRepository.getBalance();

      if (value > total) {
        throw new AppError(
          'Value of outcome cannot be greater than your total.',
        );
      }
    }

    const transaction = transactionRepository.create({
      category,
      title,
      value: Number(value),
      type,
    });

    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
