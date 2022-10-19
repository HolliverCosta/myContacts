const CategoryRepository = require('../repositorys/CategoryRepository');

class CategoryController {
  async index(request, response) {
    const { orderBy } = request.query;
    const categories = await CategoryRepository.findAll(orderBy);

    response.json(categories);
  }

  async store(request, response) {
    const { name } = request.body;

    if (!name) {
      return response.status(400).json({ error: 'name is required' });
    }

    const newCategory = await CategoryRepository.create({
      name,
    });

    response.status(201).json(newCategory);
  }

  async delete(request, response) {
    const { id } = request.params;

    const categories = await CategoryRepository.findById(id);

    if (!categories) {
      return response.status(404).json({ error: 'Category not found' });
    }

    await CategoryRepository.delete(id);

    response.sendStatus(204);
  }

  async update(request, response) {
    const { id } = request.params;
    const { name } = request.body;

    const categoriesExist = await CategoryRepository.findById(id);

    if (!categoriesExist) {
      return response.status(404).json({ error: 'Category not found' });
    }

    const contact = await CategoryRepository.update(id, {
      name,
    });

    response.json(contact);
  }
}

module.exports = new CategoryController();
