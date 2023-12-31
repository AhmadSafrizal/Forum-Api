/* eslint-disable no-underscore-dangle */
const AddedComment = require('../../Domains/comments/entities/AddedComment');
const NewComment = require('../../Domains/comments/entities/NewComment');

class AddCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(addCommentUseCasePayload) {
    const newComment = new NewComment(addCommentUseCasePayload);
    await this._threadRepository.verifyAvailableThread(addCommentUseCasePayload.threadId);
    const addedComment = await this._commentRepository.addComment(newComment);
    return new AddedComment(addedComment);
  }
}

module.exports = AddCommentUseCase;
