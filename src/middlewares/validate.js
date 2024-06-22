const statusCode = require('../utils/statusCode');

function validate(req, res, next) {
  const { name, email, phone, cep } = req.body;

  if (!name) {
    return res.status(statusCode.BAD_REQUEST).json({ error: 'Nome é obrigatório' });
  }

  if (!email) {
    return res.status(statusCode.BAD_REQUEST).json({ error: 'E-mail é obrigatório' });
  }

  if (!phone) {
    return res.status(statusCode.BAD_REQUEST).json({ error: 'Telefone é obrigatório' });
  }

  if (!cep) {
    return res.status(statusCode.BAD_REQUEST).json({ error: 'CEP é obrigatório' });
  }

  if(!email.match(/.+\@.+\..+/)) {
    return res.status(statusCode.BAD_REQUEST).json({ error: 'E-mail inválido' });
  }

  if(!phone.match(/^[0-9]{10,20}$/)) {
    return res.status(statusCode.BAD_REQUEST).json({ error: 'Telefone inválido' });
  }

  if(!cep.match(/^[0-9]{8}$/)) {
    return res.status(statusCode.BAD_REQUEST).json({ error: 'CEP inválido' });
  }

  next();
}

module.exports = validate;
