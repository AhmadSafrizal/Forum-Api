/* eslint-disable no-const-assign */
/* eslint-disable no-undef */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */
class getThreadByIdUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(threadId) {
    const thread = await this._threadRepository.getThreadById(threadId);
    let comments = await this._commentRepository.getCommentByThreadId(threadId);
    const replies = await this._threadRepository.getRepliesByThreadId(threadId);

    comments = comments.map((comment) => ({
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
}

module.exports = getThreadByIdUseCase;
