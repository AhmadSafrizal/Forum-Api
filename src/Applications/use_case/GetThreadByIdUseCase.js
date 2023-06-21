/* eslint-disable class-methods-use-this */
/* eslint-disable no-const-assign */
/* eslint-disable no-undef */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */
// const DetailsThread = require('../../Domains/threads/entities/DetailThread');

class GetThreadByIdUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(threadId) {
    this._verifyPayload(threadId);
    const thread = await this._threadRepository.getThreadById(threadId);
    const commentData = await this._commentRepository.getCommentByThreadId(threadId);
    const replies = await this._threadRepository.getRepliesByThreadId(threadId);

    const comments = commentData.map((comment) => ({
      id: comment.id,
      username: comment.username,
      date: comment.date,
      content: comment.is_deleted
        ? '**comment deleted**'
        : comment.content,
      replies: replies
        .filter((reply) => reply.comment_id === comment.id)
        .map((reply) => ({
          id: reply.id,
          content: reply.is_deleted
            ? '**reply deleted**'
            : reply.content,
          date: reply.date,
          username: reply.username,
        })),
    }));

    return {
      ...thread,
      comments,
    };
  }

  _verifyPayload(threadId) {
    if (!threadId) {
      throw new Error('GET_THREAD_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof threadId !== 'string') {
      throw new Error('GET_THREAD_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = GetThreadByIdUseCase;
