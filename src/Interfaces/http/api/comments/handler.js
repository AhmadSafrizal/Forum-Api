/* eslint-disable no-undef */
/* eslint-disable no-underscore-dangle */
const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase');
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase');
const DomainErrorTranslator = require('../../../../Commons/exceptions/DomainErrorTranslator');

class CommentHandler {
  constructor(container) {
    this._container = container;
    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
  }

  async postCommentHandler(request, h) {
    try {
      const addCommmentUseCase = this._container.getInstance(AddCommentUseCase.name);

      const payload = {
        threadId: request.params.threadId,
        content: request.payload.content,
        owner: request.auth.credentials.id,
      };

      const addedComment = await addCommmentUseCase.execute(payload);

      const response = h.response({
        status: 'success',
        message: 'Komentar berhasil ditambah',
        data: {
          addedComment,
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

  async deleteCommentHandler(request, h) {
    try {
      const deleteComment = this._container.getInstance(DeleteCommentUseCase.name);

      const payload = {
        commentId: request.params.commentId,
        threadId: request.params.threadId,
        owner: request.auth.credentials.id,
      };

      await deleteComment.execute(payload);

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

module.exports = CommentHandler;
