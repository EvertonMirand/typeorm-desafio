import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();
    const [income, outcome] = transactions.reduce(
      (acumulator, { type, value }) => {
        if (type === 'income') {
          // eslint-disable-next-line no-param-reassign
          acumulator[0] += value;
        } else {
          // eslint-disable-next-line no-param-reassign
          acumulator[1] += value;
        }
        return acumulator;
      },
      [0, 0],
    );
    return {
      income,
      outcome,
      total: income - outcome,
    };
  }
}

export default TransactionsRepository;
