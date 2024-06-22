const express = require('express');
const router = express.Router();
const Client = require('./models/Client');
const statusCode = require('./utils/statusCode');
const Address = require('./models/Address');
const validate = require('./middlewares/validate');

const { BrasilAPI, ViaCep } = require('./utils/Cep');

const cepService = new BrasilAPI();

router.post('/clients', validate, async (req, res) => {
  try {
    const { name, email, phone, cep } = req.body;

    const existingClient = await Client.findOne({ email: email });
    if (existingClient) {
      return res
        .status(statusCode.BAD_REQUEST)
        .json({ error: 'E-mail já cadastrado' });
    }

    const address =
      (await Address.findOne({ cep: cep })) ??
      (await cepService.searchCep(cep));

    if (address.viaapi) {
      const newAddress = new Address({
        cep: address.cep,
        state: address.state,
        city: address.city,
        neighborhood: address.neighborhood,
        street: address.street,
      });

      await newAddress.save();
    }

    if (!address || address.erro) {
      return res
        .status(statusCode.BAD_REQUEST)
        .json({ error: 'CEP inválido ou não encontrado' });
    }

    const formattedCep = address.cep.replace('-', '');

    const newClient = new Client({
      name: name,
      email: email,
      phone: phone,
      address: {
        cep: formattedCep,
        street: address.street,
        neighborhood: address.neighborhood,
        city: address.city,
        state: address.state,
      },
    });

    const savedClient = await newClient.save();

    const responseClient = {
      id: savedClient._id,
      name: savedClient.name,
      email: savedClient.email,
      phone: savedClient.phone,
      address: savedClient.address,
    };

    res.status(statusCode.CREATED).json(responseClient);
  } catch (error) {
    res.status(statusCode.BAD_REQUEST).json({ error: error.message });
  }
});

router.get('/clients', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;

    const clients = await Client.find()
      .skip(offset)
      .limit(limit)
      .select('id name');

    const totalCount = await Client.countDocuments();

    let previous = null;
    let next = null;
    if (offset > 0) {
      previous = `http://localhost:8080/api/v1/clients?limit=${limit}&offset=${
        offset - limit
      }`;
    }
    if (offset + limit < totalCount) {
      next = `http://localhost:8080/api/v1/clients?limit=${limit}&offset=${
        offset + limit
      }`;
    }

    const response = {
      count: clients.length,
      previous: previous,
      next: next,
      results: clients.map((client) => ({
        id: client._id,
        name: client.name,
      })),
    };

    res.status(statusCode.OK).json(response);
  } catch (error) {
    res.status(statusCode.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
});

router.get('/clients/search', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;
    const nameQuery = req.query.name || '';

    const query = { name: { $regex: nameQuery, $options: 'i' } };
    const clients = await Client.find(query)
      .skip(offset)
      .limit(limit)
      .select('id name');

    const response = {
      count: clients.length,
      results: clients.map((client) => ({
        id: client._id,
        name: client.name,
      })),
    };

    res.status(statusCode.OK).json(response);
  } catch (error) {
    res.status(statusCode.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
});

router.get('/clients/:id', async (req, res) => {
  try {
    const clientId = req.params.id;

    const client = await Client.findById(clientId).select(
      'id name email phone address'
    );

    if (!client) {
      return res
        .status(statusCode.NOT_FOUND)
        .json({ error: 'Cliente não encontrado' });
    }

    const response = {
      id: client._id,
      name: client.name,
      email: client.email,
      phone: client.phone,
      address: {
        cep: client.address.cep,
        street: client.address.street,
        neighborhood: client.address.neighborhood,
        city: client.address.city,
        state: client.address.state,
      },
    };

    res.status(statusCode.OK).json(response);
  } catch (error) {
    res.status(statusCode.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
});

router.delete('/clients/:id', async (req, res) => {
  try {
    const clientId = req.params.id;

    if (!clientId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(statusCode.BAD_REQUEST).json({ error: 'ID inválido' });
    }

    const deletedClient = await Client.findByIdAndDelete(clientId);

    if (!deletedClient) {
      return res
        .status(statusCode.NOT_FOUND)
        .json({ error: 'Cliente não encontrado' });
    }

    res.json({ message: 'Cliente deletado com sucesso' });
  } catch (error) {
    res.status(statusCode.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
});

module.exports = router;
