const axios = require('axios');

class Cep {
  searchCep() {
    throw new Error('Método searchCep deve ser implementado');
  }
}

class ViaCep extends Cep {
  async searchCep(ceptosearch) {
    try {
      const response = await axios.get(`https://viacep.com.br/ws/${ceptosearch}/json/`);

      const { cep, logradouro, localidade, uf, bairro } = response.data
      return {cep: cep.replace('-', ''), street: logradouro ?? "", neighborhood: bairro ?? "", city: localidade, state: uf, viaapi: true};
    } catch (error) {
      console.error('Erro ao consultar ViaCEP:', error.message);
      throw new Error('Não foi possível consultar o CEP');
    }
  }
}

class BrasilAPI extends Cep {
  async searchCep(cep) {
    try {
      const response = await axios.get(
        `https://brasilapi.com.br/api/cep/v1/${cep}`
      );
      console.log(response.data);
      return {...response.data, viaapi: true};
    } catch (error) {
      console.error('Erro ao consultar Brasil API:', error.message);
      throw new Error('Não foi possível consultar o CEP');
    }
  }
}

module.exports = {
  ViaCep,
  BrasilAPI,
};
