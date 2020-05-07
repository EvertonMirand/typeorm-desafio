import { EntityRepository, Repository } from 'typeorm';

import Category from '../models/Category';

interface CategoryModel {
  title: string;
}

@EntityRepository(Category)
class CategoryRepository extends Repository<Category> {
  public async getCategory({ title }: CategoryModel): Promise<Category> {
    let category = await this.findOne({ where: { title } });

    if (!category) {
      category = this.create({ title });
      this.save(category);
    }

    return category;
  }
}

export default CategoryRepository;
