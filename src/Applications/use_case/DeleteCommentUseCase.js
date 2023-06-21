/* eslint-disable max-len */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-underscore-dangle */
class DeleteCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(payload) {
    this._verifyPayload(payload);
    await this._threadRepository.verifyAvailableThread(payload.threadId);
    await this._commentRepository.verifyCommentOwner(payload.owner);
    await this._commentRepository.deleteCommentById(payload.commentId);
  }

  _verifyPayload(payload) {
    const { threadId, owner, commentId } = payload;
    if (!threadId || !owner || !commentId) {
      throw new Error('DELETE_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
    }
  }
}

module.exports = DeleteCommentUseCase;
