import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  id: string;
}

class DeleteTransactionService {
  public async execute({ id }: Request): Promise<any> {
    const transactionRepository = getCustomRepository(TransactionsRepository);
    const transaction = await transactionRepository.findOne({ where: { id } });
    if (transaction) {
      const { type, value } = transaction;
      if (type === 'income') {
        const { income, outcome } = await transactionRepository.getBalance();

        if (income - value < outcome) {
          throw new AppError(
            'You cannot delete a income that make your income less than your outcome.',
          );
        }
      }
    }

    return transactionRepository.delete(id);
  }
}

export default DeleteTransactionService;
