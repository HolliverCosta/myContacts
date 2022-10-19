const ContactRepository = require('../repositorys/ContactRepository');
const isValidUUID = require('../utils/isValidUUID');
class ContactController {
  async index(request, response) {
    const { orderBy } = request.query;
    const contacts = await ContactRepository.findAll(orderBy);

    response.json(contacts);
  }

  async show(request, response) {
    const { id } = request.params;

    if(!isValidUUID(id)){
      return response.status(400).json({ error: 'Invalid user id' })
    }

    const contact = await ContactRepository.findById(id);

    if (!contact) {
      return response.status(404).json({ error: 'Contact not found' });
    }
    response.json(contact);
  }

  async delete(request, response) {
    const { id } = request.params;

    if(!isValidUUID(id)){
      return response.status(400).json({ error: 'Invalid user id' })
    }

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

    if(category_id && !isValidUUID(category_id)){
      return response.status(400).json({ error: 'Invalid category id' })
    }
    if (!name) {
      return response.status(400).json({ error: 'name is required' });
    }

   if(email){
      const contactExist = await ContactRepository.findByEmail(email);

      if (contactExist) {
        return response.status(400).json({ error: 'Email already exists' });
      }
   }

    const newContact = await ContactRepository.create({
      name,
      email: email || null,
      phone,
      category_id: category_id || null,
    });

    response.status(201).json(newContact);
  }

  async update(request, response) {
    const { id } = request.params;
    const {
      name, email, phone, category_id,
    } = request.body;

    if(!isValidUUID(id)){
      return response.status(400).json({ error: 'Invalid user id' })
    }
    if(category_id && !isValidUUID(category_id)){
      return response.status(400).json({ error: 'Invalid category id' })
    }
    if (!name) {
      return response.status(400).json({ error: 'name is required' });
    }
    const contactExist = await ContactRepository.findById(id);

    if (!contactExist) {
      return response.status(404).json({ error: 'Contact not found' });
    }

    if(email){
      const contactExistByEmail = await ContactRepository.findByEmail(email);
  
      if (contactExistByEmail && contactExistByEmail.id !== id) {
        return response.status(400).json({ error: 'Email already exists' });
      }
    }

    const contact = await ContactRepository.update(id, {
      name, 
      email: email || null, 
      phone, 
      category_id: category_id || null,
    });

    response.json(contact);
  }
}

module.exports = new ContactController();
