/* eslint-disable max-len */
/* eslint-disable no-undef */
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const DeleteReplyUseCase = require('../DeleteReplyUseCase');

describe('DeleteReplyUseCase', () => {
  it('should orchestrating the delete reply action correctly', async () => {
    // Arrange
    const deleteReplyUseCasePayload = {
      replyId: 'reply-123',
      commentId: 'comment-123',
      threadId: 'thread-123',
      owner: 'user-123',
    };

    // creating dependency of use case
    const mockReplyRepository = new ReplyRepository();

    // mocking needed function
    mockReplyRepository.verifyAvailableReply = jest.fn().mockImplementation(() => Promise.resolve());
    mockReplyRepository.verifyReplyOwner = jest.fn().mockImplementation(() => Promise.resolve());
    mockReplyRepository.deleteReplyById = jest.fn().mockImplementation(() => Promise.resolve());

    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
    });

    // Action
    await deleteReplyUseCase.execute(deleteReplyUseCasePayload);

    // Assert
    expect(mockReplyRepository.verifyAvailableReply).toBeCalledWith(deleteReplyUseCasePayload.threadId, deleteReplyUseCasePayload.commentId, deleteReplyUseCasePayload.replyId);
    expect(mockReplyRepository.verifyReplyOwner).toBeCalledWith(deleteReplyUseCasePayload.replyId, deleteReplyUseCasePayload.owner);
    expect(mockReplyRepository.deleteReplyById).toBeCalledWith(deleteReplyUseCasePayload.replyId);
  });
});
