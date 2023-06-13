/* eslint-disable max-len */
/* eslint-disable no-undef */
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const NewReply = require('../../../Domains/replies/entities/NewReply');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const AddReplyUseCase = require('../AddReplyUseCase');

describe('AddReplyUseCase', () => {
  it('should orchestrating the add reply action correctly', async () => {
    // Arrange
    const addReplyUseCasePayload = {
      content: 'this is reply',
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123',
    };

    const expectAddedReply = new AddedReply({
      id: 'reply-123',
      content: addReplyUseCasePayload.content,
      owner: addReplyUseCasePayload.owner,
    });

    // creating dependency of use case
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockReplyRepository = new ReplyRepository();

    // mocking needed function
    mockThreadRepository.verifyAvailableThread = jest.fn().mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyAvailableCommentByThreadId = jest.fn().mockImplementation(() => Promise.resolve());
    mockReplyRepository.addReply = jest.fn().mockImplementation(() => Promise.resolve(
      new AddedReply({
        id: 'reply-123',
        content: addReplyUseCasePayload.content,
        owner: addReplyUseCasePayload.owner,
      }),
    ));

    const addReplyUseCase = new AddReplyUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    const addedReply = await addReplyUseCase.execute(addReplyUseCasePayload);

    // Assert
    expect(addedReply).toStrictEqual(expectAddedReply);
    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(addReplyUseCasePayload.threadId);
    expect(mockCommentRepository.verifyAvailableCommentByThreadId).toBeCalledWith(addReplyUseCasePayload.commentId, addReplyUseCasePayload.threadId);
    expect(mockReplyRepository.addReply).toBeCalledWith(new NewReply(addReplyUseCasePayload));
  });
});
