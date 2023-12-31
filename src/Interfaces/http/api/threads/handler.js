/* eslint-disable no-underscore-dangle */
const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const GetThreadByIdUseCase = require('../../../../Applications/use_case/GetThreadByIdUseCase');
const DomainErrorTranslator = require('../../../../Commons/exceptions/DomainErrorTranslator');

class ThreadHandler {
  constructor(container) {
    this._container = container;
    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.getThreadByIdHandler = this.getThreadByIdHandler.bind(this);
  }

  async postThreadHandler(request, h) {
    try {
      const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);

      const useCasePayload = {
        title: request.payload.title,
        body: request.payload.body,
        owner: request.auth.credentials.id,
      };

      const addedThread = await addThreadUseCase.execute(useCasePayload);

      const response = h.response({
        status: 'success',
        message: 'Thread berhasil ditambah',
        data: {
          addedThread,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      const translatedError = DomainErrorTranslator.translate(error);
      const response = h.response({
        status: 'fail',
        message: translatedError.message,
      });
      response.code(translatedError.statusCode);
      return response;
    }
  }

  async getThreadByIdHandler(request, h) {
    try {
      const getThreadByIdUseCase = this._container.getInstance(GetThreadByIdUseCase.name);
      const thread = await getThreadByIdUseCase.execute(request.params.threadId);

      return {
        status: 'success',
        data: {
          thread,
        },
      };
    } catch (error) {
      const translatedError = DomainErrorTranslator.translate(error);
      const response = h.response({
        status: 'fail',
        message: translatedError.message,
      });
      response.code(translatedError.statusCode);
      return response;
    }
  }
}

module.exports = ThreadHandler;
