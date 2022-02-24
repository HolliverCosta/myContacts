const ContactRepository = require('../repositorys/ContactRepository');

class ContactController {
  async index(request, response) {
    const { orderBy } = request.query;
    const contacts = await ContactRepository.findAll(orderBy);

    response.json(contacts);
  }

  async show(request, response) {
    const { id } = request.params;

    const contact = await ContactRepository.findById(id);

    if (!contact) {
      return response.status(404).json({ error: 'Contact not found' });
    }

    response.json(contact);
  }

  async delete(request, response) {
    const { id } = request.params;

    const contact = await ContactRepository.findById(id);

    if (!contact) {
      return response.status(404).json({ error: 'Contact not found' });
    }

    await ContactRepository.delete(id);

    response.sendStatus(204);
  }

  async store(request, response) {
    const {
      name, email, phone, category_id,
    } = request.body;

    if (!name) {
      return response.status(400).json({ error: 'name is required' });
    }

    const contactExist = await ContactRepository.findByEmail(email);

    if (contactExist) {
      return response.status(400).json({ error: 'Email already exists' });
    }

    const newContact = await ContactRepository.create({
      name,
      email,
      phone,
      category_id,
    });

    response.json(newContact);
  }

  async update(request, response) {
    const { id } = request.params;
    const {
      name, email, phone, category_id,
    } = request.body;

    const contactExist = await ContactRepository.findById(id);

    if (!contactExist) {
      return response.status(404).json({ error: 'Contact not found' });
    }

    if (!name) {
      return response.status(400).json({ error: 'name is required' });
    }
    const contactExistByEmail = await ContactRepository.findByEmail(email);

    if (contactExistByEmail && contactExistByEmail.id !== id) {
      return response.status(400).json({ error: 'Email already exists' });
    }
    const contact = await ContactRepository.update(id, {
      name, email, phone, category_id,
    });

    response.json(contact);
  }
}

module.exports = new ContactController();
