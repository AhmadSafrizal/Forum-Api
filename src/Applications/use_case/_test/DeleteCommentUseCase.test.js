/* eslint-disable max-len */
/* eslint-disable no-undef */
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
  it('should orchestrating the delete comment action correctly', async () => {
    // Arrange
    const deleteCommentUseCasePayload = {
      content: 'this is coment',
      threadId: 'thread-123',
      owner: 'user-123',
    };

    // creating dependency of use case
    const mockCommentRepository = new CommentRepository();

    // mocking needed function
    mockCommentRepository.verifyAvailableCommentByThreadId = jest.fn().mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentOwner = jest.fn().mockImplementation(() => Promise.resolve());
    mockCommentRepository.deleteCommentById = jest.fn().mockImplementation(() => Promise.resolve());

    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
    });

    // Action
    await deleteCommentUseCase.execute(deleteCommentUseCasePayload);

    // Assert
    expect(mockCommentRepository.verifyAvailableCommentByThreadId).toBeCalledWith(deleteCommentUseCasePayload.commentId, deleteCommentUseCasePayload.threadId);
    expect(mockCommentRepository.verifyCommentOwner).toBeCalledWith(deleteCommentUseCasePayload.commentId, deleteCommentUseCasePayload.owner);
    expect(mockCommentRepository.deleteCommentById).toBeCalledWith(deleteCommentUseCasePayload.commentId);
  });
});
