/* eslint-disable no-undef */
/* eslint-disable no-underscore-dangle */
const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase');
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase');
const DomainErrorTranslator = require('../../../../Commons/exceptions/DomainErrorTranslator');

class CommentHandler {
  constructor(container) {
    this._container = container;
    this._postCommentHandler = this.postCommentHandler.bind(this);
    this._deleteCommentHandler = this.deleteCommentHandler.bind(this);
  }

  async postCommentHandler(request, h) {
    try {
      const useCasePayload = {
        content: request.payload.content,
        threadId: request.payload.threadId,
        owner: request.auth.credentials.id,
      };

      const addCommmentUseCase = this._container.getInstance(AddCommentUseCase.name);
      const addedComment = await addCommmentUseCase.execute(useCasePayload);

      const res = h.response({
        status: 'success',
        message: 'Komentar berhasil ditambah',
        data: {
          addedComment,
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

  async deleteCommentHandler({ params, auth }, h) {
    try {
      const useCasePayload = {
        commentId: params.commentId,
        threadId: params.threadId,
        owner: auth.credentials.id,
      };

      const deleteComment = this._container.getInstance(DeleteCommentUseCase.name);
      await deleteComment.execute(useCasePayload);

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
