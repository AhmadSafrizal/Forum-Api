/* eslint-disable max-len */
/* eslint-disable no-undef */
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
  it('should orchestrating the delete comment action correctly', async () => {
    // Arrange
    const deleteCommentUseCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user123',
    };

    // creating dependency of use case
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    // mocking needed function
    mockThreadRepository.verifyAvailableThread = jest.fn().mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentOwner = jest.fn().mockImplementation(() => Promise.resolve());
    mockCommentRepository.deleteCommentById = jest.fn().mockImplementation(() => Promise.resolve());

    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    await deleteCommentUseCase.execute(deleteCommentUseCasePayload);

    // Assert
    expect(mockThreadRepository.verifyAvailableThread).toHaveBeenCalledWith(deleteCommentUseCasePayload.threadId);
    expect(mockCommentRepository.verifyCommentOwner).toBeCalledWith(deleteCommentUseCasePayload.owner);
    expect(mockCommentRepository.deleteCommentById).toBeCalledWith(deleteCommentUseCasePayload.commentId);
  });
});
