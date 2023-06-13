/* eslint-disable max-len */
/* eslint-disable no-underscore-dangle */
const AddedReply = require('../../Domains/replies/entities/AddedReply');
const NewReply = require('../../Domains/replies/entities/NewReply');

class AddReplyUseCase {
  constructor({ commentRepository, threadRepository, replyRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
    this._replyRepository = replyRepository;
  }

  async execute(addReplyUseCasePayload) {
    const newReply = new NewReply(addReplyUseCasePayload);
    await this._threadRepository.verifyAvailableThread(addReplyUseCasePayload.threadId);
    await this._commentRepository.verifyAvailableCommentByThreadId(addReplyUseCasePayload.commentId, addReplyUseCasePayload.threadId);
    const addedReply = await this._replyRepository.addReply(newReply);
    return new AddedReply(addedReply);
  }
}

module.exports = AddReplyUseCase;
