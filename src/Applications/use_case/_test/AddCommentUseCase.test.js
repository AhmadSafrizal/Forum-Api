/* eslint-disable max-len */
/* eslint-disable no-undef */
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const NewComment = require('../../../Domains/comments/entities/NewComment');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddCommentUseCase = require('../AddCommentUseCase');

describe('AddCommentUseCase', () => {
  it('should orchestrating the add coment action correctly', async () => {
    // Arrange
    const addCommentUseCasePayload = {
      content: 'this is coment',
      threadId: 'thread-123',
      owner: 'user-123',
    };

    const expectAddedComment = new AddedComment({
      id: 'comment-123',
      content: addCommentUseCasePayload.content,
      threadId: addCommentUseCasePayload.threadId,
      date: '2023',
      owner: addCommentUseCasePayload.owner,
    });

    // creating dependency of use case
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    // mocking needed function
    mockThreadRepository.verifyAvailableThread = jest.fn().mockImplementation(() => Promise.resolve());
    mockCommentRepository.addComment = jest.fn().mockImplementation(() => Promise.resolve(
      new AddedComment({
        id: 'comment-123',
        content: addCommentUseCasePayload.content,
        threadId: addCommentUseCasePayload.threadId,
        date: '2023',
        owner: addCommentUseCasePayload.owner,
      }),
    ));

    const addCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedComment = await addCommentUseCase.execute(addCommentUseCasePayload);

    // Assert
    expect(addedComment).toStrictEqual(expectAddedComment);
    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(addCommentUseCasePayload.threadId);
    expect(mockCommentRepository.addComment).toBeCalledWith(
      new NewComment({
        content: addCommentUseCasePayload.content,
        threadId: addCommentUseCasePayload.threadId,
        owner: addCommentUseCasePayload.owner,
      }),
    );
  });
});
