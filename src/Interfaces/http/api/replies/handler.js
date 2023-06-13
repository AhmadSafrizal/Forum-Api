/* eslint-disable no-undef */
/* eslint-disable no-underscore-dangle */
const AddReplyUseCase = require('../../../../Applications/use_case/AddReplyUseCase');
const DeleteReplyUseCase = require('../../../../Applications/use_case/DeleteReplyUseCase');
const DomainErrorTranslator = require('../../../../Commons/exceptions/DomainErrorTranslator');

class ReplyHandler {
  constructor(container) {
    this._container = container;
    this._postReplyHandler = this.postReplyHandler.bind(this);
    this._deleteReplyByIdHandler = this.deleteReplyByIdHandler.bind(this);
  }

  async postReplyHandler(request, h) {
    try {
      const { threadId, commentId } = request.params;
      const { id: credentialId } = request.auth.credentials;

      const addReplyUseCase = this._container.getInstance(AddReplyUseCase.name);
      const addedReply = await addReplyUseCase.execute({
        content,
        threadId,
        commentId,
        owner: credentialId,
      });

      const res = h.response({
        status: 'success',
        data: {
          addedReply,
        },
      });
      res.code(201);
      return res;
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

  async deleteReplyByIdHandler(request, h) {
    try {
      const { threadId, commentId, replyId } = request.params;
      const { id: credentialId } = request.auth.credentials;

      const deleteReplyUseCase = this._container.getInstance(DeleteReplyUseCase.name);
      await deleteReplyUseCase.execute({
        threadId,
        commentId,
        replyId,
        owner: credentialId,
      });

      return {
        status: 'success',
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

module.exports = ReplyHandler;
