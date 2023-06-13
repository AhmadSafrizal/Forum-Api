/* eslint-disable no-underscore-dangle */
class DeleteCommentUseCase {
  constructor({ commentRepository }) {
    this._commentRepository = commentRepository;
  }

  async execute(deleteCommentUseCasePayload) {
    const {
      commentId, threadId, owner,
    } = deleteCommentUseCasePayload;
    await this._commentRepository.verifyAvailableCommentByThreadId(commentId, threadId);
    await this._commentRepository.verifyCommentOwner(commentId, owner);
    await this._commentRepository.deleteCommentById(commentId);
  }
}

module.exports = DeleteCommentUseCase;
