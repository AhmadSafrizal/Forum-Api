/* eslint-disable no-underscore-dangle */
class DeleteReplyUseCase {
  constructor({ replyRepository }) {
    this._replyRepository = replyRepository;
  }

  async execute(deleteReplyUseCasePayload) {
    const {
      replyId, commentId, threadId, owner,
    } = deleteReplyUseCasePayload;
    await this._replyRepository.verifyAvailableReply(threadId, commentId, replyId);
    await this._replyRepository.verifyReplyOwner(replyId, owner);
    await this._replyRepository.deleteReplyById(replyId);
  }
}

module.exports = DeleteReplyUseCase;
