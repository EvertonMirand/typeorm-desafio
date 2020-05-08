import { EntityRepository, Repository } from 'typeorm';

import Category from '../models/Category';

@EntityRepository(Category)
class CategoryRepository extends Repository<Category> {
  public async getCategory(title: string): Promise<Category> {
    try {
      const category = await this.findOneOrFail({
        where: { title },
      });
      return category;
    } catch {
      const category = this.create({ title });
      await this.save(category);
      return category;
    }
  }
}

export default CategoryRepository;
